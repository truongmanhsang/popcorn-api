// Import the neccesary modules.
import FactoryProducer from '../resources/FactoryProducer';
import IHelper from './IHelper';

/**
 * Class for saving content.
 * @implements {IHelper}
 */
export default class BaseHelper extends IHelper {

  static holder = 'images/posterholder.png';

  /**
   * Create a base helper class for content.
   * @param {String} name - The name of the content provider.
   * @param {Object} model - The model to help fill.
   */
  constructor(name, model) {
    super();

    const apiFactory = FactoryProducer.getFactory('api');

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

    /**
     * A configured Fanart API.
     * @type {Object}
     * @see https://github.com/vankasteelj/trakt.tv
     */
    this._fanart = apiFactory.getApi('fanart');

    /**
     * A configured TMDB API.
     * @type {Object}
     * @see https://github.com/sarathkcm/TheMovieDBClient
     */
    this._tmdb = apiFactory.getApi('tmdb');

    /**
     * A configured Trakt API.
     * @type {Object}
     * @see https://github.com/vankasteelj/trakt.tv
     */
    this._trakt = apiFactory.getApi('trakt');
  }

}
