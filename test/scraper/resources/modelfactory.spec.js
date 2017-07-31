// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ModelFactory from '../../../src/scraper/resources/ModelFactory'

/**
 * @test {ModelFactory}
 * @flow
 */
describe('ModelFactory', () => {

  let modelFactory: ModelFactory

  /**
   * Hook for setting up the ModelFactory tests.
   * @type {Function}
   */
  before(() => {
    modelFactory = new ModelFactory()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the ModelFactory tests.
   * @type {Function}
   */
  after(() => {})

})
