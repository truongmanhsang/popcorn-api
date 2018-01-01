// Import the necessary modules.
// @flow
import mongoose from 'mongoose'

import AnimeMovieModel from './AnimeMovieModel'
import animeMovieSchema from './animeMovieSchema'

// Attach the functions from the classes to the schemas.
animeMovieSchema.loadClass(AnimeMovieModel)

/**
 * The anime movie model.
 * @type {AnimeMovie}
 * @ignore
 */
export default mongoose.model(AnimeMovieModel, animeMovieSchema)
