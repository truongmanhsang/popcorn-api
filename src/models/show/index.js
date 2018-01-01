// Import the necessary modules.
// @flow
import mongoose from 'mongoose'

import ShowModel from './ShowModel'
import showSchema from './showSchema'

// Attach the functions from the classes to the schemas.
showSchema.loadClass(ShowModel)

/**
 * The show model.
 * @type {Show}
 * @ignore
 */
export default mongoose.model(ShowModel, showSchema)
