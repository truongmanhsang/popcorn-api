// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Context from '../../src/scraper/Context'

/**
 * @test {Context}
 * @flow
 */
describe('Context', () => {

  let context: Context

  /**
   * Hook for setting up the Context tests.
   * @type {Function}
   */
  before(() => {
    context = new Context()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the Context tests.
   * @type {Function}
   */
  after(() => {})

})
