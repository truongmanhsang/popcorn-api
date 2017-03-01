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
   */
  constructor(name, extractor) {
    super(name, extractor);
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Object[]} - A list of scraped content.
   */
  async search() {
    try {
      logger.info(`${this._name}: Starting scraping...`);
      const shows = await this._extractor.torrentProvider.getAll();
      logger.info(`${this._name}: Found ${shows.length} shows.`);

      return await asyncq.mapLimit(shows, maxWebRequest, async show => {
        show = await this._extractor.torrentProvider.getData(show);
        return await this._extractor.getContent(show);
      });
    } catch (err) {
      return onError(err);
    }
  }

}
