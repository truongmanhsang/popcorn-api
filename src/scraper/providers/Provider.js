// Import the neccesary modules.
import { ItemType } from 'butter-provider';

import FactoryProducer from '../resources/FactoryProducer';

export default class Provider {

  static ModelTypes = {
    AnimeMovie: 'animemovie',
    AnimeShow: 'animeshow',
    Movie: 'movie',
    Show: 'show'
  }

  static Types = {
    Movie: ItemType.MOVIE,
    Show: ItemType.TVSHOW
  }

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
    const helperFactory = FactoryProducer.getFactory('helper');
    const modelFactory = FactoryProducer.getFactory('model');

    const model = modelFactory.getModel(modelType);

    /**
     * The api of the torrent provider.
     * @type {Object}
     */
    this._api = API;

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this._name = name;

    /**
     * The helper object for adding movies.
     * @type {BaseHelper}
     */
    this._helper = helperFactory.getHelper(this._name, model, type);

    /**
     * The query object for the api.
     * @type {Object}
     */
    this._query = query;

    /**
     * The type of content to scrape.
     * @type {String}
     */
    this._type = type;
  }

  /**
   * Default method to get content.
   * @returns {void}
   */
  getContent() {
    throw new Error('Using default method: \'getContent\'');
  }

  /**
   * Default method to extract content.
   * @returns {void}
   */
  _extractContent() {
    throw new Error('Using default method: \'_extractContent\'');
  }

  /**
   * Default method to get content data.
   * @returns {void}
   */
  _getContentData() {
    throw new Error('Using default method: \'_getContentData\'');
  }

  /**
   * Default method to attach a torrent.
   * @returns {void}
   */
  attachTorrent() {
    throw new Error('Using default method: \'_attachTorrent\'');
  }

  /**
   * Default method to get all content.
   * @returns {void}
   */
  _getAllContent() {
    throw new Error('Using default method: \'_getAllContent\'');
  }

  /**
   * Default method to get all torrents.
   * @returns {void}
   */
  _getAllTorrents() {
    throw new Error('Using default method: \'_getAllTorrents\'');
  }

  /**
   * Default method to search for torrents.
   * @returns {void}
   */
  search() {
    throw new Error('Using default method: \'search\'');
  }

}
