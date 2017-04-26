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

  /** Create a singleton class for Scraper. */
  constructor() {
    if (!Scraper.Instance) Scraper.Instance = this;
    return Scraper;
  }

  /**
   * Return the Scraper singleton instance.
   * @returns {Scraper} - The Scraper singleton instance.
   */
  static get Instance() {
    return Scraper._Instance;
  }

  /**
   * Set the Scraper singleton class.
   * @param {!Scraper} Instance - The instance to set.
   * @returns {undefined}
   */
  static set Instance(Instance) {
    Scraper._Instance = Instance;
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
   * @param {!String} Status - The status to set.
   * @returns {undefined}
   */
  static set Status(Status) {
    Scraper._Status = Status;
  }

  /**
   * Return the last updated value of the scraper.
   * @returns {Number} - The last updated value.
   */
  static get Updated() {
    return Scraper._Updated;
  }

  /**
   * Set the last updated value of the scraper.
   * @param {!Number} Updated - The value to set the last updated value.
   * @returns {undefined}
   */
  static set Updated(Updated) {
    Scraper._Updated = Updated;
  }

  /**
   * Initiate the scraping.
   * @returns {undefined}
   */
  scrape() {
    Scraper.Updated = Math.floor(new Date().getTime() / 1000);

    const context = new Context();

    /**
     * NOTE: `.sort({ $natural: <order> })` sorts the provider configs based on
     * the order of insertion.
     */
    ProviderConfig.find().sort({
      $natural: -1
    }).exec().then(pConfigs => {
      return asyncq.eachSeries(pConfigs, async pConfig => {
        // XXX: import(``).default does not work.
        let Provider = await import(`./scraper/providers/${pConfig.class}`);
        Provider = Provider.default;

        context.provider = new Provider(pConfig);
        return await context.execute();
      });
    }).then(() => Scraper.Status = 'Idle')
      .then(() => asyncq.eachSeries(
        this._collections,
        collection => Util.Instance.exportCollection(collection)
      ))
      .catch(err => logger.error(`Error while scraping: ${err}`));
  }

}

/**
 * The Scraper singleton object.
 * @type {Scraper}
 * @ignore
 */
export default new Scraper();
