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
import Util from './Util';
import {
  cronTime,
  master,
  port,
  statusFile,
  tempDir,
  timeZone,
  updatedFile,
  workers
} from './config/constants';
import { name } from '../package.json';

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
   * Create an index class.
   * @param {Object} config - Configuration for the API.
   * @param {Boolean} [config.start=true] - Start the scraping process.
   * @param {Boolean} [config.pretty=true] - Pretty output with Winston logging.
   * @param {Boolean} [config.verbose=false] - Debug mode for no output.
   */
  constructor({start = true, pretty = true, verbose = false} = {}) {
    // The express object.
    const _app = new Express();

    // Setup the global logger object.
    Logger.getLogger('winston', pretty, verbose);

    // Setup the MongoDB configuration and ExpressJS configuration.
    new Setup(_app, pretty, verbose);

    // Setup the API routes.
    new Routes(_app);

    /**
     * The http server object.
     * @type {Object}
     */
    Index._server = http.createServer(_app);

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
   * @param {String} [tmpPath=popcorn-api/tmp] - The path to remove all the files
   * within (Default is set in the `config/constants.js`).
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

    Index._createEmptyFile(path.join(tempDir, statusFile));
    Index._createEmptyFile(path.join(tempDir, updatedFile));
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
      for (let i = 0; i < Math.min(os.cpus().length, workers); i++) // eslint-disable-line semi-spacing
        cluster.fork();

      // Check for errors with the workers.
      cluster.on('exit', worker => {
        Util.onError(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // Start the cronjob.
      if (master) {
        // WARNING: Domain module is pending deprication: https://nodejs.org/api/domain.html
        const scope = domain.create();
        scope.run(() => {
          logger.info('API started');
          try {
            new CronJob({
              cronTime,
              timeZone,
              onComplete: Util.setStatus,
              onTick: () => new Scraper(),
              start
            });

            Util.setLastUpdated(0);
            Util.setStatus();
            if (start) Index._scraper.scrape();
          } catch (err) {
            return Util.onError(err);
          }
        });
        scope.on('error', err => Util.onError(err));
      }
    } else {
      Index._server.listen(port);
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
