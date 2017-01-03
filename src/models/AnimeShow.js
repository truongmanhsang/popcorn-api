// Import the neccesary modules.
import mongoose from 'mongoose';

import { ShowSchema as AnimeSchema } from './Show';

// Create the anime model.
const Anime = mongoose.model('Anime', AnimeSchema);

/**
 * A model object for anime shows.
 * @type {Anime}
 */
export default Anime;
