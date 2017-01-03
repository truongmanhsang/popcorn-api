// Import the neccesary modules.
import mongoose from 'mongoose';

import content from './content';

/**
 * The show schema used by mongoose.
 * @type {Schema}
 * @see http://mongoosejs.com/docs/guide.html
 */
export const ShowSchema = new mongoose.Schema(Object.assign(content, {
  imdb_id: String,
  tvdb_id: String,
  country: String,
  network: String,
  air_day: String,
  air_time: String,
  status: String,
  num_seasons: Number,
  last_updated: Number,
  latest_episode: {
    type: Number,
    default: 0
  },
  episodes: [{
    tvdb_id: Number,
    season: Number,
    episode: Number,
    title: String,
    overview: String,
    date_based: Boolean,
    first_aired: Number,
    torrents: {}
  }]
}));

// Create the show model.
const Show = mongoose.model('Show', ShowSchema);

/**
 * A model object for shows.
 * @type {Show}
 */
export default Show;
