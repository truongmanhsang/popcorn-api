// Import the necessary modules.
import mongoose from 'mongoose'

import { MovieSchema } from './Movie'
import { ShowSchema } from './Show'

/**
 * A model object for anime movies.
 * @type {AnimeMovie}
 */
export const AnimeMovie = mongoose.model('AnimeMovie', MovieSchema, 'animes')

/**
 * A model object for anime shows.
 * @type {AnimeShow}
 */
export const AnimeShow = mongoose.model('AnimeShow', ShowSchema, 'animes')
