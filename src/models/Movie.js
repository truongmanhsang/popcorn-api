// Import the neccesary modules.
import mongoose from "mongoose";

// The movie schema used by mongoose.
const MovieSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  imdb_id: String,
  title: String,
  year: String,
  slug: String,
  synopsis: String,
  runtime: String,
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number,
    loved: Number,
    hated: Number
  },
  country: String,
  last_updated: Number,
  latest_episode: {type: Number, default: 0},
  images: {
    banner: String,
    fanart: String,
    poster: String
  },
  genres: [],
  released: Number,
  trailer: String,
  certification: String,
  torrents: {}
});

/**
 * @class Movie
 * @classdesc A model object for movies.
 * @memberof module:models/movie
 */
const Movie = mongoose.model("Movie", MovieSchema);

// Export the user model.
export default Movie;
