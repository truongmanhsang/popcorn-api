// Import the neccesary modules.
import cluster from "cluster";
import { CronJob } from "cron";
import domain from "domain";
import Express from "express";
import os from "os";

import Logger from "./config/logger";
import Routes from "./config/routes";
import Scraper from "./scraper";
import Setup from "./config/setup";
import Util from "./util";
import { cronTime, master, port, timeZone, workers } from "./config/constants";

/**
 * Class for starting the API.
 *
 * @example <caption></caption>
 * // Simply start the API by creating a new instance of the Index class.
 * const index = new Index();
 *
 * @example
 * // Or override the default configuration of the Index class.
 * const index = new Index({start: true, pretty: true, debug: false});
 */
export default class Index {

  /**
   * Create an index object.
   * @param {Object} config - Configuration for the API.
   * @param {Boolean} [config.start=true] - Start the scraping process.
   * @param {Boolean} [config.pretty=true] - Pretty output with Winston logging.
   * @param {Boolean} [config.debug=false] - Debug mode for extra output.
   */
  constructor({start = true, pretty = true, debug = false} = {}) {
    /**
     * The express object.
     * @type {Express}
     */
    Index._app = new Express();

    /**
     * The util object with general functions.
     * @type {Util}
     */
    Index._util = new Util();

    /**
     * The scraper object to scrape for torrents.
     * @type {Scraper}
     */
    Index._scraper = new Scraper(debug);

    // Create a new logger class & override the console object with Winston.
    if (pretty) {
      /**
       * The logger object to configure the logging.
       * @type {Logger}
       */
      Index._logger = new Logger();
    }

    // Setup the MongoDB configuration and ExpressJS configuration.
    const _setup = new Setup(Index._app, pretty);

    // Setup the API routes.
    const _routes = new Routes(Index._app);

    // Start the API.
    Index._startAPI(start);
  };

  /**
   * Function to start the API.
   * @param {Boolean} [start=true] - Start the scraping.
   */
  static _startAPI(start = true) {

    if (cluster.isMaster) { // Check is the cluster is the master
      // Clear the log files from the temp directory.
      Index._util.resetLog();

      // Setup the temporary directory
      Index._util.createTemp();

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, workers); i++) cluster.fork();

      // Check for errors with the workers.
      cluster.on("exit", worker => {
        Index._util.onError(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // Start the cronjob.
      if (master) {
        // WARNING: Domain module is pending deprication: https://nodejs.org/api/domain.html
        const scope = domain.create();
        scope.run(() => {
          console.log("API started");
          try {
            new CronJob({
              cronTime, timeZone,
              onComplete: () => Index._util.setStatus(),
              onTick: () => Index._scraper.scrape(),
              start: true
            });

            Index._util.setLastUpdated("Never");
            Index._util.setStatus();
            if (start) Index._scraper.scrape();
          } catch (err) {
            return Index._util.onError(err);
          }
        });
        scope.on("error", err => Index._util.onError(err));
      }
    } else {
      Index._app.listen(port);
    }
  };

};
