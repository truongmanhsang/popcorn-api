// Import the necessary modules.
import bytes from 'bytes'
import fs from 'fs'
import inquirer from 'inquirer'
import parseTorrent from 'parse-torrent'
import path from 'path'
import pMap from 'p-map'
import webtorrentHealth from 'webtorrent-health'
/**
 * node.js command-line interfaces made easy
 * @external {Command} https://github.com/tj/commander.js
 */
import { Command } from 'commander'

import Server from './Server'
import Logger from './config/Logger'
import MovieProvider from './scraper/providers/MovieProvider'
import promptSchemas from './promptschemas.js'
import ProviderConfig from './models/ProviderConfig'
import providerConfigs from './scraper/configs'
import Setup from './config/Setup'
import ShowProvider from './scraper/providers/ShowProvider'
import Util from './Util'
import {
  name,
  version
} from '../package.json'

/**
 * Class The class for the command line interface.
 * @type {CLI}
 * @flow
 */
export default class CLI {

  /**
   * The name of the CLI provider. Default is `CLI`.
   * @type {string}
   */
  static _Name: string = 'CLI'

  /**
   * The comand line parser to process the CLI inputs.
   * @type {Command}
   */
  _program: Command

  /** Create a CLI object. */
  constructor(): void {
    // Create a logger object, will be overwritten if the --mode option is
    // invoked.
    Logger.getLogger('winston', false, process.env.NODE_ENV === 'test')

    /**
     * The command line parser to process the CLI inputs.
     * @type {Command}
     */
    this._program = new Command()

    // Setup the CLI program.
    this._program.version(`${name} v${version}`)
      .option('-m, --mode <type>',
        'Run the API in a particular mode.',
        /^(pretty|quiet|ugly)$/i)
      .option('--content <type>',
        'Add content to the MongoDB database (animemovie|animeshow|movie|show).',
        /^(animemovie|animeshow|movie|show)$/i, false)
      .option(
        '--providers <env>',
        'Add provider configurations',
        /^(development|production|test)$/i
      )
      .option('-s, --start', 'Start the scraping process')
      .option('--export <collection>',
        'Export a collection to a JSON file.',
        /^(anime|movie|show)$/i, false)
      .option('--import <collection>', 'Import a JSON file to the database.')
    // Extra output on top of the default help output
    this._program.on('--help', CLI._help)

    // Parse the command line arguments.
    this._program.parse(process.argv)
  }

  /**
   * Method for displaying the --help option
   * @returns {undefined}
   */
  static _help(): void {
    logger.info('  Examples:\n')
    logger.info(`    $ ${name} -m <pretty|quiet|ugly>`)
    logger.info(`    $ ${name} --mode <pretty|quiet|ugly>\n`)
    logger.info(`    $ ${name} --content <animemovie|animeshow|movie|show>\n`)
    logger.info(`    $ ${name} --provider\n`)
    logger.info(`    $ ${name} -s`)
    logger.info(`    $ ${name} --start\n`)
    logger.info(`    $ ${name} --export <anime|movie|show>\n`)
    logger.info(`    $ ${name} --import <path-to-json>\n`)
  }

  /**
   * Handle the --mode CLI option.
   * @param {?string} [m] - The mode to run the API in.
   * @returns {undefined}
   */
  _mode(m?: string): void {
    const start = this._program.start || false
    const testing = process.env.NODE_ENV === 'test'

    switch (m) {
      case 'quiet':
        Server.setupApi(start, false, true)
        break
      case 'ugly':
        Server.setupApi(start, false, testing)
        break
      case 'pretty':
      default:
        Server.setupApi(start, !testing, testing)
        break
    }
  }

  /**
   * Return a torrent object for a movie.
   * @param {!string} magnet - The magnet url to bind.
   * @param {!Object} health - The health object for seeders and peers.
   * @param {!Object} remote - The remote data object from 'parseTorrent'.
   * @returns {Object} - A torrent object for a movie.
   */
  _movieTorrent(magnet: string, health: Object, remote: Object): Object {
    return {
      url: magnet,
      seeds: health.seeds,
      peers: health.peers,
      size: remote.length,
      filesize: bytes(remote.length),
      provider: CLI._Name
    }
  }

  /**
   * Return a torrent object for a show.
   * @param {!string} magnet - The magnet url to bind.
   * @param {!Object} health - The health object for seeders and peers.
   * @returns {Object} - A torrent object for a show.
   */
  _tvshowTorrent(magnet: string, health: Object): Object {
    return {
      url: magnet,
      seeds: health.seeds,
      peers: health.peers,
      provider: CLI._Name
    }
  }

  /**
   * Get a torrent object based on the type.
   * @param {!string} link - The link to bind to the torrent object.
   * @param {!string} type - The type of torrent object (movie|show).
   * @returns {Promise<Object, undefined>} - A torrent object for a movie or
   * show.
   */
  _getTorrent(link: string, type: string): Promise<Object, undefined> {
    return new Promise((resolve, reject) => {
      return parseTorrent.remote(link, (err, remote) => {
        if (err) {
          return reject(err)
        }

        const magnet = parseTorrent.toMagnetURI(remote)
        return webtorrentHealth(magnet).then(health => resolve(
          this[`_${type}Torrent`](magnet, health, remote)
        ))
      })
    })
  }

