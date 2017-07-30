/* eslint-disable camelcase */
// Import the necessary modules.
/**
 * MongoDB object modeling designed to work in an asynchronous environment.
 * @external {Model} http://mongoosejs.com
 */
import { Model } from 'mongoose'
import { ItemType } from 'butter-provider'

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

/**
 * The Rating model.
 * @extends {Model}
 * @type {Rating}
 */
export class Rating extends Model {

  /**
   * The precentage of the rating.
   * @type {number}
   */
  percentage: number

  /**
   * The amount of watching for the rating.
   * @type {number}
   */
  watching: number

  /**
   * The amount of votes of the rating.
   * @type {number}
   */
  votes: number

  /**
   * Create a new Rating object.
   * @param {!Object} config - The configuration object for the rating.
   * @param {!number} config.percentage - The precentage of the rating.
   * @param {!number} config.watching - The amount of watching for the rating.
   * @param {!number} config.votes - The amount of votes of the rating.
   */
  constructor({percentage, watching, votes}: Object): void {
    super()

    /**
     * The precentage of the rating.
     * @type {number}
     */
    this.percentage = percentage
    /**
     * The amount of watching for the rating.
     * @type {number}
     */
    this.watching = watching
    /**
     * The amount of votes of the rating.
     * @type {number}
     */
    this.votes = votes
  }

}

/**
 * The Images model.
 * @extends {Model}
 * @type {Images}
 */
export class Images extends Model {

  /**
   * The banner of the images.
   * @type {string}
   */
  banner: string

  /**
   * The fanart of the images.
   * @type {string}
   */
  fanart: string

  /**
   * The poster of the images.
   * @type {string}
   */
  poster: string

  /**
   * Create a new Images object.
   * @param {!Object} config - The configuration object for the images.
   * @param {?string} config.banner - The banner image of the images.
   * @param {?string} config.fanart - The fanart image of the images.
   * @param {?string} config.poster - The poster image of the images.
   */
  constructor({banner, fanart, poster}: Object): void {
    super()

    /**
     * The banner of the images.
     * @type {string}
     */
    this.banner = banner
    /**
     * The fanart of the images.
     * @type {string}
     */
    this.fanart = fanart
    /**
     * The poster of the images.
     * @type {string}
     */
    this.poster = poster
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
   * [
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
  get id() {
    return this._id
  }

}
