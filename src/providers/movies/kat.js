// Import the neccesary modules.
import asyncq from "async-q";
import KatAPI from "kat-api-pt";

import Extractor from "../extractors/movieextractor";
import Util from "../../util";

/** Class for scraping movies from https://kat.cr/. */
export default class KAT {

  /**
   * Create a kat object for movies.
   * @param {String} name - The name of the torrent provider.
   * @param {Boolean} debug - Debug mode for extra output.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The extractor object for getting show data on torrents.
     * @type {Extractor}
     */
    this._extractor = new Extractor(this.name, new KatAPI({ debug }), debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new Util();
  };

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query https://kat.cr/.
   * @returns {Array} - A list of scraped movies.
   */
  async search(provider) {
    try {
      if (!provider.query.language) return this._util.onError(`Provider with name: '${this.name}' does not have a language set!`);
      logger.log(`${this.name}: Starting scraping...`);
      provider.query.category = "movies";

      return await this._extractor.search(provider);
    } catch (err) {
      this._util.onError(err);
    }
  };

};