  /**
   * Handle the --content CLI option to insert a movie torrent.
   * @param {!string} t - The content type to add to the database.
   * @returns {Promise<Movie, Error>} - The inserted movie.
   */
  _moviePrompt(t: string): Promise<Movie, Error> {
    const { imdb, torrent, movieQuality, language } = promptSchemas
    const movieSchema: Array<Object> = [
      imdb,
      torrent,
      movieQuality,
      language
    ]

    return inquirer.prompt(movieSchema).then(res => {
      const { imdb, quality, language, torrent } = res
      const movie = {
        slugYear: imdb,
        torrents: {}
      }
      const type = MovieProvider.Types.Movie
      const movieProvider = new MovieProvider({
        name: CLI._Name,
        modelType: t,
        type
      })

      return this._getTorrent(torrent, type).then(res => {
        const args = [movie, res, quality, language]
        movieProvider.attachTorrent(...args)

        return movieProvider.getContent(movie)
      })
    }).then(() => process.exit(0))
      .catch(err => {
        logger.error(`An error occurred: '${err}'`)
        return process.exit(1)
      })
  }

  /**
   * Handle the --content CLI option to insert a movie torrent.
   * @param {!string} t - The content type to add to the database.
   * @returns {Promise<Show, Error>} - The inserted show.
   */
  _showPrompt(t: string): Promise<Show, Error> {
    const {
      imdb,
      torrent,
      showQuality,
      season,
      episode,
      dateBased
    } = promptSchemas
    const showSchema: Array<Object> = [
      imdb,
      torrent,
      showQuality,
      season,
      episode,
      dateBased
    ]

    return inquirer.prompt(showSchema).then(res => {
      const { imdb, season, episode, quality, dateBased, torrent } = res
      const show = {
        slug: imdb,
        dateBased,
        episodes: {}
      }
      const type = MovieProvider.Types.Show
      const showProvider = new ShowProvider({
        name: CLI._Name,
        modelType: t,
        type
      })

      return this._getTorrent(torrent, type).then(res => {
        const args = [show, res, season, episode, quality]
        showProvider.attachTorrent(...args)

        return showProvider.getContent(show)
      })
    }).then(() => process.exit(0))
      .catch(err => {
        logger.error(`An error occurred: '${err}'`)
        return process.exit(1)
      })
  }

  /**
   * Handle the --content CLI option.
   * @param {!string} t - The content type to add to the database.
   * @returns {undefined}
   */
  _content(t: string): void {
    Setup.connectMongoDb()

    switch (t) {
      case 'animemovie':
        return this._moviePrompt(t)
      case 'animeshow':
        return this._showPrompt(t)
      case 'movie':
        return this._moviePrompt(t)
      case 'show':
        return this._showPrompt(t)
      default:
        logger.error(`'${t}' is not a valid option for content!`)
        return process.exit(1)
    }
  }

  /**
   * Handle the --providers CLI option.
   * @param {?string} [p] - The environment to run the --providers option in.
   * @returns {undefined}
   */
  _providers(p?: string): void {
    process.env.NODE_ENV = p

    return Setup.connectMongoDb().then(() => {
      return pMap(providerConfigs, async p => {
        const provider = await ProviderConfig.findOne({
          _id: p.name
        }).exec()

        return provider
          ? ProviderConfig.findOneAndUpdate({
            _id: p.name
          }, new ProviderConfig(p), {
            new: true
          }).exec()
          : new ProviderConfig(p).save()
      }).then(res => logger.info(`Inserted: '${res.length}' provider(s)}`))
        .then(() => Setup.disconnectMongoDb())
    })
  }

  /**
   * Handle the --export CLI option.
   * @param {!string} e - The collection to export.
   * @returns {Promise<string, undefined>} - The promise to export a collection.
   */
  _export(e: string): Promise<string, undefined> {
    return Util.exportCollection(e)
      .then(() => process.exti(0))
      .catch(err => {
        logger.error(`An error occured: ${err}`)
        return process.exit(1)
      })
  }

  /**
   * Handle the --import CLI option.
   * @param {!string} i - The collection to import.
   * @throws {Error} - Error: no such file found for 'JSON_FILE'
   * @returns {Promise<string, undefined>|undefined} - The promise to import a
   * collection.
   */
  _import(i: string): Promise<string, undefined> | undefined {
    if (!fs.existsSync(i)) {
      logger.error(`File '${i}' does not exists!`)
      return process.exit(1)
    }

    const { confirm } = promptSchemas
    return inquirer.prompt([confirm]).then(({ confirm }) => {
      if (confirm) {
        return Util.importCollection(path.basename(i, '.json'), i)
      }

      return process.exit(0)
    }).catch(err => {
      logger.error(`An error occured: ${err}`)
      return process.exit(1)
    })
  }

  /**
   * Run the CLI program.
   * @returns {undefined}
   */
  run(): void {
    if (this._program.mode) {
      return this._mode(this._program.mode)
    } else if (this._program.content) {
      return this._content(this._program.content)
    } else if (this._program.providers) {
      return this._providers(this._program.provider)
    } else if (this._program.export) {
      return this._export(this._program.export)
    } else if (this._program.import) {
      return this._import(this._program.import)
    }

    logger.error('\n  \x1b[31mError:\x1b[36m No valid command given. Please check below:\x1b[0m')
    return this._program.help()
  }

}
