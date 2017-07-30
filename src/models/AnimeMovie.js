// Import the necessary modules.
import mongoose from 'mongoose'

import { movieSchema, Movie } from './Movie'

/**
 * Class for anime movie attributes and methods.
 * @extends {Movie}
 * @type {AnimeMovie}
 */
export class AnimeMovie extends Movie {}

// Attatch the fuctions from the AnimeMovie class to the movieSchema.
movieSchema.loadClass(AnimeMovie)

/**
 * A model object for anime movies.
 * @ignore
 * @type {AnimeMovie}
 */
export const AnimeMovieModel = mongoose
  .model('AnimeMovie', movieSchema, 'animes')
