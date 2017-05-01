// Import the neccesary modules.
import BaseContentController from './BaseContentController';
import Movie from '../../models/Movie';

/** Class for getting movie data from the MongoDB. */
export default class MovieController extends BaseContentController {

  /**
   * Object used for the projection of movies.
   * @protected
   * @type {Object}
   */
  _projection = {
    _id: 1,
    imdb_id: 1,
    title: 1,
    year: 1,
    synopsis: 1,
    runtime: 1,
    released: 1,
    trailer: 1,
    certification: 1,
    torrents: 1,
    genres: 1,
    images: 1,
    rating: 1,
    type: 1
  };

  /**
   * Create a new movie controller.
   * @param {!Movie} [model=Movie] - The model for the movie controller.
   */
  constructor(model = Movie) {
    super(model);
  }

}
