// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Show from '../../src/models/Show'
import testShow from '../data/show.json'

/**
 * @test {Show}
 * @flow
 */
describe('Show', () => {

  /**
   * The show object to test.
   * @type {Show}
   */
  let show: Show

  /**
   * The show obejct initiated without a constructor object.
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

  /** @test {Images#poster} */
  it('should check if Images has a poster', () => {
    expect(show.id).to.be.a('string')
    expect(show.id).to.equal(testShow.imdb_id)
  })

  /** @test {Images#banner} */
  it('should check if id is null', () => {
    expect(showEmpty.id).to.be.null
  })

})
