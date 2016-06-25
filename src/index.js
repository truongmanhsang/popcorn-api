// Import the neccesary modules.
import cluster from "cluster";
import cron from "cron";
import domain from "domain";
import express from "express";
import os from "os";
import { global } from "./config/global";
import Logger from "./config/logger";
import Routes from "./config/routes";
import scraper from "./scraper";
import Setup from "./config/setup";
import Util from "./util";

/**
 * @class
 * @classdesc The factory function for starting the API.
 * @memberof module:global/index
 * @property {Object} util - The util object with general functions.
 */
const Index = () => {

  const util = Util();

  /**
   * @description function to start the API.
   * @function Index#startAPI
   * @memberof module:global/index
   * @param {Boolean} [startScraping=true] - Start the scraping (Default `true`).
   */
  const startAPI = (startScraping = true) => {

    // Override the console object with Winston.
    const logger = Logger(console);

    // Make an ExpressJS application.
    const app = express();

    // Setup the MongoDB configuration and ExpressJS configuration.
    Setup().setup(app, logger);

    // Setup the API routes.
    Routes().routes(app);

    if (cluster.isMaster) { // Check is the cluster is the master
      // Clear the log files from the temp directory.
      logger.reset();

      // Setup the temporary directory
      util.createTemp();

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, global.workers); i++) {
        cluster.fork();
      }

      // Check for errors with the workers.
      cluster.on("exit", worker => {
        util.onError(`Worker '${worker.process.pid}' died, spinning up another!`);
        cluster.fork();
      });

      // Start the cronjob.
      if (global.master) {
        const scope = domain.create();
        scope.run(() => {
          console.log("API started");
          try {
            new cron.CronJob({
              cronTime: global.scrapeTime,
              onTick: () => scraper().scrape(),
              onComplete: () => util.setStatus(),
              start: true,
              timeZone: "America/Los_Angeles"
            });
            util.setLastUpdated("Never");
            util.setStatus();
            if (startScraping) scraper().scrape();
          } catch (ex) {
            return util.onError(ex);
          }
        });
        scope.on("error", err => util.onError(err));
      }
    } else {
      app.listen(global.port);
    }
  };

  // Return the public functions.
  return { startAPI };

};

// Export the index factory function.
export default Index;
