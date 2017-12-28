// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'

import { logger } from '..'
import { Show } from '../../../src/models'
import { ShowHelper } from '../../../src/scraper/helpers'
import {
  fanart,
  trakt,
  tmdb
} from '../../../src/scraper/apiModules'
import * as abstractHelperTests from './AbstractHelper.spec'

/** @test {ShowHelper} */
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
    if (!global.logger) {
      global.logger = logger
    }

    showHelper = new ShowHelper({
      name: 'ShowHelper',
      Model: Show
    })
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
    const stub = sinon.stub(tmdb.tv, 'images')
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
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getTvdbImages} */
  it.skip('should get show images from TVDB', done => {
    showHelper._getTvdbImages(296762)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it('should get show images from Fanart', done => {
    showHelper._getFanartImages(75682)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it(`should fail to get show images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages({
      clearart: [{
        url: 'url'
      }]
    }, 'show', fanart, showHelper, done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it(`should fail to get show images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages(
      {}, 'show', fanart, showHelper, done
    )
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
    const stub = sinon.stub(trakt.shows, 'watching')
    stub.resolves()

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new shows object with no genres', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
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
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.throws()

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.resolves({
      ids: {
        imdb: null
      }
    })

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.resolves(null)

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })
})
