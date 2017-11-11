// Import the necessary modules.
import mongoose from 'mongoose'

import AnimeMovieModel from './AnimeMovieModel'
import animeMovieSchema from '../movie/movieSchema'

// Attach the functions from the classes to the schemas.
animeMovieSchema.loadClass(AnimeMovieModel)

/**
 * The anime movie model.
 * @ignore
 * @type {AnimeMovie}
 */
export default mongoose.model(AnimeMovieModel, animeMovieSchema, 'animes')
