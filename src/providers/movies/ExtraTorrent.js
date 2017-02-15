// Import the neccesary modules.
import ExtraTorrentAPI from 'extratorrent-api';

import MovieExtractor from '../extractors/MovieExtractor';
import { onError } from '../../utils';

/** Class for scraping movies from https://extratorrent.cc/. */
export default class ExtraTorrent {

  /**
   * Create an extratorrent object for movie content.
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
     * The extractor object for getting movie data on torrents.
     * @type {MovieExtractor}
     */
    this._extractor = new MovieExtractor(this.name, new ExtraTorrentAPI({ debug }), debug);
  }

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query https://extratorrent.cc/.
   * @returns {Movie[]} - A list of scraped movies.
   */
  async search(provider) {
    try {
      logger.info(`${this.name}: Starting scraping...`);
      provider.query.category = 'movies';
      provider.query.page = 1;
      provider.query.language = provider.query.language ? provider.query.language : 'en';

      return await this._extractor.search(provider);
    } catch (err) {
      return onError(err);
    }
  }

}
