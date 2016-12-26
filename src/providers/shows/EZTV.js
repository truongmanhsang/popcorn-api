// Import the neccesary modules.
import asyncq from 'async-q';
import EztvAPI from 'eztv-api-pt';

import ShowExtractor from '../extractors/ShowExtractor';
import { maxWebRequest } from '../../config/constants';
import { onError } from '../../utils';

/** Class for scraping shows from https://eztv.ag/. */
export default class EZTV {

  /**
   * Create an eztv object for show content.
   * @param {String} name - The name of the torrent provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * A configured EZTV API.
     * @type {EztvAPI}
     * @see https://github.com/ChrisAlderson/eztv-api-pt
     */
    this._eztv = new EztvAPI({ debug });

    /**
     * The extractor object for getting show data on torrents.
     * @type {ShowExtractor}
     */
    this._extractor = new ShowExtractor(this.name, this._eztv, debug);
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Show[]} - A list of scraped shows.
   */
  async search() {
    try {
      logger.info(`${this.name}: Starting scraping...`);
      const shows = await this._eztv.getAllShows();
      logger.info(`${this.name}: Found ${shows.length} shows.`);

      return await asyncq.mapLimit(shows, maxWebRequest, async show => {
        try {
          show = await this._eztv.getShowData(show);
          return await this._extractor.getShow(show);
        } catch (err) {
          return onError(err);
        }
      });
    } catch (err) {
      return onError(err);
    }
  }

}
