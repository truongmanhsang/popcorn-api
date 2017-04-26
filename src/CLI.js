// Import the neccesary modules.
import bytes from 'bytes';
import fs from 'fs';
import parseTorrent from 'parse-torrent';
import path from 'path';
import program from 'commander';
import prompt from 'prompt';
import webtorrentHealth from 'webtorrent-health';

import Index from './Index';
import Logger from './config/Logger';
import MovieProvider from './scraper/providers/MovieProvider';
import Setup from './config/Setup';
import ShowProvider from './scraper/providers/ShowProvider';
import Util from './Util';
import {
  name,
  version
} from '../package.json';
import {
  confirmSchema,
  movieSchema,
  showSchema
} from './promptschemas.js';

/** Class The class for the command line interface. */
export default class CLI {

  /**
   * The name of the CLI provider.
   * @type {String}
   */
  static _Name = 'CLI';

  /** Create a cli object. */
  constructor() {
    // Create a logger object, will be overwritten if the --modus option is
    // invoked.
    Logger.getLogger('winston', false);

    // Setup the CLI program.
    program
      .version(`${name} v${version}`)
      .option('-m, --modus <type>',
              'Run the API in a particular mode.',
              /^(pretty|quiet|ugly)$/i)
      .option('--content <type>',
              'Add content to the MongoDB database (anime|show|movie).',
              /^(anime|movie|show)$/i, false)
      // .option('--providers', '') // TODO: Allow admin to add new provider configs via CLI
      .option('-s, --start', 'Start the scraping process')
      .option('--export <collection>',
              'Export a collection to a JSON file.',
              /^(anime|movie|show)$/i, false)
      .option('--import <collection>', 'Import a JSON file to the database.');

    // Extra output on top of the default help output
    program.on('--help', () => {
      logger.info('  Examples:\n');
      logger.info('    $ popcorn-api -m <pretty|quiet|ugly>');
      logger.info('    $ popcorn-api --modus <pretty|quiet|ugly>\n');
      logger.info('    $ popcorn-api --content <anime|movie|show>\n');
      logger.info('    $ popcorn-api --providers\n');
      logger.info('    $ popcorn-api -s');
      logger.info('    $ popcorn-api --start\n');
      logger.info('    $ popcorn-api --export <anime|movie|show>\n');
      logger.info('    $ popcorn-api --import <path-to-json>\n');
    });

    // Parse the command line arguments.
    program.parse(process.argv);
  }

  /**
   * Handle the --modus CLI option.
   * @param {!String} m - The modus to run the API in.
   * @returns {undefined}
   */
  _modus(m) {
    const start = program.start ? program.start : false;

    switch (m) {
    case 'pretty':
      new Index({ start });
      break;
    case 'quiet':
      new Index({
        quiet: true,
        start
      });
      break;
    case 'ugly':
      new Index({
        pretty: false,
        start
      });
      break;
    default:
      new Index({ start });
    }
  }

  /**
   * Return a torrent object for a movie.
   * @param {String} magnet - The magnet url to bind.
   * @param {Object} health - The health object for seeders and peers.
   * @param {Object} remote - The remote data object from 'parseTorrent'.
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
    };
  }

  /**
   * Return a torrent object for a show.
   * @param {String} magnet - The magnet url to bind.
   * @param {Object} health - The health object for seeders and peers.
   * @returns {Object} - A torrent object for a show.
   */
  _tvshowTorrent(magnet, health) {
    return {
      url: magnet,
      seeds: health.seeds,
      peers: health.peers,
      provider: CLI._Name
    };
  }

  /**
   * Get a torrent object based on the type.
   * @param {String} link - The link to bind to the torrent object.
   * @param {String} type - The type of torrent object (movie|show).
   * @returns {Object} - A torrent object for a movie or show.
   */
  _getTorrent(link, type) {
    return new Promise((resolve, reject) => {
      return parseTorrent.remote(link, (err, remote) => {
        if (err) return reject(err);

        const magnet = parseTorrent.toMagnetURI(remote);
        return webtorrentHealth(magnet).then(health => resolve(
          this[`_${type}Torrent`](magnet, health, remote)
        ));
      });
    });
  }

