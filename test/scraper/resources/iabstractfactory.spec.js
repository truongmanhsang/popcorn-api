// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IAbstractFactory from '../../../src/scraper/resources/IAbstractFactory'

/**
 * @test {IAbstractFactory}
 * @flow
 */
describe('IAbstractFactory', () => {

  let iAbstractFactory: IAbstractFactory
  /**
   * Hook for setting up the IAbstractFactory tests.
   * @type {Function}
   */
  before(() => {
    iAbstractFactory = new IAbstractFactory()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the IAbstractFactory tests.
   * @type {Function}
   */
  after(() => {})

})
