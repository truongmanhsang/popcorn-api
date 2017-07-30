// Import the necessary modules.
import { ItemType } from 'butter-provider'

/**
 * Base structure of the database content.
 * @type {Object}
 */
export default {
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  imdb_id: String,
  title: String,
  year: Number,
  slug: String,
  synopsis: String,
  runtime: Number,
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number
  },
  images: {
    banner: String,
    fanart: String,
    poster: String
  },
  genres: [String],
  type: {
    type: String,
    enum: Object.keys(ItemType).map(key => ItemType[key])
  }
}
