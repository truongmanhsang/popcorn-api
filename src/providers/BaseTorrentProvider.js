// Import the neccesary modules.
import { onError } from '../utils';

/** Class for scraping anime shows from https://extratorrent.cc/. */
export default class TorrentProvider {

   /**
    * Create an extratorrent object for anime content.
    * @param {String} name - The name of the content provider.
    * @param {Object} extractor - Object for getting intormation on torrents.
    */
  constructor(name, extractor) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this._name = name;

    /**
     * The extractor object for getting information on torrents.
     * @type {Object}
     */
    this._extractor = extractor;
  }

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query the torrent provider.
   * @returns {Object[]} - A list of scraped content.
   */
  async search(provider) {
    try {
      logger.info(`${this._name}: Starting scraping...`);
      return await this._extractor.search(provider);
    } catch (err) {
      return onError(err);
    }
  }

}
