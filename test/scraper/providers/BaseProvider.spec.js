// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import BaseProvider from '../../../src/scraper/providers/BaseProvider'

/**
 * Check the constructor of the base provider.
 * @param {!BasebaseProvider} provider - The base provider to test.
 * @param {!string} name - The name to check for.
 * @returns {undefined}
 */
export function checkProviderAttributes(
  provider: BaseProvider,
  name: string
): void {
  expect(provider._api).to.exist
  expect(provider._api).to.be.an('object')
  expect(provider._name).to.be.an('string')
  expect(provider._name).to.equal(name)
  expect(provider._query).to.exist
  expect(provider._query).to.be.an('object')
  expect(provider._type).to.exist
  expect(provider._type).to.be.a('string')
}

/**
 * @test {BaseProvider}
 * @flow
 */
describe('BaseProvider', () => {
  /**
   * The base provider to test.
   * @type {Baseprovider}
   */
  let baseProvider: BaseProvider

  /**
   * Hook for setting up the BaseProvider tests.
   * @type {Function}
   */
  before(() => {
    baseProvider = new BaseProvider({
      api: 'eztv',
      name: 'BaseProvider',
      modelType: 'show',
      query: {},
      type: 'tvshow'
    })
  })

  /** @test {BaseProvider.ModelTypes} */
  it('should check if BaseProvider has a static ModelTypes', () => {
    expect(BaseProvider.ModelTypes).to.exist
    expect(BaseProvider.ModelTypes).to.be.an('object')
  })

  /** @test {BaseProvider.Types} */
  it('should check if BaseProvider has a static Types', () => {
    expect(BaseProvider.Types).to.exist
    expect(BaseProvider.Types).to.be.an('object')
  })

  /** @test {BaseProvider._MaxWebRequest} */
  it('should check if BaseProvider has a static _MaxWebRequest', () => {
    expect(BaseProvider.Types).to.exist
    expect(BaseProvider._MaxWebRequest).to.be.a('number')
  })

  /** @test {BaseProvider#constructor} */
  it('should check the attributes of the BaseProvider', () => {
    checkProviderAttributes(baseProvider, 'BaseProvider')
  })

  /** @test {BaseProvider#name} */
  it('should get the name of the provider', () => {
    const providerName = baseProvider.name
    expect(providerName).to.equal('BaseProvider')
  })

  /** @test {BaseProvider#getConcent} */
  it.skip('should insert a torrent into the database', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#_getContentData} */
  it.skip('should get content info form a given torrent', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#_getAllTorrents} */
  it.skip('should get all the torrent for the given torrent provider', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#_getTotalPages} */
  it.skip('should return a the number of the total pages to scrape', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#search} */
  it.skip('should return a list of all the inserted torrents', done => {
    expect(true).to.be.true
    done()
  })
})
