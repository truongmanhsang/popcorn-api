// Import the necessary modules.
import mongoose from 'mongoose'

import { showSchema, Show } from './Show'

/**
 * Class for anime show attributes and methods.
 * @extends {Show}
 * @type {AnimeShow}
 */
export class AnimeShow extends Show {}

// Attatch the fuctions from the AnimeShow class to the showSchema.
showSchema.loadClass(AnimeShow)

/**
 * A model object for anime shows.
 * @ignore
 * @type {AnimeShow}
 */
export const AnimeShowModel = mongoose
  .model('AnimeShow', showSchema, 'animes')
