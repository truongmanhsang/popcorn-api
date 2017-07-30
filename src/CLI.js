// Import the neccesary modules.
import bytes from 'bytes'
import fs from 'fs'
import parseTorrent from 'parse-torrent'
import path from 'path'
import prompt from 'prompt'
import webtorrentHealth from 'webtorrent-health'
/**
 * node.js command-line interfaces made easy
 * @external {Command} https://github.com/tj/commander.js
 */
import { Command } from 'commander'

import Index from './Index'
import Logger from './config/Logger'
import MovieProvider from './scraper/providers/MovieProvider'
import ProviderConfig from './models/ProviderConfig'
import Setup from './config/Setup'
import ShowProvider from './scraper/providers/ShowProvider'
import Util from './Util'
import {
  name,
  version
} from '../package.json'
import {
  confirmSchema,
  movieSchema,
  providerSchema,
  showSchema
} from './promptschemas.js'

/** Class The class for the command line interface. */
export default class CLI {

  /**
   * The name of the CLI provider. Default is `CLI`.
   * @type {String}
   */
  static _Name = 'CLI'

  /**
   * The comand line parser to process the CLI inputs.
   * @type {Command}
   */
  _program

  /**
   * Flag for when in testing mode.
   * @type {boolean}
   */
  _testing

