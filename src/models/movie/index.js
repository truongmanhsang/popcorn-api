// Import the necessary modules.
// @flow
import mongoose from 'mongoose'

import MovieModel from './MovieModel'
import movieSchema from './movieSchema'

// Define the indexes at the schema level.
movieSchema.index({
  title: 'text',
  synopsis: 'text',
  _id: 1
})

// Attach the functions from the classes to the schemas.
movieSchema.loadClass(MovieModel)

/**
 * The movie model.
 * @type {Movie}
 * @ignore
 */
export default mongoose.model(MovieModel, movieSchema)
