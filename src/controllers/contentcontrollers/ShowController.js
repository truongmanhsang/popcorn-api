// Import the neccesary modules.
import BaseContentController from './BaseContentController';
import Show from '../../models/Show';

/** Class for getting show data from the MongoDB. */
export default class ShowController extends BaseContentController {

  /**
   * Object to search for shows.
   * @type {Object}
   */
  static query = {
    num_seasons: {
      $gt: 0
    }
  };

  /**
   * Object used for the projections of shows.
   * @type {Object}
   */
  static _projection = {
    _id: 1,
    imdb_id: 1,
    tvdb_id: 1,
    title: 1,
    year: 1,
    slug: 1,
    genres: 1,
    images: 1,
    rating: 1,
    num_seasons: 1
  };

  /**
   * Create a new show controller.
   * @param {Object} [model=Show] - The model for the show controller.
   */
  constructor(model = Show) {
    super(model);
  }

}
