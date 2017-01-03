// Import the neccesary modules.
import mongoose from 'mongoose';

import content from './content';

// The movie schema used by mongoose.
const MovieSchema = new mongoose.Schema(Object.assign(content, {
  language: String,
  released: Number,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  torrents: {}
}));

// Create the movie model.
const Movie = mongoose.model('Movie', MovieSchema);

/**
 * A model object for movies.
 * @type {Movie}
 */
export default Movie;
