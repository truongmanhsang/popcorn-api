// Import the neccesary modules.
import fs from 'fs';
import path from 'path';
import program from 'commander';
import prompt from 'prompt';

import Index from './Index';
import Logger from './config/Logger';
// import MovieProvider from './scraper/providers/MovieProvider';
// import ShowProvider from './scraper/providers/ShowProvider';
import Util from './Util';
import {
  name,
  version
} from '../package.json';

/** Class The class for the command line interface. */
export default class CLI {

  /**
   * The name of the CLI provider.
   * @type {String}
   */
  static _ProviderName = 'CLI';

  /**
   * The imdb property.
   * @type {Object}
   */
  _imdb = {
    description: 'The imdb id of the show/movie to add (tt1234567)',
    type: 'string',
    pattern: /^(tt\d{7}|)|^(.*)/i,
    message: 'Not a valid imdb id.',
    required: true
  };

  /**
   * The torrent property.
   * @type {Object}
   */
  _torrent = {
    description: 'The link to the torrent to add',
    type: 'string',
    message: 'Not a valid torrent.',
    required: true
  };

  /**
   * The quality property.
   * @type {Object}
   */
  _quality = {
    description: 'The quality of the torrent (480p | 720p | 1080p)',
    type: 'string',
    pattern: /^(480p|720p|1080p)/i,
    message: 'Not a valid quality.',
    required: true
  };

  /**
   * The language property.
   * @type {Object}
   */
  _language = {
    description: 'The language of the torrent to add (en, fr, jp)',
    type: 'string',
    pattern: /^([a-zA-Z]{2})/i,
    message: 'Not a valid language',
    required: true
  };

  /**
   * The season property.
   * @type {Object}
   */
  _season = {
    description: 'The season number of the torrent',
    type: 'integer',
    pattern: /^(\d+)/i,
    message: 'Not a valid season.',
    required: true
  };

  /**
   * The episode property.
   * @type {Object}
   */
  _episode = {
    description: 'The episode number of the torrent',
    type: 'integer',
    pattern: /^(\d+)/i,
    message: 'Not a valid episode.',
    required: true
  };

  /**
   * The confirm property.
   * @type {Object}
   */
  _confirm = {
    description: 'Do you really want to import a collection? This can override the current data!',
    type: 'string',
    pattern: /^(yes|no|y|n)$/i,
    message: 'Type yes/no',
    required: true,
    default: 'no'
  };

  /**
   * The schema used by `prompt` insert a movie.
   * @type {Object}
   */
  _movieSchema = {
    properties: {
      imdb: this._imdb,
      language: this._language,
      torrent: this._torrent,
      quality: this._quality
    }
  };

  /**
   * The schema used by `prompt` insert a show.
   * @type {Object}
   */
  _showSchema = {
    properties: {
      imdb: this._imdb,
      season: this._season,
      episode: this._episode,
      torrent: this._torrent,
      quality: this._quality
    }
  };

  /**
   * The schema used by `prompt` to confirm an import.
   * @type {Object}
   */
  _importSchema = {
    properties: {
      confirm: this._confirm
    }
  };

  /**
   * The schema used by `prompt` to confirm an import.
   * @type {Object}
   */
  _importSchema = {
    properties: {
      confirm: this._confirm
    }
  };

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
      // .option('-s, --start', '') // TODO: Option to start or not start the scraping process.
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
    switch (m) {
    case 'pretty':
      new Index();
      break;
    case 'quiet':
      new Index({
        quiet: true
      });
      break;
    case 'ugly':
      new Index({
        pretty: false
      });
      break;
    default:
      new Index();
    }
  }

  /**
   * Handle the --content CLI option.
   * @param {!String} c - The content type to add to the database.
   * @returns {undefined}
   */
  _content(c) {
    switch (c) {
    case 'animemovie':
      // TODO: Create method to insert animemovie data.
      break;
    case 'animeshow':
      // TODO: Create method to insert animeshow data.
      break;
    case 'movie':
      // TODO: Create method to insert movie data.
      break;
    case 'show':
      // TODO: Create method to insert show data.
      break;
    default:
      logger.error(`'${c}' is not a valid option for content!`);
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

    prompt.get(this._confirmSchema, (err, res) => {
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
