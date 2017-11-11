// Import the necessary modules.
import mongoose from 'mongoose'

import MovieModel from './MovieModel'
import movieSchema from './movieSchema'

// Attach the functions from the classes to the schemas.
movieSchema.loadClass(MovieModel)

/**
 * The movie model.
 * @ignore
 * @type {Movie}
 */
export default mongoose.model(MovieModel, movieSchema, 'movies')
