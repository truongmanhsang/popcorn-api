// Import the necessary modules.
import mongoose from 'mongoose'

import { showSchema, Show } from './Show'

/**
 * Class for anime show attributes and methods.
 * @extends {Show}
 * @type {AnimeShow}
 */
export class AnimeShow extends Show {}

// Attach the fuctions from the AnimeShow class to the showSchema.
showSchema.loadClass(AnimeShow)

// Create the anime show model.
const AnimeShowModel = mongoose.model(AnimeShow, showSchema, 'animes')

/**
 * A model object for anime shows.
 * @ignore
 * @type {AnimeShow}
 */
export default AnimeShowModel
