// Import the neccesary modules.
// @flow
import del from 'del'
import dotenv from 'dotenv'
// @flow-ignore
import hooks from 'hooks'
import mkdirp from 'mkdirp'
import pMap from 'p-map'
import { createWriteStream } from 'fs'
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

/**
 * The database middleware to connect to MongoDb.
 * @type {Database}
 */
let database: Database

hooks.beforeAll((t, done) => {
  database = new Database({}, {
    database: name
  })

  del.sync([tempDir])
  mkdirp.sync(tempDir)
  createWriteStream(join(...[
    tempDir,
    `${name}.log`
  ])).end()

  return database.connect().then(() => {
    models.push({
      c: AnimeMovie,
      m: new AnimeMovie(testAnimeMovie)
    }, {
      c: AnimeShow,
      m: new AnimeShow(testAnimeShow)
    }, {
      c: Movie,
      m: new Movie(testMovie)
    }, {
      c: Show,
      m: new Show(testShow)
    })

    return pMap(models, model => {
      return model.c.findOneAndUpdate({
        _id: model.m.id
      }, model.m, {
        upsert: true,
        new: true
      }).exec()
        .then(res => hooks.log(`Inserted content: '${res.id}'`))
    })
  }).then(() => database.disconnect())
    .then(() => done())
    .catch(err => {
      hooks.error(`Uhoh an error occurred during the beforeAll hook: '${err}'`)
      done()
    })
})

hooks.afterAll((t, done) => {
  return database.connect().then(() => {
    return pMap(models, model => {
      return model.c.findOneAndRemove({
        _id: model.m.id
      }, model.model).exec()
        .then(res => hooks.log(`Removed content: '${res.id}'`))
    })
  }).then(() => database.disconnect())
    .then(del.sync([tempDir]))
    .then(done)
    .catch(err => {
      hooks.error(`Uhoh an error occurred during the afterAll hook: '${err}'`)
      done()
    })
})
