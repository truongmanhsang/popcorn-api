// Import the neccesary modules.
import FactoryProducer from '../resources/FactoryProducer';
import IHelper from './IHelper';

/**
 * Base class for saving content.
 * @implements {IHelper}
 */
export default class BaseHelper extends IHelper {

  /**
   * The default image link.
   * @type {String}
   */
  static Holder = 'images/posterholder.png';

  /**
   * The API factory.
   * @type {Object}
   */
  _apiFactory = FactoryProducer.getFactory('api');

  /**
   * A configured Fanart API.
   * @type {Object}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _fanart = this._apiFactory.getApi('fanart');

  /**
   * A configured TMDB API.
   * @type {Object}
   * @see https://github.com/sarathkcm/TheMovieDBClient
   */
  _tmdb = this._apiFactory.getApi('tmdb');

  /**
   * A configured Trakt API.
   * @type {Object}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _trakt = this._apiFactory.getApi('trakt');

  /**
   * Create a base helper class for content.
   * @param {String} name - The name of the content provider.
   * @param {Object} model - The model to help fill.
   */
  constructor(name, model) {
    super();

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this._name = name;

    /**
     * The model to create or alter.
     * @type {Object}
     * @see http://mongoosejs.com/docs/models.html
     */
    this._model = model;
  }

}
