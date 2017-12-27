// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import { Movie } from '../../../src/models'
import { MovieHelper } from '../../../src/scraper/helpers'
import {
  fanart,
  tmdb,
  trakt
} from '../../../src/scraper/apiModules'
import * as abstractHelperTests from './AbstractHelper.spec'

/** @test {MovieHelper} */
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
    movieHelper = new MovieHelper({
      name: 'MovieHelper',
      Model: Movie
    })
  })

  /** @test {MovieHelper#_updateTorrent} */
  it.skip('should update the torrent for an existing movie', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_updateMovie} */
  it.skip('should update a given movie', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {MovieHelper#addTorrents} */
  it.skip('should add torrents to a movie', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#_getTmdbImages} */
  it('should fail to get movie images from TMDB', done => {
    const image = [{
      iso_639_1: null,
      file_path: null
    }]
    const stub = sinon.stub(tmdb.movie, 'images')
    stub.resolves({
      posters: image,
      backdrops: image
    })

    movieHelper._getTmdbImages()
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {MovieHelper#_getTmdbImages} */
  it.skip('should get movie images from TMDB', done => {
    movieHelper._getTmdbImages(10195)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getOmdbImages} */
  it('should get movie images from OMDB', done => {
    movieHelper._getOmdbImages('tt1431045')
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it('should get movie images from Fanart', done => {
    movieHelper._getFanartImages(10195)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it(`should fail to get movie images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages({
      hdmovieclearart: [{
        url: 'url'
      }]
    }, 'movie', fanart, movieHelper, done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it(`should fail to get movie images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages(
      {}, 'movie', fanart, movieHelper, done
    )
  })

  /** @test {MovieHelper#_getImages} */
  it.skip('should get movie images from various sources', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object', done => {
    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object with 0 watching', done => {
    const stub = sinon.stub(trakt.movies, 'watching')
    stub.resolves()

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object with no genres', done => {
    const stub = sinon.stub(trakt.movies, 'summary')
    stub.resolves({
      ids: {
        imdb: 'imdb',
        tmdb: 'tmdb'
      },
      released: '2016-01-01',
      genres: undefined
    })

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.movies, 'summary')
    stub.resolves(null)

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })
})
