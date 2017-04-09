// Import the neccesary modules.
import asyncq from 'async-q';
import fs from 'fs';
import path from 'path';

import Context from './scraper/Context';
import providerConfigs from './scraper/configs';
import Util from './Util';
import {
  collections,
  statusFile,
  tempDir,
  updatedFile
} from './config/constants';

/** Class for Initiating the scraping process. */
export default class Scraper {

  /**
   * Returns the epoch time.
   * @returns {Number} - Epoch time.
   */
  _now() {
    return Math.floor(new Date().getTime() / 1000);
  }

  /**
   * Updates the `lastUpdated.json` file.
   * @param {String} [updated=Date.now()] - The epoch time when the API last
   * started scraping.
   * @returns {void}
   */
  setLastUpdated(updated = this._now()) {
    fs.writeFile(path.join(tempDir, updatedFile), JSON.stringify({
      updated
    }), () => {});
  }

  /**
   * Updates the `status.json` file.
   * @param {String} [status=Idle] - The status which will be set to in the
   * `status.json` file.
   * @returns {void}
   */
  setStatus(status = 'Idle') {
    fs.writeFile(path.join(tempDir, statusFile), JSON.stringify({
      status
    }), () => {});
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    this.setLastUpdated();

    const context = new Context();
    asyncq.eachSeries(providerConfigs, async provider => {
      context.provider = provider;
      await context.execute();
    }).then(() => this.setStatus())
      .then(() => asyncq.eachSeries(collections,
        collection => Util.exportCollection(collection)))
      .catch(err => logger.error(`Error while scraping: ${err}`));
  }

}
