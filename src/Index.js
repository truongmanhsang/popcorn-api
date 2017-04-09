// Import the neccesary modules.
import cluster from 'cluster';
import domain from 'domain';
import Express from 'express';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { CronJob } from 'cron';

import Setup from './config/Setup';
import Routes from './config/Routes';
import Scraper from './Scraper';
import Logger from './config/Logger';
import { name } from '../package.json';

// The path to the temporary directory. Default is `./tmp`.
global.tempDir = path.join(process.cwd(), 'tmp');

/**
 * Class for starting the API.
 *
 * @example
 * // Simply start the API by creating a new instance of the Index class.
 * const index = new Index();
 *
 * @example
 * // Or override the default configuration of the Index class.
 * const index = new Index({
 *    start: true,
 *    pretty: true,
 *    verbose: false
 * });
 */
export default class Index {

  /**
   * The cron time for scraping torrents. Default is `0 0 *\/6 * * *`.
   * @type {String}
   */
  static _cronTime = '0 0 */6 * * *';

  /**
   * The port on which the API will run on. Default is `5000`.
   * @type {Number}
   */
  static _port = 5000;

  /**
   * The timezone the conjob will hold. Default is `America/Los_Angeles`.
   * @type {String}
   */
  static _timeZone = 'America/Los_Angeles';

  /**
   * The amount of workers on the cluster. Default is `2`.
   * @type {Number}
   */
  static _workers = 2;

  /**
   * The express object.
   * @type {Object}
   */
  static _app = new Express();

  /**
   * The http server object.
   * @type {Object}
   */
  static _server = http.createServer(Index._app);

  /**
   * Create an index class.
   * @param {Object} config - Configuration for the API.
   * @param {Boolean} [config.start=true] - Start the scraping process.
   * @param {Boolean} [config.pretty=true] - Pretty output with Winston logging.
   * @param {Boolean} [config.verbose=false] - Debug mode for no output.
   */
  constructor({start = true, pretty = true, verbose = false} = {}) {
    // Setup the global logger object.
    Logger.getLogger('winston', pretty, verbose);

    // Setup the MongoDB configuration and ExpressJS configuration.
    new Setup(Index._app, pretty, verbose);

    // Setup the API routes.
    new Routes(Index._app);

    // Start the API.
    Index._startAPI(start);
  }

  /**
   * Create an emty file.
   * @param {String} path - The path to the file to create.
   * @returns {void}
   */
  static _createEmptyFile(path) {
    fs.createWriteStream(path).end();
  }

  /**
   * Removes all the files in the temporary directory.
   * @param {String} [tmpPath=popcorn-api/tmp] - The path to remove all the
   * files within (Default is set in the `config/constants.js`).
   * @returns {void}
   */
  static _resetTemp(tmpPath = tempDir) {
    const files = fs.readdirSync(tmpPath);
    files.forEach(file => {
      const stats = fs.statSync(path.join(tmpPath, file));
      if (stats.isDirectory()) {
        Index._resetTemp(file);
      } else if (stats.isFile()) {
        fs.unlinkSync(path.join(tmpPath, file));
      }
    });
  }

  /**
   * Create the temporary directory.
   * @returns {void}
   */
  static _createTemp() {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (fs.existsSync(tempDir)) Index._resetTemp();
  }

  /**
   * Reset the default log file.
   * @returns {void}
   */
  static _resetLog() {
    const logFile = path.join(tempDir, `${name}.log`);
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  }

  /**
   * Function to start the API.
   * @param {Boolean} [start=true] - Start the scraping.
   * @returns {void}
   */
  static _startAPI(start = true) {
    if (cluster.isMaster) { // Check is the cluster is the master
      // Clear the log files from the temp directory.
      Index._resetLog();

      // Setup the temporary directory
      Index._createTemp();

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, Index._workers); i++) // eslint-disable-line semi-spacing
        cluster.fork();

      // Check for errors with the workers.
      cluster.on('exit', worker => {
        logger.error(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // WARNING: Domain module is pending deprication: https://nodejs.org/api/domain.html
      const scope = domain.create();
      scope.run(() => {
        logger.info('API started');
        try {
          new CronJob({
            cronTime: Index._cronTime,
            timeZone: Index._timeZone,
            onComplete: () => Scraper.status = 'Idle',
            onTick: Scraper.scrape,
            start
          });

          Scraper.updated = 0;
          Scraper.status = 'Idle';
          if (start) Scraper.scrape();
        } catch (err) {
          return logger.error(err);
        }
      });
      scope.on('error', err => logger.error(err));
    } else {
      Index._server.listen(Index._port);
    }
  }

  /**
   * Function to stop the API from running.
   * @returns {void}
   */
  static closeAPI() {
    Index._server.close(() => {
      logger.info('Closed out remaining connections.');
      process.exit();
    });
  }

}
