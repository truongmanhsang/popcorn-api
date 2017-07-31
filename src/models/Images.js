// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'

/**
 * The images schema used by mongoose.
 * @type {Object}
 * @flow
 * @ignore
 * @see http://mongoosejs.com/docs/guide.html
 */
export const imagesSchema = new Schema({
  banner: String,
  fanart: String,
  poster: String
}, {
  _id: false
})

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
   * @param {!Object} config={} - The configuration object for the images.
   * @param {?string} config.banner - The banner image of the images.
   * @param {?string} config.fanart - The fanart image of the images.
   * @param {?string} config.poster - The poster image of the images.
   */
  constructor({banner, fanart, poster}: Object = {}): void {
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

// Attach the functions from the Images class to the imagesSchema.
imagesSchema.loadClass(Images)

// Create the images model.
const ImagesModel = mongoose.model(Images, imagesSchema)

/**
 * A model for the images.
 * @type {ImagesModel}
 * @ignore
 */
export default ImagesModel
