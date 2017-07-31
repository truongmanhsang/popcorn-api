// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import BaseHelper from '../../../src/scraper/helpers/BaseHelper'

/**
 * @test {BaseHelper}
 * @flow
 */
describe('BaseHelper', () => {

  let baseHelper: BaseHelper

  /**
   * Hook for setting up the BaseHelper tests.
   * @type {Function}
   */
  before(() => {
    baseHelper = new BaseHelper()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the BaseHelper tests.
   * @type {Function}
   */
  after(() => {})

})
