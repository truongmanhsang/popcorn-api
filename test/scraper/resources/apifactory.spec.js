// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ApiFactory from '../../../src/scraper/resources/ApiFactory'

/**
 * @test {ApiFactory}
 * @flow
 */
describe('ApiFactory', () => {

  let apiFactory: ApiFactory

  /**
   * Hook for setting up the ApiFactory tests.
   * @type {Function}
   */
  before(() => {
    apiFactory = new ApiFactory()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the ApiFactory tests.
   * @type {Function}
   */
  after(() => {})

})

