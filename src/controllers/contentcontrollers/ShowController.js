// Import the neccesary modules.
import BaseContentController from './BaseContentController';
import Show from '../../models/Show';

/** Class for getting show data from the MongoDB. */
export default class ShowController extends BaseContentController {

  /**
   * Object used for the projection of shows.
   * @type {Object}
   */
  _projection = {
    _id: 1,
    imdb_id: 1,
    tvdb_id: 1,
    title: 1,
    year: 1,
    slug: 1,
    genres: 1,
    images: 1,
    rating: 1,
    num_seasons: 1,
    type: 1
  };

  /**
   * Create a new show controller.
   * @param {!Show} [model=Show] - The model for the show controller.
   */
  constructor(model = Show) {
    super(model);
  }

}
