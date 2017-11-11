// Import the necessary modules.
import mongoose from 'mongoose'

import AnimeShowModel from './AnimeShowModel'
import animeShowSchema from '../show/showSchema'

// Attach the functions from the classes to the schemas.
animeShowSchema.loadClass(AnimeShowModel)

/**
 * The anime show model.
 * @ignore
 * @type {AhimeShow}
 */
export default mongoose.model(AnimeShowModel, animeShowSchema, 'animes')
