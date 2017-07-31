// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import FactoryProducer from '../../../src/scraper/resources/FactoryProducer'

/**
 * @test {FactoryProducer}
 * @flow
 */
describe('FactoryProducer', () => {

  let factoryProducer: FactoryProducer

  /**
   * Hook for setting up the FactoryProducer tests.
   * @type {Function}
   */
  before(() => {
    factoryProducer = new FactoryProducer()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the FactoryProducer tests.
   * @type {Function}
   */
  after(() => {})

})
