// Import the neccesary modules.
import asyncq from 'async-q';

import BaseProvider from './BaseProvider';
import Util from '../../Util';

/**
 * Class for scraping content from EZTV and HorribleSubs.
 * @extends {BaseProvider}
 */
export default class BulkProvider extends BaseProvider {

  /**
   * Create a BulkProvider class.
   * @param {Object} config - The configuration object for the torrent
   * provider.
   * @param {Object} config.API - The api of the torrent provider.
   * @param {String} config.name - The name of the torrent provider.
   * @param {String} config.modelType - The model type for the helper.
   * @param {Object} config.query - The query object for the api.
   * @param {String} config.type - The type of content to scrape.
   */
  constructor({API, name, modelType, query, type} = {}) {
    super({API, name, modelType, query, type});
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Array<Object>} - A list of scraped content.
   */
  async search() {
    try {
      logger.info(`${this._name}: Starting scraping...`);
      const contents = await this._api.getAll();
      logger.info(`${this._name}: Found ${contents.length} ${this._type}s.`);

      return await asyncq.mapLimit(contents, BulkProvider._maxWebRequest, async content => {
        content = await this._api.getData(content);
        return await this.getContent(content);
      });
    } catch (err) {
      return Util.onError(err);
    }
  }

}
