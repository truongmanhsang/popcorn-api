// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import BaseProvider from '../../../src/scraper/providers/BaseProvider'
import katConfig from '../../../src/scraper/configs/katmovies.json'
import nyaaConfig from '../../../src/scraper/configs/nyaaanime.json'
import ytsConfig from '../../../src/scraper/configs/ytsmovies.json'

/**
 * Check the constructor of the base provider.
 * @param {!BaseProvider} provider - The base provider to test.
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
   * @type {BaseProvider}
   */
  let baseProvider: BaseProvider

  /**
   * Hook for setting up the BaseProvider tests.
   * @type {Function}
   */
  before(() => {
    nyaaConfig[0].query.limit = 1
    baseProvider = new BaseProvider(nyaaConfig[0])
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
    checkProviderAttributes(baseProvider, nyaaConfig[0].name)
  })

  /** @test {BaseProvider#name} */
  it('should get the name of the provider', () => {
    const providerName = baseProvider.name
    expect(providerName).to.equal(nyaaConfig[0].name)
  })

  /** @test {BaseProvider#getConcent} */
  it('should return an error ', done => {
    baseProvider._type = 'faulty'
    baseProvider.getContent()
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {BaseProvider#_getContentData} */
  it('should not get info from a given torrent object', () => {
    baseProvider._regexps = [{
      regex: /\d+/g
    }]
    const contentData = baseProvider._getContentData({
      title: 'faulty'
    })

    expect(contentData).to.be.undefined
  })

  /** @test {BaseProvider#_getAllTorrents} */
  it('should get no torrents to concatenate', done => {
    const stub = sinon.stub(baseProvider._api, 'search')
    stub.resolves([])

    baseProvider._getAllTorrents(1)
      .then(res => {
        expect(res).to.be.an('array')
        expect(res.length).to.equal(0)

        stub.restore()
        done()
      })
      .catch(done)
  })

  /**
   * Helper function to test the `_getTotalPages` method with different
   * providers.
   * @param {!Function} done - The done function from mocha.
   * @returns {undefined}
   */
  function executeTotalPages(done): void {
    baseProvider._getTotalPages()
      .then(res => {
        expect(res).to.be.a('number')
        done()
      })
      .catch(done)
  }

  /** @test {BaseProvider#_getTotalPages} */
  it('should return a the number of the total pages to scrape for nyaa', done => {
    baseProvider = new BaseProvider(nyaaConfig[0])
    executeTotalPages(done)
  })

  /** @test {BaseProvider#_getTotalPages} */
  it('should return a the number of the total pages to scrape for kat', done => {
    baseProvider = new BaseProvider(katConfig[0])
    executeTotalPages(done)
  })

  /** @test {BaseProvider#_getTotalPages} */
  it('should return a the number of the total pages to scrape for YTS', done => {
    baseProvider = new BaseProvider(ytsConfig[0])
    executeTotalPages(done)
  })

  /** @test {BaseProvider#search} */
  it('should not be able to get the total pages to scrape', done => {
    const stub = sinon.stub(baseProvider, '_getTotalPages')
    stub.resolves(null)

    baseProvider.search().then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {BaseProvider#search} */
  it('should throw and catch an error to continue', done => {
    const stub = sinon.stub(baseProvider, '_getTotalPages')
    stub.rejects()

    baseProvider.search()
      .then(done)
      .catch(err => {
        expect(err).to.be.undefined

        stub.restore()
        done()
      })
  })
})
