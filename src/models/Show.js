// Import the neccesary modules.
import mongoose from "mongoose";

/**
 * @class Show
 * @classdesc A model object for shows.
 * @memberof module:models/show
 */
class Show extends mongoose.Schema {

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
      tvdb_id: String,
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
      network: String,
      air_day: String,
      air_time: String,
      status: String,
      num_seasons: Number,
      last_updated: Number,
      latest_episode: {type: Number, default: 0},
      images: {
        banner: String,
        fanart: String,
        poster: String
      },
      genres: [],
      episodes: []
    });
  };

};

export default mongoose.model("Show", new Show());
