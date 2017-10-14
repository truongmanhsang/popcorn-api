// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IHelper from '../../../src/scraper/helpers/IHelper'

/**
 * @test {IHelper}
 * @flow
 */
describe('IHelper', () => {
  /**
   * The IHelper object to be tested.
   * @type {IHelper}
   */
  let iHelper: IHelper

  /**
   * Hook for setting up the IHelper tests.
   * @type {Function}
   */
  before(() => {
    iHelper = new IHelper()
  })

  /** @test {IHelper#getTraktInfo} */
  it('should throw an error when calling the getTrakt method', () => {
    expect(iHelper.getTraktInfo).to
      .throw('Using default method: \'getTraktInfo\'')
  })

  /** @test {IHelper#_checkImages} */
  it('should throw an error when calling the _checkImages method', () => {
    expect(iHelper._checkImages).to
      .throw('Using default method: \'_checkImages\'')
  })

  /** @test {IHelper#_getImages} */
  it('should throw an error when calling the _getImages method', () => {
    expect(iHelper._getImages).to
      .throw('Using default method: \'_getImages\'')
  })
})
