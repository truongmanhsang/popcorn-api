// Import the neccesary modules.
// @flow
import del from 'del'
import dotenv from 'dotenv'
// @flow-ignore
import hooks from 'hooks'
import pMap from 'p-map'
import { Database } from 'pop-api'
import { join } from 'path'

import testAnimeMovie from './test/data/animemovie'
import testAnimeShow from './test/data/animeshow'
import testMovie from './test/data/movie'
import testShow from './test/data/show'
import {
  AnimeMovie,
  AnimeShow,
  Movie,
  Show
} from './src/models'
import { name } from './package'

dotenv.config()
process.env.TEMP_DIR = process.env.TEMP_DIR || join(...['tmp'])

const tempDir = process.env.TEMP_DIR
const models = []
let database: Database

hooks.beforeAll((t, done) => {
  database = new Database({}, {
    database: name
  })

  return database.connectMongoDb().then(() => {
    models.push({
      clazz: AnimeMovie,
      model: new AnimeMovie(testAnimeMovie)
    }, {
      clazz: AnimeShow,
      model: new AnimeShow(testAnimeShow)
    }, {
      clazz: Movie,
      model: new Movie(testMovie)
    }, {
      clazz: Show,
      model: new Show(testShow)
    })

    return pMap(models, model => {
      return model.clazz.findOneAndUpdate({
        _id: model.model.id
      }, model.model, {
        upsert: true,
        new: true
      }).exec()
        .then(res => hooks.log(`Inserted content: '${res.id}'`))
    })
  }).then(() => database.disconnectMongoDb())
    .then(() => done())
    .catch(err => {
      hooks.error(`Uhoh an error occurred during the beforeAll hook: '${err}'`)
      done()
    })
})

hooks.afterAll((t, done) => {
  return database.connectMongoDb().then(() => {
    return pMap(models, model => {
      return model.clazz.findOneAndRemove({
        _id: model.model.id
      }, model.model).exec()
        .then(res => hooks.log(`Removed content: '${res.id}'`))
    })
  }).then(() => database.disconnectMongoDb())
    .then(del.sync([tempDir]))
    .then(done)
    .catch(err => {
      hooks.error(`Uhoh an error occurred during the afterAll hook: '${err}'`)
      done()
    })
})
