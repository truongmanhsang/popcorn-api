/* eslint-disable camelcase */
// Import the necessary modules.
/**
 * MongoDB object modeling designed to work in an asynchronous environment.
 * @external {Model} http://mongoosejs.com
 */
import { Model } from 'mongoose'
import { ItemType } from 'butter-provider'

import Images, { imagesSchema } from './Images'
import Rating, { ratingSchema } from './Rating'

/**
 * Base structure of the database content.
 * @type {Object}
 * @ignore
 * @flow
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
    type: ratingSchema,
    required: true,
    ref: 'Rating'
  },
  images: {
    type: imagesSchema,
    required: true,
    ref: 'Images'
  },
  genres: [String],
  type: {
    type: String,
    enum: Object.keys(ItemType).map(key => ItemType[key])
  }
}

/**
 * The Content model.
 * @extends {Model}
 * @type {Content}
 */
export class Content extends Model {

  /**
   * The id of the content.
   * @type {string}
   */
  _id: string

  /**
   * The imdb id of the content.
   * @type {string}
   */
  imdb_id: string

  /**
   * The title of the content.
   * @type {string}
   */
  title: string

  /**
   * The year of the content.
   * @type {number}
   */
  year: number

  /**
   * The slug of the content.
   * @type {string}
   */
  slug: string

  /**
   * The synopsis of the content.
   * @type {string}
   */
  synopsis: string

  /**
   * The runtime of the content.
   * @type {number}
   */
  runtime: number

  /**
   * The rating of the content.
   * @type {Rating}
   */
  rating: Rating

  /**
   * The images of the content.
   * @type {Images}
   */
  images: Images

  /**
   * The genres of the content.
   * @type {Array<string>}
   */
  genres: Array<string>

  /**
   * The type of the content.
   * @type {string}
   */
  type: string

  /**
   * Create a new Content object.
   * @param {!Object} config - The configuration object for the content.
   * @param {!string} imdb_id - The imdb id of the content.
   * @param {!string} title - The title of the content.
   * @param {!number} year - The year of the content.
   * @param {!string} slug - The slug of the content.
   * @param {!string} synopsis - The synopsis of the content.
   * @param {!number} runtime - The runtime of the content.
   * @param {!Rating} rating - The rating of the content.
   * @param {!Images} images - The images of the content.
   * @param {!Array<string>} genres - The genres of the content.
   * @param {!string} type - The type of the content.
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
    type
    }: Object
  ): void {
    super()

    /**
     * The id of the content.
     * @type {string}
     */
    this._id = imdb_id
    /**
     * [
     * @type {string}
     */
    this.imdb_id = imdb_id
    /**
     * The title of the content.
     * @type {string}
     */
    this.title = title
    /**
     * The year of the content.
     * @type {number}
     */
    this.year = year
    /**
     * The slug of the content.
     * @type {string}
     */
    this.slug = slug
    /**
     * The synopsis of the content.
     * @type {string}
     */
    this.synopsis = synopsis
    /**
     * The runtime of the content.
     * @type {number}
     */
    this.runtime = runtime
    /**
     * The rating of the content.
     * @type {Rating}
     */
    this.rating = new Rating(rating)
    /**
     * The images of the content.
     * @type {Images}
     */
    this.images = new Images(images)
    /**
     * The genres of the content.
     * @type {Array<string>}
     */
    this.genres = genres
    /**
     * The type of the content.
     * @type {string}
     */
    this.type = type
  }

  /**
   * Getter for the id of the content.
   * @return {string} - The id of the content.
   */
  get id(): string {
    return this._id
  }

}
