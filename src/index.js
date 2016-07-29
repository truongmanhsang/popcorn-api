// Import the neccesary modules.
import cluster from "cluster";
import cron from "cron";
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
 * @class
 * @classdesc The factory function for starting the API.
 * @memberof module:global/index
 * @property {Object} util - The util object with general functions.
 */
export default class Index {

  constructor({start = true, pretty = true, debug = false} = {}) {
    // Make an ExpressJS application.
    Index.app = new Express();
    Index.util = new Util();
    Index.scraper = new Scraper(debug);

    // Create a new logger class. Override the console object with Winston.
    if (pretty) Index.logger = new Logger();

    // Setup the MongoDB configuration and ExpressJS configuration.
    const setup = new Setup(Index.app, pretty);

    // Setup the API routes.
    const routes = new Routes(Index.app);

    Index.startAPI(start);
  };

  /**
   * @description function to start the API.
   * @function Index#startAPI
   * @memberof module:global/index
   * @param {Boolean} [startScraping=true] - Start the scraping (Default `true`).
   */
  static startAPI(start) {

    if (cluster.isMaster) { // Check is the cluster is the master
      // Clear the log files from the temp directory.
      Index.util.resetLog();

      // Setup the temporary directory
      Index.util.createTemp();

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, workers); i++) cluster.fork();

      // Check for errors with the workers.
      cluster.on("exit", worker => {
        Index.util.onError(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // Start the cronjob.
      if (master) {
        const scraper = new Scraper();
        const scope = domain.create();
        scope.run(() => {
          console.log("API started");
          try {
            new cron.CronJob({
              cronTime, timeZone,
              onTick: () => scraper.scrape(),
              onComplete: () => Index.util.setStatus()
            });

            Index.util.setLastUpdated("Never");
            Index.util.setStatus();

            if (start) scraper.scrape();
          } catch (err) {
            return Index.util.onError(err);
          }
        });
        scope.on("error", err => Index.util.onError(err));
      }
    } else {
      Index.app.listen(port);
    }
  };

};
