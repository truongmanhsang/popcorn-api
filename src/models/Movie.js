// Import the neccesary modules.
import mongoose from 'mongoose';
import { ItemType } from 'butter-provider';

import content from './content';

/**
 * The movie schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export const MovieSchema = new mongoose.Schema(Object.assign({}, content, {
  language: String,
  released: Number,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  type: {
    type: String,
    default: ItemType.MOVIE
  },
  torrents: {}
}));

// Create the movie model.
const Movie = mongoose.model('Movie', MovieSchema);

/**
 * A model object for movies.
 * @type {Movie}
 */
export default Movie;
