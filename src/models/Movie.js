// Import the necessary modules.
import mongoose, { Schema } from 'mongoose'
import { ItemType } from 'butter-provider'

import content, { Content } from './Content'

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
 * @extends {Content}
 * @type {Movie}
 */
export class Movie extends Content {

  /**
   * The language of the movie.
   * @type {string}
   */
  language: string

  /**
   * The release date of the movie.
   * @type {number}
   */
  released: number

  /**
   * The trailer of the movie.
   * @type {string}
   */
  trailer: string

  /**
   * The certification of the movie.
   * @type {string}
   */
  certification: string

  /**
   * The torrents of the movie.
   * @type {Object}
   */
  torrents: Object

  /**
   * Create a new Movie object.
   * @param {!Object} config - The configuration object for the movie.
   * @param {!string} imdb_id - The imdb id of the movie.
   * @param {!string} title - The title of the movie.
   * @param {!number} year - The year of the movie.
   * @param {!string} slug - The slug of the movie.
   * @param {!string} synopsis - The synopsis of the movie.
   * @param {!number} runtime - The runtime of the movie.
   * @param {!Rating} rating - The rating of the movie.
   * @param {!Images} images - The images of the movie.
   * @param {!Array<string>} genres - The genres of the movie.
   * @param {!string} [type=movie] - The type of the movie.
   * @param {!string} [language=en] - The language of the movie.
   * @param {!number} released - The release date of the movie.
   * @param {!string} trailer - The trailer of the movie.
   * @param {!string} certification - The certification of the movie.
   * @param {!Object} torrents - The torrents of the movie.
   */
  constructor({
    imdb_id,
    title,
    year,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    type = ItemType.MOVIE,
    language = 'en',
    released,
    trailer,
    certification,
    torrents
    }: Object
  ): void {
    super({
      imdb_id,
      title,
      year,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres,
      type
    })

    /**
     * The language of the movie.
     * @type {string}
     */
    this.language = language
    /**
     * The release date of the movie.
     * @type {number}
     */
    this.released = released
    /**
     * The trailer of the movie.
     * @type {string}
     */
    this.trailer = trailer
    /**
     * The certification of the movie.
     * @type {string}
     */
    this.certification = certification
    /**
     * The torrents of the movie.
     * @type {Object}
     */
    this.torrents = torrents
  }

}

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
