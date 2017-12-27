// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import testShow from '../data/show'
import { Show } from '../../src/models'
import * as contentTests from './Content.spec'

/**
 * It should check the attributes of a show.
 * @param {Show} show - The show to test.
 * @param {Object} testShow - The movie to test against.
 * @returns {undefined}
 */
export function testShowAttributes(show: Show, testShow: Object): void {
  contentTests.testContentAttributes(show, testShow, 'tvshow')

  expect(show.air_day).to.be.a('string')
  expect(show.air_day).to.equal(testShow.air_day)
  expect(show.air_time).to.be.a('string')
  expect(show.air_time).to.deep.equal(testShow.air_time)
  expect(show.country).to.be.a('string')
  expect(show.country).to.equal(testShow.country)
  expect(show.episodes).to.be.an('array')
  expect(show.last_updated).to.be.a('number')
  expect(show.last_updated).to.equal(testShow.last_updated)
  expect(show.latest_episode).to.be.a('number')
  expect(show.latest_episode).to.equal(testShow.latest_episode)
  expect(show.network).to.be.a('string')
  expect(show.network).to.equal(testShow.network)
  expect(show.num_seasons).to.be.a('number')
  expect(show.num_seasons).to.equal(testShow.num_seasons)
  expect(show.status).to.be.a('string')
  expect(show.status).to.equal(testShow.status)
  expect(show.tvdb_id).to.be.a('number')
  expect(show.tvdb_id).to.equal(testShow.tvdb_id)
}

/**
 * It should check the attributes of an empty show.
 * @param {Show} showEmpty - The show to test.
 * @returns {undefined}
 */
export function testEmptyShowAttributes(showEmpty: Show): void {
  contentTests.testEmptyContentAttributes(showEmpty, 'tvshow')

  expect(showEmpty.air_date).to.be.undefined
  expect(showEmpty.air_time).to.be.undefined
  expect(showEmpty.country).to.be.undefined
  expect(showEmpty.episodes).to.be.undefined
  expect(showEmpty.last_updated).to.be.undefined
  expect(showEmpty.latest_episode).to.equal(0)
  expect(showEmpty.network).to.be.undefined
  expect(showEmpty.num_seasons).to.be.undefined
  expect(showEmpty.status).to.be.undefined
  expect(showEmpty.tvdb_id).to.be.undefined
}

/** @test {Show} */
describe('Show', () => {
  /**
   * The show object to test.
   * @type {Show}
   */
  let show: Show

  /**
   * The show object initiated without a constructor object.
   * @type {Show}
   */
  let showEmpty: Show

  /**
   * Hook for setting up the Show tests.
   * @type {Function}
   */
  before(() => {
    show = new Show(testShow)
    showEmpty = new Show()
  })

  /** @test {Show#constructor} */
  it('should check the attributes of a show', () => {
    testShowAttributes(show, testShow)
  })

  /** @test {Show#constructor} */
  it('should check the attributes of an empty show', () => {
    testEmptyShowAttributes(showEmpty)
  })
})
