// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import contentSchema from '../content/contentSchema'

/**
 * The movie schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema({
  ...contentSchema,
  language: String,
  released: Number,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  torrents: {}
})
