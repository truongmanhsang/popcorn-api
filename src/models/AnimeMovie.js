// Import the neccesary modules.
import mongoose from 'mongoose';

import { MovieSchema as AnimeSchema } from './Movie';

// Create the anime model.
const Anime = mongoose.model('Anime', AnimeSchema);

/**
 * A model object for anime shows.
 * @type {Anime}
 */
export default Anime;
