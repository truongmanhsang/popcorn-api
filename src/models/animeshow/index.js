// Import the necessary modules.
// @flow
import mongoose from 'mongoose'

import AnimeShowModel from './AnimeShowModel'
import animeShowSchema from './animeShowSchema'

// Define the indexes at the schema level.
animeShowSchema.index({
  title: 'text',
  synopsis: 'text',
  _id: 1
})

// Attach the functions from the classes to the schemas.
animeShowSchema.loadClass(AnimeShowModel)

/**
 * The anime show model.
 * @type {AhimeShow}
 * @ignore
 */
export default mongoose.model(AnimeShowModel, animeShowSchema)
