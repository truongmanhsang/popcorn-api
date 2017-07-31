// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import HelperFactory from '../../../src/scraper/resources/HelperFactory'

/**
 * @test {HelperFactory}
 * @flow
 */
describe('HelperFactory', () => {

  let helperFactory: HelperFactory

  /**
   * Hook for setting up the HelperFactory tests.
   * @type {Function}
   */
  before(() => {
    helperFactory = new HelperFactory()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the HelperFactory tests.
   * @type {Function}
   */
  after(() => {})

})
