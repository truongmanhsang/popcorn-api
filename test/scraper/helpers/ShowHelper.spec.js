// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'

import Show from '../../../src/models/Show'
import ShowHelper from '../../../src/scraper/helpers/ShowHelper'
import * as baseHelperTests from './BaseHelper.spec'

/**
 * @test {ShowHelper}
 * @flow
 */
describe('ShowHelper', () => {
  /**
   * The show helper to test.
   * @type {ShowHelper}
   */
  let showHelper: ShowHelper

  /**
   * Hook for setting up the ShowHelper tests.
   * @type {Function}
   */
  before(() => {
    showHelper = new ShowHelper('ShowHelper', Show)
  })

  /** @test {ShowHelper#constructor} */
  it('should check the attributes of the ShowHelper', () => {
    baseHelperTests.checkHelperAttributes(showHelper, 'ShowHelper', Show)
    expect(showHelper._tvdb).to.exist
    expect(showHelper._tvdb).to.be.an('object')
  })

  /** @test {ShowHelper#_updateNumSeasons} */
  it.skip('should update the number of seasons for a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_updateEpisode} */
  it.skip('should update an episode of a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_updateEpisodes} */
  it.skip('should update a show with episodes', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_addSeasonalSeason} */
  it.skip('should add a seasonal season to a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_addDateBasedSeason} */
  it.skip('should add a date based season to a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#addEpisodes} */
  it.skip('should add episodes to a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_getTmdbImages} */
  it('should fail to get show images from TMDB', done => {
    const image = [{
      iso_639_1: null,
      file_path: null
    }]
    const stub = sinon.stub(showHelper._tmdb.tv, 'images')
    stub.resolves({
      posters: image,
      backdrops: image
    })

    showHelper._getTmdbImages()
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {ShowHelper#_getTvdbImages} */
  it.skip('should get show images from TVDB', done => {
    showHelper._getTvdbImages(296762)
      .then(res => baseHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it('should get show images from Fanart', done => {
    showHelper._getFanartImages(75682)
      .then(res => baseHelperTests.testImages(res, done))
      .catch(done)
  })

  // TODO: merge function with the one in the moviehelper spec and put it in
  // the basehelper spec.
  /**
   * Test the failures of the `_getFanartImages`.
   * @param {!Object} resolves - The object the stub will resolve.
   * @param {!Function} done - The done function of mocha.
   * @returns {undefined}
   */
  function testGetFanartImages(resolves: Object, done: Function): void {
    /** @test {showHelper#_getFanartImages} */
    it('should fail to get show images from Fanart', done => {
      const stub = sinon.stub(showHelper._fanart, 'getShowImages')
      stub.resolves(resolves)

      showHelper._getFanartImages()
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
    clearart: [{
      url: 'url'
    }]
  })

  /** @test {ShowHelper#_getImages} */
  it.skip('should get show images from various sources', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new show object', done => {
    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new show object with 0 watching', done => {
    const stub = sinon.stub(showHelper._trakt.shows, 'watching')
    stub.resolves()

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new shows object with no genres', done => {
    const stub = sinon.stub(showHelper._trakt.shows, 'summary')
    stub.returns(Promise.resolve({
      ids: {
        imdb: 'imdb',
        tmdb: 'tmdb',
        tvdb: 'tvdb'
      },
      airs: {
        day: 'day',
        time: 'time'
      },
      released: '2016-01-01',
      genres: undefined
    }))

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(showHelper._trakt.shows, 'summary')
    stub.resolves(null)

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })
})
