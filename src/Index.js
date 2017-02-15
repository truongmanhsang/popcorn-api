// Import the neccesary modules.
import cluster from 'cluster';
import domain from 'domain';
import Express from 'express';
import http from 'http';
import os from 'os';
import { CronJob } from 'cron';

import doSetup from './config/setup';
import setupRoutes from './config/routes';
import Scraper from './Scraper';
import { createLogger } from './config/logger';
import {
  createTemp,
  onError,
  resetLog,
  setLastUpdated,
  setStatus
} from './utils';
import {
  cronTime,
  master,
  port,
  timeZone,
  workers
} from './config/constants';

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
 *    verbose: false,
 *    debug: false
 * });
 */
export default class Index {

  /**
   * Create an index object.
   * @param {Object} config - Configuration for the API.
   * @param {Boolean} [config.start=true] - Start the scraping process.
   * @param {Boolean} [config.pretty=true] - Pretty output with Winston logging.
   * @param {Boolean} [config.verbose=false] - Debug mode for no output.
   */
  constructor({start = true, pretty = true, verbose = false} = {}) { // eslint-disable-line object-curly-spacing
    // The express object.
    const _app = new Express();

    // Setup the global logger object.
    createLogger(pretty, verbose);

    // Setup the MongoDB configuration and ExpressJS configuration.
    doSetup(_app, pretty, verbose);

    // Setup the API routes.
    setupRoutes(_app);

    /**
     * The http server object.
     * @type {Object}
     */
    Index._server = http.createServer(_app);

    /**
     * The scraper object to scrape for torrents.
     * @type {Scraper}
     */
    Index._scraper = new Scraper();

    // Start the API.
    Index._startAPI(start);
  }

  /**
   * Function to start the API.
   * @param {?Boolean} start - Start the scraping.
   * @returns {void}
   */
  static _startAPI(start) {
    if (cluster.isMaster) { // Check is the cluster is the master
      // Clear the log files from the temp directory.
      resetLog();

      // Setup the temporary directory
      createTemp();

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, workers); i++) cluster.fork(); // eslint-disable-line semi-spacing

      // Check for errors with the workers.
      cluster.on('exit', worker => {
        onError(`Worker '${worker.process.pid}' died, spinning up another!`);
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
              onComplete: () => setStatus(),
              onTick: () => Index._scraper.scrape(),
              start: true
            });

            setLastUpdated(0);
            setStatus();
            if (start) Index._scraper.scrape();
          } catch (err) {
            return onError(err);
          }
        });
        scope.on('error', err => onError(err));
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
