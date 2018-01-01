// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

/**
 * The provider configuration schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema({
  _id: {
    type: String,
    required: true
  },
  api: {
    type: String,
    required: true
  },
  modelType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  clazz: {
    type: String,
    required: true
  },
  query: {
    type: Object
  }
})
