// Import the neccesary modules.
import mongoose from "mongoose";

/**
 * @class Movie
 * @classdesc A model object for movies.
 * @memberof module:models/movie
 */
class Movie extends mongoose.Schema {

  constructor() {
    super({
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
  };

};

// Export the movie model.
export default mongoose.model("Movie", new Movie());
