// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Movie from '../../../src/models/Movie'
import MovieHelper from '../../../src/scraper/helpers/MovieHelper'
import * as baseHelperTests from './BaseHelper.spec'

/**
 * @test {MovieHelper}
 * @flow
 */
describe('MovieHelper', () => {
  /** 
   * The movie helper to test.
   * @type {MovieHelper}
   */
  let movieHelper: MovieHelper

  /**
   * Hook for setting up the MovieHelper tests.
   * @type {Function}
   */
  before(() => {
    movieHelper = new MovieHelper('MovieHelper', Movie)
  })

  /** @test {MovieHelper#constructor} */
  it('should check the attributes of the MovieHelper', () => {
    baseHelperTests.checkHelperAttributes(movieHelper, 'MovieHelper', Movie)
    expect(movieHelper._omdb).to.exist
    expect(movieHelper._omdb).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it.skip('should update the torrent for an existing movie', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_updateMovie} */
  it.skip('should update a given movie', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#addTorrents} */
  it.skip('should add torrents to a movie', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_getTmdbImages} */
  it.skip('should get movie images from TMDB', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_getOmdbImages} */
  it.skip('should get movie images from OMDB', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_getFanartImages} */
  it.skip('should get movie images from Fanart', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_getImages} */
  it.skip('should get movie images from various sources', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#getTraktInfo} */
  it.skip('should get info from Trakt an make a new movie object', () => {
    expect(true).to.be.true
  })
})
