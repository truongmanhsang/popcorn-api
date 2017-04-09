// Import the neccesary modules.
import { AnimeShow as Anime } from '../../models/Anime';
import BaseContentController from './BaseContentController';

/** Class for getting anime data from the MongoDB. */
export default class AnimeController extends BaseContentController {

  /**
   * Object used to query for anime content.
   * @type {Object}
   */
  static query = {
    $or: [{
      num_seasons: {
        $gt: 0
      }
    }, {
      num_seasons: {
        $exists: false
      }
    }]
  };

  /**
   * Create a new anime controller.
   * @param {Object} [model=Anime] - The model for the anime controller.
   */
  constructor(model = Anime) {
    super(model);
  }

}
