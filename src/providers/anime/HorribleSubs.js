// Import the neccesary modules.
import asyncq from 'async-q';
import HorribleSubsAPI from 'horriblesubs-api';

import AnimeExtractor from '../extractors/AnimeExtractor';
import { maxWebRequest } from '../../config/constants';
import { onError } from '../../utils';

/** Class for scraping anime from https://horriblesubs.info/. */
export default class HorribleSubs {

  /**
   * Create an horriblesubs object for anime content.
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
     * A configured HorribleSubs API.
     * @type {HorribleSubsAPI}
     * @see https://github.com/ChrisAlderson/horriblesubs-api
     */
    this._horriblesubs = new HorribleSubsAPI({ debug });

    /**
     * The extractor object for getting show data on torrents.
     * @type {AnimeExtractor}
     */
    this._extractor = new AnimeExtractor(this.name, this._horriblesubs, debug);
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Anime[]} - A list of scraped animes.
   */
  async search() {
    try {
      logger.info(`${this.name}: Starting scraping...`);
      const animes = await this._horriblesubs.getAllAnime();
      logger.info(`${this.name}: Found ${animes.length} anime shows.`);

      return await asyncq.mapLimit(animes, maxWebRequest, async anime => {
        try {
          anime = await this._horriblesubs.getAnimeData(anime); // eslint-disable-line no-param-reassign
          return await this._extractor.getAnime(anime);
        } catch (err) {
          return onError(err);
        }
      });
    } catch (err) {
      return onError(err);
    }
  }

}
