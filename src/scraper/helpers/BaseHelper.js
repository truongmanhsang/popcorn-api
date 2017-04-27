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
  static _Holder = 'images/posterholder.png';

  /**
   * The default image object.
   * @type {Object}
   */
  _defaultImages = {
    banner: BaseHelper._Holder,
    fanart: BaseHelper._Holder,
    poster: BaseHelper._Holder,
    provider: 'default'
  };

  /**
   * The API factory.
   * @type {ApiFactory}
   */
  _apiFactory = FactoryProducer.getFactory('api');

  /**
   * A configured Fanart API.
   * @type {Fanart}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _fanart = this._apiFactory.getApi('fanart');

  /**
   * A configured TMDB API.
   * @type {TMDB}
   * @see https://github.com/sarathkcm/TheMovieDBClient
   */
  _tmdb = this._apiFactory.getApi('tmdb');

  /**
   * A configured Trakt API.
   * @type {Trakt}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _trakt = this._apiFactory.getApi('trakt');

  /**
   * Create a base helper class for content.
   * @param {!String} name - The name of the content provider.
   * @param {!AnimeMovie|AnimeShow|Movie|Show} model - The model to help fill.
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
     * @type {AnimeMovie|AnimeShow|Movie|Show}
     * @see http://mongoosejs.com/docs/models.html
     */
    this._model = model;
  }

  /**
   * Method to check the given images against the default ones.
   * @override
   * @param {Object} images - The images to check.
   * @throws {Error} - test
   * @returns {Object|undefined} - Throws an error if the given images are the
   * same, otherwise it will return the given images.
   */
  _checkImages(images) {
    for (const i in images) {
      if (images[i] === BaseHelper._Holder)
        throw new Error('An image could not been found!');
    }

    return images;
  }

}