  /** Create a cli object. */
  constructor() {
    // Create a logger object, will be overwritten if the --mode option is
    // invoked.
    Logger.getLogger('winston', false)

    /**
     * The comand line parser to process the CLI inputs.
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
      .option('--provider', 'Add provider configurations')
      .option('-s, --start', 'Start the scraping process')
      .option('--export <collection>',
        'Export a collection to a JSON file.',
        /^(anime|movie|show)$/i, false)
      .option('--import <collection>', 'Import a JSON file to the database.')

    // Extra output on top of the default help output
    this._program.on('--help', () => {
      logger.info('  Examples:\n')
      logger.info(`    $ ${name} -m <pretty|quiet|ugly>`)
      logger.info(`    $ ${name} --mode <pretty|quiet|ugly>\n`)
      logger.info(`    $ ${name} --content <animemovie|animeshow|movie|show>\n`)
      logger.info(`    $ ${name} --provider\n`)
      logger.info(`    $ ${name} -s`)
      logger.info(`    $ ${name} --start\n`)
      logger.info(`    $ ${name} --export <anime|movie|show>\n`)
      logger.info(`    $ ${name} --import <path-to-json>\n`)
    })

    // Parse the command line arguments.
    this._program.parse(process.argv)
  }

  /**
   * Handle the --mode CLI option.
   * @param {!String} m - The mode to run the API in.
   * @returns {undefined}
   */
  _mode(m) {
    const start = this._program.start ? this._program.start : false
    const testing = this._testing ? this._testing : false

    switch (m) {
      case 'pretty':
        Index.setupApi(start, !testing, testing)
        break
      case 'quiet':
        Index.setupApi(start, false, true)
        break
      case 'ugly':
        Index.setupApi(start, false, testing)
        break
      default:
        Index.setupApi(start, !testing, testing)
    }
  }

  /**
   * Return a torrent object for a movie.
   * @param {!String} magnet - The magnet url to bind.
   * @param {!Object} health - The health object for seeders and peers.
   * @param {!Object} remote - The remote data object from 'parseTorrent'.
   * @returns {Object} - A torrent object for a movie.
   */
  _movieTorrent(magnet, health, remote) {
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
   * @param {!String} magnet - The magnet url to bind.
   * @param {!Object} health - The health object for seeders and peers.
   * @returns {Object} - A torrent object for a show.
   */
  _tvshowTorrent(magnet, health) {
    return {
      url: magnet,
      seeds: health.seeds,
      peers: health.peers,
      provider: CLI._Name
    }
  }

  /**
   * Get a torrent object based on the type.
   * @param {!String} link - The link to bind to the torrent object.
   * @param {!String} type - The type of torrent object (movie|show).
   * @returns {Promise<Object, undefined>} - A torrent object for a movie or
   * show.
   */
  _getTorrent(link, type) {
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
   * @param {!String} t - The content type to add to the database.
   * @returns {undefined}
   */
  _moviePrompt(t) {
    prompt.get(movieSchema, async (err, res) => {
      try {
        if (err) {
          throw err
        }

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

        const torrentObj = await this._getTorrent(torrent, type)
        const args = [movie, torrentObj, quality, language]
        movieProvider.attachTorrent(...args)

        await movieProvider.getContent(movie)
        process.exit(0)
      } catch (err) {
        logger.error(`An error occurred: '${err}'`)
        process.exit(1)
      }
    })
  }

  /**
   * Handle the --content CLI option to insert a movie torrent.
   * @param {!String} t - The content type to add to the database.
   * @returns {undefined}
   */
  _showPrompt(t) {
    prompt.get(showSchema, async (err, res) => {
      try {
        if (err) {
          throw err
        }

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

        const torrentObj = await this._getTorrent(torrent, type)
        const args = [show, torrentObj, season, episode, quality]
        showProvider.attachTorrent(...args)

        await showProvider.getContent(show)
        process.exit(0)
      } catch (err) {
        logger.error(`An error occurred: '${err}'`)
        process.exit(1)
      }
    })
  }

  /**
   * Handle the --content CLI option.
   * @param {!String} t - The content type to add to the database.
   * @returns {undefined}
   */
  _content(t) {
    Setup.connectMongoDB()

    switch (t) {
      case 'animemovie':
        this._moviePrompt(t)
        break
      case 'animeshow':
        this._showPrompt(t)
        break
      case 'movie':
        this._moviePrompt(t)
        break
      case 'show':
        this._showPrompt(t)
        break
      default:
        logger.error(`'${t}' is not a valid option for content!`)
        process.exit(1)
    }
  }

  /**
   * Handle the --provider CLI option.
   * @returns {undefined}
   */
  _provider() {
    prompt.get(providerSchema, (err, res) => {
      if (err) {
        logger.error(err)
        process.exit(1)
      }

      Setup.connectMongoDB()

      /**
       * XXX: BS query should be a schemaless object. Only way to do this for
       * now is to have the user insert a JSON string and parse it to an
       * object. Of course this not userfriendly.
       */
      res.query = JSON.parse(res.query)
      const providerConfig = new ProviderConfig(res)

      return providerConfig.save().then(res => {
        logger.info(`Saved provider configuration '${res.name}'`)
        process.exit(0)
      }).catch(err => {
        logger.error(`An error occurred: '${err}'`)
        process.exit(0)
      })
    })
  }

  /**
   * Handle the --export CLI option.
   * @param {!String} e - The collection to export.
   * @returns {Promise<String, undefined>} - The promise to export a collection.
   */
  _export(e) {
    return Util.Instance.exportCollection(e)
  }

  /**
   * Handle the --import CLI option.
   * @param {!String} i - The collection to import.
   * @throws {Error} - Error: no such file found for 'JSON_FILE'
   * @returns {Promise<String, undefined>|undefined} - The promise to import a
   * collection.
   */
  _import(i) {
    if (!fs.existsSync(i)) {
      logger.error(`File '${i}' does not exists!`)
      process.exit(1)
    }

    if (process.env.NODE_ENV === 'test') {
      return Util.Instance.importCollection(path.basename(i, '.json'), i)
    }

    prompt.get(confirmSchema, (err, res) => {
      if (err) {
        logger.error(`An error occured: ${err}`)
        process.exit(1)
      }

      if (res.confirm.test(/^(y|yes)/i)) {
        return Util.Instance.importCollection(path.basename(i, '.json'), i)
      }

      process.exit(0)
    })
  }

  /**
   * Run the CLI program.
   * @returns {undefined}
   */
  run() {
    if (this._program.mode) {
      return this._mode(this._program.mode)
    } else if (this._program.content) {
      return this._content(this._program.content)
    } else if (this._program.provider) {
      return this._provider(this._program.provider)
    } else if (this._program.export) {
      return this._export(this._program.export)
    } else if (this._program.import) {
      return this._import(this._program.import)
    }

    logger.error('\n  \x1b[31mError:\x1b[36m No valid command given. Please check below:\x1b[0m')
    this._program.help()
  }

}
