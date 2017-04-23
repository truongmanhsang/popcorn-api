// Import the neccesary modules.
import asyncq from 'async-q';

import Context from './scraper/Context';
import ProviderConfig from './models/ProviderConfig';
import Util from './Util';

/** Class for Initiating the scraping process. */
class Scraper {

  /**
   * An array of the supported collections for mongodb.
   * @type {Array}
   */
  _collections = ['anime', 'movie', 'show'];

  /**
   * The instance used for the singleton pattern.
   * @type {Scraper}
   */
  static _Instance = undefined;

  /**
   * The status of the scraper.
   * @type {String}
   */
  static _Status = 'Idle';

  /**
   * The last updated value.
   * @type {Number}
   */
  static _Updated = 0;

  /**
   * Get the Scraper singleton instance.
   * @returns {Scraper} - The Scraper singleton instance.
   */
  static get Instance() {
    return Scraper._Instance;
  }

  /**
   * Set the Scraper singleton class.
   * @param {Scraper} _Instance - The instance to set.
   * @returns {void}
   */
  static set Instance(_Instance) {
    Scraper._Instance = _Instance;
  }

  /**
   * Return the status of the scraper.
   * @returns {String} - The status of the scraper.
   */
  static get Status() {
    return Scraper._Status;
  }

  /**
   * Set the status of the scraper.
   * @param {String} _Status - The status to set.
   * @returns {void}
   */
  static set Status(_Status) {
    Scraper._Status = _Status;
  }

  /**
   * Retrun the last updated value of the scraper.
   * @returns {Number} - The last updated value.
   */
  static get Updated() {
    return Scraper._Updated;
  }

  /**
   * Set the last updated value of the scraper.
   * @param {Number} _Updated - The value to set the last updated value.
   * @returns {void}
   */
  static set Updated(_Updated) {
    Scraper._Updated = _Updated;
  }

  /** Create a singleton class for Scraper. */
  constructor() {
    if (!Scraper.Instance) Scraper.Instance = this;
    return Scraper.Instance;
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    Scraper.Updated = Math.floor(new Date().getTime() / 1000);

    const context = new Context();

    return ProviderConfig.find().exec().then(pConfigs => {
      return asyncq.eachSeries(pConfigs, async pConfig => {
        // TODO: import(``).default does not work.
        let Provider = await import(`./scraper/providers/${pConfig.class}`);
        Provider = Provider.default;

        context.provider = new Provider(pConfig);
        return await context.execute();
      });
    }).then(() => Scraper.Status = 'Idle')
      .then(() => asyncq.eachSeries(
        this._collections, collection => Util.exportCollection(collection)
      ))
      .catch(err => logger.error(`Error while scraping: ${err}`));
  }

}

/**
 * The Scraper singleton object.
 * @type {Scraper}
 */
export default new Scraper();
