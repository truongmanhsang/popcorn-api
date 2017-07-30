// Import the necessary modules.
import { AnimeShow as Anime } from '../../models/Anime'
import BaseContentController from './BaseContentController'

/**
 * Class for getting anime data from the MongoDB.
 * @extends {BaseContentController}
 * @type {AnimeController}
 * @flow
 */
export default class AnimeController extends BaseContentController {

  /**
   * Object used for the projection of anime.
   * @protected
   * @type {Object}
   */
  _projection: Object

  /**
   * Create a new anime controller.
   * @param {!AnimeMovie|AnimeShow} [model=Anime] - The model for the anime
   * controller.
   */
  constructor(model: AnimeMovie | AnimeShow = Anime): void {
    super(model)

    /**
     * Object used for the projection of anime.
     * @type {Object}
     */
    this._projection = {
      _id: 1,
      imdb_id: 1,
      tvdb_id: 1,
      title: 1,
      year: 1,
      slug: 1,
      genres: 1,
      images: 1,
      rating: 1,
      type: 1,
      num_seasons: 1,
      synopsis: 1,
      runtime: 1,
      released: 1,
      trailer: 1,
      certification: 1,
      torrents: 1
    }
  }

}
