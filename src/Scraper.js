// Import the neccesary modules.
import asyncq from 'async-q';

import Context from './scraper/Context';
import providerConfigs from './scraper/configs';
import Util from './Util';
import { collections } from './config/constants';

/** Class for Initiating the scraping process. */
class Scraper {

  /**
   * The instance used for the singleton pattern.
   * @type {Scraper}
   */
  static _instance = undefined;

  /**
   * The status of the scraper.
   * @type {String}
   */
  static _status = 'Idle';

  /**
   * The last updated value.
   * @type {Number}
   */
  static _updated = 0;

  /**
   * Get the Scraper singleton instance.
   * @returns {Scraper} - The Scraper singleton instance.
   */
  static get instance() {
    return Scraper._instance;
  }

  /**
   * Set the Scraper singleton class.
   * @param {Scraper} _instance - The instance to set.
   * @returns {void}
   */
  static set instance(_instance) {
    Scraper._instance = _instance;
  }

  /**
   * Return the status of the scraper.
   * @returns {String} - The status of the scraper.
   */
  static get status() {
    return Scraper._status;
  }

  /**
   * Set the status of the scraper.
   * @param {String} _status - The status to set.
   * @returns {void}
   */
  static set status(_status) {
    Scraper._status = _status;
  }

  /**
   * Retrun the last updated value of the scraper.
   * @returns {Number} - The last updated value.
   */
  static get updated() {
    return Scraper._updated;
  }

  /**
   * Set the last updated value of the scraper.
   * @param {Number} _updated - The value to set the last updated value.
   * @returns {void}
   */
  static set updated(_updated) {
    Scraper._updated = _updated;
  }

  /** Create a singleton class for Scraper. */
  constructor() {
    if (!Scraper.instance) Scraper.instance = this;
    return Scraper.instance;
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    Scraper.updated = Math.floor(new Date().getTime() / 1000);

    const context = new Context();
    asyncq.eachSeries(providerConfigs, async provider => {
      context.provider = provider;
      await context.execute();
    }).then(() => Scraper.status = 'Idle')
      .then(() => asyncq.eachSeries(collections,
        collection => Util.exportCollection(collection)))
      .catch(err => logger.error(`Error while scraping: ${err}`));
  }

}

/**
 * The Scraper singleton object.
 * @type {Scraper}
 */
export default new Scraper();
