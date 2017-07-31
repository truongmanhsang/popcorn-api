// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import { Content } from '../../src/models/Content'

/**
 * @test {Content}
 * @flow
 */
describe('Content', () => {

  let content: Content

  /**
   * Hook for setting up the Content tests.
   * @type {Function}
   */
  before(() => {
    content = new Content({
      imdb_id: 'tt1234567'
    })
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the Content tests.
   * @type {Function}
   */
  after(() => {})

})
