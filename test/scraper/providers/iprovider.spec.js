// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IProvider from '../../../src/scraper/providers/IProvider'

/**
 * @test {IProvider}
 * @flow
 */
describe('IProvider', () => {

  /**
   * The IProvider object to be tested.
   * @type {IProvider}
   */
  let iProvider: IProvider

  /**
   * Hook for setting up the IProvider tests.
   * @type {Function}
   */
  before(() => {
    iProvider = new IProvider()
  })

  /** @test {IProvider#attachTorrent} */
  it('should throw an error when calling the attachTorrent method', () => {
    expect(iProvider.attachTorrent).to
      .throw('Using default method: \'attachTorrent\'')
  })

  /** @test {IProvider#getContent} */
  it('should throw an error when calling the getContent method', () => {
    expect(iProvider.getContent).to
      .throw('Using default method: \'getContent\'')
  })

  /** @test {IProvider#search} */
  it('should throw an error when calling the search method', () => {
    expect(iProvider.search).to
      .throw('Using default method: \'search\'')
  })

  /** @test {IProvider#_extractContent} */
  it('should throw an error when calling the _extractContent method', () => {
    expect(iProvider._extractContent).to
      .throw('Using default method: \'_extractContent\'')
  })

  /** @test {IProvider#_getAllContent} */
  it('should throw an error when calling the _getAllContent method', () => {
    expect(iProvider._getAllContent).to
      .throw('Using default method: \'_getAllContent\'')
  })

  /** @test {IProvider#_getAllTorrents} */
  it('should throw an error when calling the _getAllTorrents method', () => {
    expect(iProvider._getAllTorrents).to
      .throw('Using default method: \'_getAllTorrents\'')
  })

  /** @test {IProvider#_getContentData} */
  it('should throw an error when calling the _getContentData method', () => {
    expect(iProvider._getContentData).to
      .throw('Using default method: \'_getContentData\'')
  })

  /**
   * Hook for teaing down the IProvider tests.
   * @type {Function}
   */
  after(() => {})

})
