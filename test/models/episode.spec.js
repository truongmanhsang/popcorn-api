// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Episode from '../../src/models/Episode'

/**
 * @test {Episode}
 * @flow
 */
describe('Episode', () => {

  let episode: Episode

  /**
   * Hook for setting up the Episode tests.
   * @type {Function}
   */
  before(() => {
    episode = new Episode()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the Episode tests.
   * @type {Function}
   */
  after(() => {})

})
