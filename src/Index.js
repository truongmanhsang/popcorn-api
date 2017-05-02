// Import the neccesary modules.
import cluster from 'cluster';
import domain from 'domain';
/**
 * Fast, unopinionated, minimalist web framework for node.
 * @external {Express} https://github.com/expressjs/express
 */
import Express from 'express';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { CronJob } from 'cron';

import Logger from './config/Logger';
import Routes from './config/Routes';
import Scraper from './Scraper';
import Setup from './config/Setup';

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
 *    quiet: false
 * });
 */
export default class Index {

  /**
   * The express object.
   * @type {Express}
   */
  static _App = new Express();

  /**
   * The cron time for scraping torrents. Default is `0 0 *\/6 * * *`.
   * @type {String}
   */
  static _CronTime = '0 0 */6 * * *';

  /**
   * The port on which the API will run on. Default is `5000`.
   * @type {Number}
   */
  static _Port = 5000;

  /**
   * The http server object.
   * @type {http.Server}
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   */
  static _Server = http.createServer(Index._App);

  /**
   * The timezone the conjob will hold. Default is `America/Los_Angeles`.
   * @type {String}
   */
  static _TimeZone = 'America/Los_Angeles';

  /**
   * The amount of workers on the cluster. Default is `2`.
   * @type {Number}
   */
  static _Workers = 2;

  /**
   * Create an index class.
   * @param {Object} config - Configuration for the API.
   * @param {!Boolean} [config.start=true] - Start the scraping process.
   * @param {?Boolean} [config.pretty=true] - Pretty output with Winston
   * logging.
   * @param {?Boolean} [config.quiet=false] - No output.
   */
  constructor({start = true, pretty = true, quiet = false} = {}) {
    // Setup the global logger object.
    Logger.getLogger('winston', pretty, quiet);

    // Setup the MongoDB configuration and ExpressJS configuration.
    new Setup(Index._App, pretty);

    // Setup the API routes.
    new Routes(Index._App);

    // Start the API.
    Index._startAPI(start);
  }

  /**
   * Create an empty file.
   * @param {!String} path - The path to the file to create.
   * @returns {undefined}
   */
  static _createEmptyFile(path) {
    fs.createWriteStream(path).end();
  }

  /**
   * Removes all the files in the temporary directory.
   * @returns {undefined}
   */
  static _resetTemp() {
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      const stats = fs.statSync(path.join(tempDir, file));
      if (stats.isDirectory()) {
        Index._resetTemp(file);
      } else if (stats.isFile()) {
        fs.unlinkSync(path.join(tempDir, file));
      }
    });
  }

  /**
   * Create the temporary directory.
   * @returns {undefined}
   */
  static _createTemp() {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (fs.existsSync(tempDir)) Index._resetTemp();

    Index._createEmptyFile(Scraper.StatusPath);
    Index._createEmptyFile(Scraper.UpdatedPath);
  }

  /**
   * Method to start the API.
   * @param {?Boolean} [start=true] - Start the scraping.
   * @returns {undefined}
   */
  static _startAPI(start = true) {
    if (cluster.isMaster) { // Check is the cluster is the master
      // Setup the temporary directory
      Index._createTemp();

      // Fork workers.
      for (let i = 0;i < Math.min(os.cpus().length, Index._Workers);i++)
        cluster.fork();

      // Check for errors with the workers.
      cluster.on('exit', worker => {
        logger.error(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // XXX: Domain module is pending deprication: https://nodejs.org/api/domain.html
      const scope = domain.create();
      scope.run(() => {
        logger.info('API started');
        try {
          new CronJob({
            cronTime: Index._CronTime,
            timeZone: Index._TimeZone,
            onComplete: () => Scraper.Status = 'Idle',
            onTick: Scraper.scrape,
            start
          });

          Scraper.Updated = 0;
          Scraper.Status = 'Idle';
          if (start) Scraper.scrape();
        } catch (err) {
          logger.error(err);
        }
      });
      scope.on('error', err => logger.error(err));
    } else {
      Index._Server.listen(Index._Port);
    }
  }

  /**
   * Method to stop the API from running.
   * @returns {undefined}
   */
  static closeAPI() {
    Index._Server.close(() => {
      logger.info('Closed out remaining connections.');
      process.exit();
    });
  }

}
