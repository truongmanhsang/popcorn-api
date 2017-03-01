// Import the neccesary modules.
import asyncq from 'async-q';
import Provider from 'butter-provider';

import { maxWebRequest } from '../../config/constants';
import { onError } from '../../utils';

/** Class for base extracting data from torrents. */
export default class BaseExtractor {

   /**
    * Create a base extractor object.
    * @param {Object} config - The configuration for the extractor.
    * @param {String} config.name - The name of the content provider.
    * @param {Object} config.torrentProvider - The content provider to extract
    * content from.
    * @param {String} config.type - The content type to extract.
    */
  constructor({name, torrentProvider, type} = {}) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this._name = name;

    /**
     * The content provider used by the extractor.
     * @type {Object}
     */
    this._torrentProvider = torrentProvider;

    /**
     * The content type to extract.
     * @type {String}
     */
    this._type = type;
  }

  /**
   * Returns the torrent provider of the extractor.
   * @returns {Object} - A torrent provider.
   */
  get torrentProvider() {
    return this._torrentProvider;
  }

  /**
   * Get all the content.
   * @param {Object} content - The content information.
   * @returns {Object} - A content object.
   */
  async getContent(content) {
    try {
      let newContent;

      if (content.type === Provider.ItemType.MOVIE) {
        newContent = await this._helper.getTraktInfo(content.slugYear);
        if (newContent && newContent._id)
          return await this._helper.addTorrents(newContent, content.torrents);
      } else if (content.type === Provider.ItemType.SHOW) {
        newContent = await this._helper.getTraktInfo(content.slug);

        if (newContent && newContent._id) {
          delete content.episodes[0];
          return await this._helper.addEpisodes(newContent, content.episodes, content.slug);
        }
      }
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Default method to extract content.
   * @returns {void}
   */
  _extractContent() {
    logger.warn('Using default method: \'_extractContent\'');
  }

  /**
   * Default method to content data.
   * @returns {void}
   */
  _getContentData() {
    logger.warn('Using default method: \'_getContentData\'');
  }

  /**
   * Default method to get all the content.
   * @returns {void}
   */
  _getAllContent() {
    logger.warn('Using default method: \'_getAllContent\'');
  }

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
        if (provider.query.page) provider.query.page = page + 1;
        if (provider.query.offset) provider.query.offset = page + 1;

        logger.info(`${this._name}: Starting searching ${this._name} on page ${page + 1} out of ${totalPages}`);
        const result = await this.torrentProvider.search(provider.query);
        torrents = torrents.concat(result.results);
      });

      logger.info(`${this._name}: Found ${torrents.length} torrents.`);

      return torrents;
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query content provider.
   * @returns {Object[]} - A list of scraped content.
   */
  async search(provider) {
    try {
      const getTotalPages = await this.torrentProvider.search(provider.query);

      let totalPages;
      if (process.env.NODE_ENV === 'development') {
        totalPages = 3;
      } else {
        totalPages = getTotalPages.total_pages ? getTotalPages.total_pages : Math.ceil(getTotalPages.data.movie_count / 50);
      }

      if (!totalPages) return onError(`${this._name}: total_pages returned: '${totalPages}'`);
      logger.info(`${this._name}: Total pages ${totalPages}`);

      const torrents = await this._getAllTorrents(totalPages, provider);
      const allContent = await this._getAllContent(torrents, provider.query.language);

      return await asyncq.mapLimit(allContent, maxWebRequest,
        content => this.getContent(content).catch(err => onError(err)));
    } catch (err) {
      return onError(err);
    }
  }

}
