// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import { showSchema } from '../show/showSchema'

/**
 * The anime show schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema(showSchema, {
  collection: 'animes'
})
