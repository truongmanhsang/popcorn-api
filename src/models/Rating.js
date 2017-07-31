// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'

/**
 * The rating schema used by mongoose.
 * @type {Object}
 * @flow
 * @ignore
 * @see http://mongoosejs.com/docs/guide.html
 */
export const ratingSchema = new Schema({
  percentage: Number,
  watching: Number,
  votes: Number
}, {
  _id: false
})

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
   * @param {!Object} config={} - The configuration object for the rating.
   * @param {!number} config.percentage - The precentage of the rating.
   * @param {!number} config.watching - The amount of watching for the rating.
   * @param {!number} config.votes - The amount of votes of the rating.
   */
  constructor({percentage, watching, votes}: Object = {}): void {
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

// Attach the functions from the Rating class to the ratingSchema.
ratingSchema.loadClass(Rating)

// Create the rating model.
const RatingModel = mongoose.model(Rating, ratingSchema)

/**
 * A model for the rating.
 * @type {RatingModel}
 * @ignore
 */
export default RatingModel
