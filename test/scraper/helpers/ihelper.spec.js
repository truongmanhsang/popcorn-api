// Import the necessary modules.
/* eslint-disable padded-blocks */
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

  /** @test {IHelper#attachTorrent} */
  it('should throw an error when calling the attachTorrent method', () => {
    expect(iHelper.getTraktInfo).to
      .throw('Using default method: \'getTraktInfo\'')
  })

  /** @test {IHelper#getContent} */
  it('should throw an error when calling the getContent method', () => {
    expect(iHelper._checkImages).to
      .throw('Using default method: \'_checkImages\'')
  })

  /** @test {IHelper#search} */
  it('should throw an error when calling the search method', () => {
    expect(iHelper._getImages).to
      .throw('Using default method: \'_getImages\'')
  })

})
