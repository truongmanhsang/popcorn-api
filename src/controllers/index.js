// Import the necessary modules.
// @flow
import AnimeShow from '../models/AnimeShow'
import BaseContentController from './BaseContentController'
import ContentService from '../services/ContentService'
import ExportController from './ExportController'
import IndexController from './IndexController'
import Movie from '../models/Movie'
import Show from '../models/Show'

/**
 * Object used as a base projections for content.
 * @type {Object}
 */
const baseProjection: Object = {
  _id: 1,
  imdb_id: 1,
  title: 1,
  year: 1,
  slug: 1,
  genres: 1,
  images: 1,
  rating: 1,
  type: 1
}

/**
 * Object used for the projection of movies.
 * @type {Object}
 */
const movieProjection: Object = {
  ...baseProjection,
  synopsis: 1,
  runtime: 1,
  released: 1,
  trailer: 1,
  certification: 1,
  torrents: 1
}

/**
 * Object used for the projection of shows.
 * @type {Object}
 */
const showProjection: Object = {
  ...baseProjection,
  tvdb_id: 1,
  num_seasons: 1
}

/**
 * Object used for the projection of animes.
 * @type {Object}
 */
const animeProjection: Object = {
  ...movieProjection,
  ...showProjection
}

/**
 * Object used to query for content.
 * @type {Object}
 */
const query: Object = {
  $or: [{
    num_seasons: {
      $gt: 0
    }
  }, {
    torrents: {
      $exists: true
    }
  }]
}

/**
 * The controllers used by the setup process of registering them.
 * @type {Array<Object>}
 */
export default [{
  controller: IndexController,
  constructor: []
}, {
  controller: ExportController,
  constructor: []
}, {
  controller: BaseContentController,
  constructor: [
    new ContentService(AnimeShow, 'anime', animeProjection, query),
    'anime'
  ]
}, {
  controller: BaseContentController,
  constructor: [
    new ContentService(Movie, 'move', movieProjection, query),
    'movie'
  ]
}, {
  controller: BaseContentController,
  constructor: [
    new ContentService(Show, 'show', showProjection, query),
    'show'
  ]
}]
