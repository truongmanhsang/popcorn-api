/* eslint-disable no-console */
// Import the neccesary modules.
import asyncq from 'async-q'

import ProviderConfig from '../../models/ProviderConfig'
import Setup from '../../config/Setup'

import horriblesubsanime from './horriblesubsanime.json'
import nyaaanime from './nyaaanime.json'

import etmovies from './etmovies.json'
// import katmovies from './katmovies.json';
import ytsmovies from './ytsmovies.json'

import etshows from './etshows.json'
import eztvshows from './eztvshows.json'
// import katshows from './katshows.json';

Setup.connectMongoDB()

/**
 * NOTE: The order of the json arrays is important. It will determine at what
 * order the objects are inserted. The `insertMany` function inserts the array
 * backwards. So in the case for `animes` the HorribleSubs provider configs are
 * inserted first and the Nyaa provider configs are inserted second.
 */
const providers = [].concat(
  eztvshows,
  etshows,
  // katshows,
  ytsmovies,
  etmovies,
  // katmovies,
  horriblesubsanime,
  nyaaanime
)

/**
 * NOTE: Again the order of the promises are important. It will determine at
 * what order the objects are inserted. Because we are using the `eachSeries`
 * function the first promise will be resolved first before going to the second
 * promise and etc. This is important because when fetching the provider configs
 * in the `Scraper` class we want it to go in a certain order. The order will be
 * determined by the order of inserting the provider configs. We can do this
 * with: `.sort({ $natural: <order> }).`
 */
asyncq.eachSeries(providers, provider => {
  return ProviderConfig.findOneAndUpdate({
    _id: provider.name
  }, provider, {
    upsert: true,
    new: true
  }).exec()
}).then(res => {
  console.log(`Inserted: '${res.length}' provider configurations.`)
  process.exit(0)
}).catch(err => {
  console.error(`Oops something went wrong: ${err}`)
  process.exit(1)
})