  /**
   * Handle the --content CLI option to insert a movie torrent.
   * @param {String} t - The content type to add to the database.
   * @returns {void}
   */
  _moviePrompt(t) {
    prompt.get(movieSchema, async(err, res) => {
      try {
        if (err) throw err;

        const { imdb, quality, language, torrent } = res;
        const movie = {
          slug: imdb,
          slugYear: imdb,
          quality,
          language,
          type: t,
          torrents: {}
        };
        const type = MovieProvider.Types.Movie;
        const movieProvider = new MovieProvider({
          name: CLI._Name,
          modelType: t,
          type
        });

        const torrentObj = await this._getTorrent(torrent, type);
        const args = [movie, torrentObj, quality, language];
        movieProvider.attachTorrent(...args);

        await movieProvider.getContent(movie);
        return process.exit(0);
      } catch (err) {
        logger.error(`An error occurred: '${err}'`);
        process.exit(1);
      }
    });
  }

  /**
   * Handle the --content CLI option to insert a movie torrent.
   * @param {String} t - The content type to add to the database.
   * @returns {void}
   */
  _showPrompt(t) {
    prompt.get(showSchema, async(err, res) => {
      try {
        if (err) throw err;

        const { imdb, season, episode, quality, dateBased, torrent } = res;
        const show = {
          slug: imdb,
          season,
          episode,
          quality,
          dateBased,
          type: t,
          episodes: {}
        };
        const type = MovieProvider.Types.Show;
        const showProvider = new ShowProvider({
          name: CLI._Name,
          modelType: t,
          type
        });

        const torrentObj = await this._getTorrent(torrent, type);
        const args = [show, torrentObj, season, episode, quality];
        showProvider.attachTorrent(...args);

        await showProvider.getContent(show);
        return process.exit(0);
      } catch (err) {
        logger.error(err);
        logger.error(`An error occurred: '${err}'`);
        process.exit(1);
      }
    });
  }

  /**
   * Handle the --content CLI option.
   * @param {!String} t - The content type to add to the database.
   * @returns {undefined}
   */
  _content(t) {
    Setup.connectMongoDB();

    switch (t) {
    case 'animemovie':
      return this._moviePrompt(t);
    case 'animeshow':
      return this._showPrompt(t);
    case 'movie':
      return this._moviePrompt(t);
    case 'show':
      return this._showPrompt(t);
    default:
      logger.error(`'${t}' is not a valid option for content!`);
      return process.exit(1);
    }
  }

  /**
   * Handle the --providers CLI option.
   * @returns {undefined}
   */
  _providers() {
    throw new Error('This method needs to be implemented!');
  }

  /**
   * Handle the --export CLI option.
   * @param {!String} e - The collection to export.
   * @returns {Promise} - The promise to export a collection.
   */
  _export(e) {
    return Util.exportCollection(e);
  }

  /**
   * Handle the --import CLI option.
   * @param {!String} i - The collection to import.
   * @returns {Promise} - The promise to import a collection.
   */
  _import(i) {
    if (!fs.existsSync(i)) {
      logger.error(`File '${i}' does not exists!`);
      return process.exit(1);
    }

    if (process.env.NODE_ENV === 'test')
      return Util.importCollection(path.basename(i, '.json'), i);

    prompt.get(confirmSchema, (err, res) => {
      if (err) {
        logger.error(`An error occured: ${err}`);
        return process.exit(1);
      }

      if (res.confirm.test(/^(y|yes)/i))
        return Util.importCollection(path.basename(i, '.json'), i);

      return process.exit(0);
    });
  }

  /**
   * Run the CLI program.
   * @returns {undefined}
   */
  run() {
    if (program.modus) {
      return this._modus(program.modus);
    } else if (program.content) {
      return this._content(program.content);
    } else if (program.providers) {
      return this._providers(program.providers);
    } else if (program.export) {
      return this._export(program.export);
    } else if (program.import) {
      return this._import(program.import);
    }

    logger.error('\n  \x1b[31mError:\x1b[36m No valid command given. Please check below:\x1b[0m');
    program.help();
  }

}
