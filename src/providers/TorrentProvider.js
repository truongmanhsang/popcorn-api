// Import the neccesary modules.
import asyncq from 'async-q';

import BaseTorrentProvider from './BaseTorrentProvider';
import { maxWebRequest } from '../config/constants';
import { onError } from '../utils';

/** Class for scraping content from EZTV & HorribleSubs. */
export default class TorrentProvider extends BaseTorrentProvider {

  /**
   * Create a TorrentProvider object.
   * @param {String} name - The name of the torrent provider.
   * @param {Object} extractor - The object to extract content information from
   * torrents.
   * @param {Object} TorrentAPI -
   */
  constructor(name, extractor, TorrentAPI) {
    super(name, extractor);

    const torrentAPI = new TorrentAPI();
    torrentAPI.getAll = torrentAPI.getAllShows ? torrentAPI.getAllShows : torrentAPI.getAllAnime;
    torrentAPI.getData = torrentAPI.getShowData ? torrentAPI.getShowData : torrentAPI.getAnimeData;

    /**
     *
     * @type {Object} -
     */
    this._torrentAPI = torrentAPI;
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Object[]} - A list of scraped content.
   */
  async search() {
    try {
      logger.info(`${this.name}: Starting scraping...`);
      const shows = await this._torrentAPI.getAll();
      logger.info(`${this.name}: Found ${shows.length} shows.`);

      return await asyncq.mapLimit(shows, maxWebRequest, async show => {
        show = await this._torrentAPI.getData(show);
        return await this._extractor.getShow(show);
      });
    } catch (err) {
      return onError(err);
    }
  }

}
