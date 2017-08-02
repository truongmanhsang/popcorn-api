// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IAbstractFactory from '../../../src/scraper/resources/IAbstractFactory'

/**
 * @test {IAbstractFactory}
 * @flow
 */
describe('IAbstractFactory', () => {
  /**
   * The abstract factory object to test
   * @type {IAbstractFactory}
   */
  let iAbstractFactory: IAbstractFactory

  /**
   * Hook for setting up the IAbstractFactory tests.
   * @type {Function}
   */
  before(() => {
    iAbstractFactory = new IAbstractFactory()
  })

  /** @test {IAbstractFactory#getApi} */
  it('should throw an error when callign the getApi method', () => {
    expect(iAbstractFactory.getApi).to
      .throw('Using default method: \'getApi\'')
  })

  /** @test {IAbstractFactory#getHelper} */
  it('should throw an error when calling the getHelper method', () => {
    expect(iAbstractFactory.getHelper).to
      .throw('Using default method: \'getHelper\'')
  })

  /** @test {IAbstractFactory#getModel} */
  it('should throw an error when calling the getModel method', () => {
    expect(iAbstractFactory.getModel).to
      .throw('Using default method: \'getModel\'')
  })
})
