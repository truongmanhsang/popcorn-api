/* eslint-disable */
import Setup from './src/config/Setup'

import AnimeShow from './src/models/AnimeShow'

Setup.connectMongoDb().then(() => {
  return AnimeShow.findOne({
    _id: 'animeshow'
  })
}).then(res => {
  console.log(res)
}).catch(err => console.error(err))
  .then(Setup.disconnectMongoDb)
