// Import the neccesary modules.
import KatAPI from 'kat-api-pt';

import MovieExtractor from '../extractors/MovieExtractor';
import { onError } from '../../utils';

/** Class for scraping movies from https://kat.cr/. */
export default class KAT {

  /**
   * Create a kat object for movie content.
   * @param {String} name - The name of the content provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The extractor object for getting show data on torrents.
     * @type {MovieExtractor}
     */
    this._extractor = new MovieExtractor(this.name, new KatAPI({ debug }), debug);
  };

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query https://kat.cr/.
   * @returns {Movie[]} - A list of scraped movies.
   */
  async search(provider) {
    try {
      logger.info(`${this.name}: Starting scraping...`);
      provider.query.page = 1;
      provider.query.verified = 1;
      provider.query.adult_filter = 1;
      provider.query.language = provider.query.language ? provider.query.language : 'en';
      provider.query.category = 'movies';

      return await this._extractor.search(provider);
    } catch (err) {
      return onError(err);
    }
  }

}
