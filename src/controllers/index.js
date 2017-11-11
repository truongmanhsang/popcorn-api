// Import the necessary modules.
// @flow
import { ContentService } from 'pop-api'

import ContentController from './ContentController'
import ExportController from './ExportController'
import IndexController from './IndexController'
import {
  AnimeShow as Anime,
  Movie,
  Show
} from '../models'

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
  Controller: IndexController,
  constructor: {}
}, {
  Controller: ExportController,
  constructor: {}
}, {
  Controller: ContentController,
  constructor: {
    service: new ContentService({
      Model: Anime,
      itemType: 'anime',
      projection: animeProjection,
      query
    })
  }
}, {
  Controller: ContentController,
  constructor: {
    service: new ContentService({
      Model: Movie,
      itemType: 'move',
      projection: movieProjection,
      query
    })
  }
}, {
  Controller: ContentController,
  constructor: {
    service: new ContentService({
      Model: Show,
      itemType: 'show',
      projections: showProjection,
      query
    })
  }
}]
