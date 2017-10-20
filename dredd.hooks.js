// Import the neccesary modules.
import del from 'del'
import dotenv from 'dotenv'
import hooks from 'hooks'
import pMap from 'p-map'
import { join } from 'path'

import AnimeMovie from './src/models/AnimeMovie'
import AnimeShow from './src/models/AnimeShow'
import Movie from './src/models/Movie'
import Setup from './src/config/Setup'
import Show from './src/models/Show'

import testAnimeMovie from './test/data/animemovie.json'
import testAnimeShow from './test/data/animeshow.json'
import testMovie from './test/data/movie.json'
import testShow from './test/data/show.json'

const models = []

hooks.beforeAll((t, done) => {
  dotenv.config()

  // Set the TEMP_DIR environment variable if it is not set in the .env file.
  process.env.TEMP_DIR = process.env.TEMP_DIR
    ? process.env.TEMP_DIR
    : join(process.cwd(), 'tmp')

  Setup.connectMongoDb()

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
  }).then(done)
    .catch(err => {
      hooks.error(`Uhoh an error occured during the beforeAll hook: '${err}'`)
      done()
    })
})

hooks.afterAll((t, done) => {
  return pMap(models, model => {
    return model.clazz.findOneAndRemove({
      _id: model.model.id
    }, model.model).exec()
      .then(res => hooks.log(`Removed conent: '${res.id}'`))
  }).then(() => Setup.disconnectMongoDb())
    .then(del.sync([process.env.TEMP_DIR]))
    .then(done)
    .catch(err => {
      hooks.error(`Uhoh an error occured during the afterAll hook: '${err}'`)
      done()
    })
})
