// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'
import { ItemType } from 'butter-provider'

import content from './content'

/**
 * The movie schema used by mongoose.
 * @type {Object}
 * @flow
 * @ignore
 * @see http://mongoosejs.com/docs/guide.html
 */
export const movieSchema = new Schema({
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
  torrents: {},
  ...content
})

/**
 * Class for movie attributes and methods.
 * @extends {Model}
 * @type {Movie}
 */
export class Movie extends Model {}

// Attatch the fuctions from the Movie class to the movieSchema.
movieSchema.loadClass(Movie)

// Create the movie model.
const MovieModel = mongoose.model('Movie', movieSchema)

/**
 * A model object for movies.
 * @type {MovieModel}
 * @ignore
 */
export default MovieModel
