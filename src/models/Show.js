// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'
import { ItemType } from 'butter-provider'

import content from './content'

/**
 * The show schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export const showSchema = new Schema({
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
  type: {
    type: String,
    default: ItemType.TVSHOW
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
  }],
  ...content
})

/**
 * Class for show attributes and methods.
 * @extends {Model}
 * @type {Show}
 */
export class Show extends Model {}

// Attatch the fuctions from the Show class to the showSchema.
showSchema.loadClass(Show)

// Create the show model.
const ShowModel = mongoose.model('Show', showSchema)

/**
 * A model object for shows.
 * @type {ShowModel}
 */
export default ShowModel
