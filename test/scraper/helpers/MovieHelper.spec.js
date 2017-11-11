// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import Movie from '../../../src/models/Movie'
import MovieHelper from '../../../src/scraper/helpers/MovieHelper'
import Setup from '../../../src/config/Setup'
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
  before(done => {
    movieHelper = new MovieHelper('MovieHelper', Movie)

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
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
    const stub = sinon.stub(movieHelper._tmdb.movie, 'images')
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

  /** @test {MovieHelper#_getOmdbImages} */
  it('should get movie images from OMDB', done => {
    movieHelper._getOmdbImages('tt1431045')
      .then(res => baseHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it('should get movie images from Fanart', done => {
    movieHelper._getFanartImages(10195)
      .then(res => baseHelperTests.testImages(res, done))
      .catch(done)
  })

  /**
   * Test the failures of the `_getFanartImages`.
   * @param {!Object} resolves - The object the stub will resolve.
   * @param {!Function} done - The done function of mocha.
   * @returns {undefined}
   */
  function testGetFanartImages(resolves: Object, done: Function): void {
    /** @test {MovieHelper#_getFanartImages} */
    it('should fail to get movie images from Fanart', done => {
      const stub = sinon.stub(movieHelper._fanart, 'getMovieImages')
      stub.resolves(resolves)

      movieHelper._getFanartImages()
        .then(done)
        .catch(err => {
          expect(err).to.be.an('Error')

          stub.restore()
          done()
        })
    })
  }

  // Execute the tests.
  testGetFanartImages({})
  testGetFanartImages({
    hdmovieclearart: [{
      url: 'url'
    }]
  })

  /** @test {MovieHelper#_getImages} */
  it.skip('should get movie images from various sources', () => {
    expect(true).to.be.true
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
    const stub = sinon.stub(movieHelper._trakt.movies, 'watching')
    stub.resolves()

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object with no genres', done => {
    const stub = sinon.stub(movieHelper._trakt.movies, 'summary')
    stub.returns(Promise.resolve({
      ids: {
        imdb: 'imdb',
        tmdb: 'tmdb'
      },
      released: '2016-01-01',
      genres: undefined
    }))

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(movieHelper._trakt.movies, 'summary')
    stub.resolves(null)

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the MovieHelper tests.
   * @type {Function}
   */
  after(done => {
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
