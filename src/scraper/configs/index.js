// Import the necessary modules.
import horriblesubsanime from './horriblesubsanime.json'
// import nyaaanime from './nyaaanime.json'

// import etmovies from './etmovies.json'
// import katmovies from './katmovies.json'
import ytsmovies from './ytsmovies.json'

// import etshows from './etshows.json'
import eztvshows from './eztvshows.json'
// import katshows from './katshows.json'

/**
 * NOTE: The order of the json arrays is important. It will determine at what
 * order the objects are inserted. The `insertMany` function inserts the array
 * backwards. So in the case for `animes` the HorribleSubs provider configs are
 * inserted first and the Nyaa provider configs are inserted second.
 */
const providers = [].concat(
  eztvshows,
  // etshows,
  // katshows,
  ytsmovies,
  // etmovies,
  // katmovies,
  horriblesubsanime
  // nyaaanime
)

/**
 * Export the providers.
 * @type {Array<Object>}
 */
export default providers
