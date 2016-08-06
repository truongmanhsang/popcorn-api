// Import the neccesary modules.
import asyncq from "async-q";

import Util from "../../util";

/** Class for base extracting data from torrents. */
export default class BaseExtractor {

   /**
    * Create an extratorrent object.
    * @param {String} name - The name of the torrent provider.
    * @param {Object} contentProvider - The content provider used by the extractor.
    */
  constructor(name, contentProvider) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The content provider used by the extractor.
     * @type {Object}
     */
    this._contentProvider = contentProvider;

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new Util();
  };

  /**
   * Get all the torrents of a given provider.
   * @param {Integer} totalPages - The total pages of the query.
   * @param {Object} provider - The provider to query the content provider.
   * @returns {Array} - A list of all the queried torrents.
   */
  async _getAllTorrents(totalPages, provider) {
    try {
      let torrents = [];
      await asyncq.timesSeries(totalPages, async page => {
        try {
          provider.query.page = page + 1;
          console.log(`${this.name}: Starting searching ${this.name} on page ${provider.query.page} out of ${totalPages}`);
          const result = await this._contentProvider.search(provider.query);
          torrents = torrents.concat(result.results);
        } catch (err) {
          return this._util.onError(err);
        }
      });
      console.log(`${this.name}: Found ${torrents.length} torrents.`);
      return torrents;
    } catch (err) {
      return this._util.onError(err);
    }
  };

};
