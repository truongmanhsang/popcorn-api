// Import the neccesary modules.
import asyncq from 'async-q';
import { ItemType } from 'butter-provider';

import Provider from './Provider';
import { maxWebRequest } from '../../config/constants';
import { onError } from '../../utils';

/** Class for scraping content from various sources. */
export default class BaseProvider extends Provider {

  /**
   * Create a BaseTorrentProvider object.
   * @param {Object} config - The configuration object for the torrent
   * provider.
   * @param {Object} config.API - The api of the torrent provider.
   * @param {String} config.name - The name of the torrent provider.
   * @param {Model} config.modelType - The model type for the helper.
   * @param {Object} config.query - The query object for the api.
   * @param {String} config.type - The type of content to scrape.
   */
  constructor({API, name, modelType, query, type} = {}) {
    super({API, name, modelType, query, type});
  }

  /**
   * Get all the content.
   * @param {Object} content - The content information.
   * @returns {Object} - A content object.
   */
  async getContent(content) {
    try {
      let newContent;

      if (this._type === ItemType.MOVIE) {
        const { slugYear, torrents } = content;
        newContent = await this._helper.getTraktInfo(slugYear);

        if (newContent && newContent._id)
          return await this._helper.addTorrents(newContent, torrents);
      } else if (this._type === ItemType.TVSHOW) {
        const { episodes, slug } = content;
        delete episodes[0];
        newContent = await this._helper.getTraktInfo(slug);

        if (newContent && newContent._id)
          return await this._helper.addEpisodes(newContent, episodes, slug);
      } else {
        return onError(`'${this._type}' is not a valid value for ItemType!`);
      }
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Get all the torrents of a given torrent provider.
   * @param {Integer} totalPages - The total pages of the query.
   * @returns {Array} - A list of all the queried torrents.
   */
  _getAllTorrents(totalPages) {
    let torrents = [];
    return asyncq.timesSeries(totalPages, async page => {
      if (this._query.page) this._query.page = page + 1;
      if (this._query.offset) this._query.offset = page + 1;

      logger.info(`${this._name}: Starting searching ${this._name} on page ${page + 1} out of ${totalPages}`);
      const result = await this._api.search(this._query);
      torrents = torrents.concat(result.results);
    }).then(() => {
      logger.info(`${this._name}: Found ${torrents.length} torrents.`);
      return torrents;
    });
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Object[]} - A list of scraped content.
   */
  async search() {
    try {
      const getTotalPages = await this._api.search(this._query);

      let totalPages;
      if (process.env.NODE_ENV === 'development') {
        totalPages = 1;
      } else {
        totalPages = getTotalPages.total_pages
                              ? getTotalPages.total_pages
                              : Math.ceil(getTotalPages.data.movie_count / 50);
      }

      if (!totalPages)
        return onError(`${this._name}: total_pages returned: '${totalPages}'`);

      logger.info(`${this._name}: Total pages ${totalPages}`);

      const torrents = await this._getAllTorrents(totalPages);
      const allContent = await this._getAllContent(torrents, this._query.language);

      return await asyncq.mapLimit(allContent, maxWebRequest,
        content => this.getContent(content)
      );
    } catch (err) {
      return onError(err);
    }
  }

}
