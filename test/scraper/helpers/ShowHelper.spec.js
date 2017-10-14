// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

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

  /** @test {ShowHelper#_getTmbdImages} */
  it.skip('should get show images from TMDB', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_getTvbdImages} */
  it.skip('should get show images from TVDB', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_getFanartImages} */
  it.skip('should get show images from Fanart', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_getImages} */
  it.skip('should get show images from various sources', () => {
    expect(true).to.be.true
  })

  /** @test {MovieHelper#getTraktInfo} */
  it.skip('should get info from Trakt an make a new show object', () => {
    expect(true).to.be.true
  })
})
