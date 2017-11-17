// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import BaseProvider from '../../../src/scraper/providers/BaseProvider'
import { katMovieConfig } from '../../../src/scraper/configs/movieConfigs'
import { nyaaCommieConfig } from '../../../src/scraper/configs/showConfigs'
import { ytsConfig } from '../../../src/scraper/configs/ytsConfigs'

/** @test {BaseProvider} */
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
    baseProvider = new BaseProvider({}, {
      configs: [ytsConfig]
    })
  })

  /** @test {BaseProvider.Types} */
  it('should check if BaseProvider has a static ContentTypes attributes', () => {
    expect(BaseProvider.ContentTypes).to.exist
    expect(BaseProvider.ContentTypes).to.be.an('object')
  })

  /** @test {BaseProvider#setConfig} */
  it('should set the configuration to scrape', () => {
    baseProvider.setConfig(ytsConfig)

    expect(baseProvider.api).to.exist
    expect(baseProvider.api).to.be.an('object')
    expect(baseProvider.name).to.exist
    expect(baseProvider.name).to.be.a('string')
    expect(baseProvider.contentType).to.exist
    expect(baseProvider.contentType).to.be.a('string')
    expect(baseProvider.helper).to.exist
    expect(baseProvider.helper).to.be.an('object')
    // expect(baseProvider.query).to.exist
    // expect(baseProvider.query).to.be.an('object')
    // expect(baseProvider.regexps).to.exist
    // expect(baseProvider.regexps).to.be.an('array')
  })

  /** @test {BaseProvider#getConcent} */
  it('should return an error ', done => {
    baseProvider.contentType = 'faulty'
    baseProvider.getContent({})
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {BaseProvider#getContentData} */
  it('should not get info from a given torrent object', () => {
    baseProvider.regexps = [{
      regex: /\d+/g
    }]
    const contentData = baseProvider.getContentData({
      torrent: {
        title: 'faulty'
      }
    })

    expect(contentData).to.be.undefined
  })

  /** @test {BaseProvider#getAllTorrents} */
  it('should get no torrents to concatenate', done => {
    baseProvider.setConfig(ytsConfig)
    const stub = sinon.stub(baseProvider.api, 'search')
    stub.resolves([])

    baseProvider.getAllTorrents(1)
      .then(res => {
        expect(res).to.be.an('array')
        expect(res.length).to.equal(0)

        stub.restore()
        done()
      })
      .catch(done)
  })

  /**
   * Helper function to test the `getTotalPages` method with different
   * providers.
   * @param {!Object} config - The config to test with.
   * @returns {undefined}
   */
  function executeTotalPages(config: Object): void {
    it.skip('should return a the number of the total pages to scrape', done => {
      baseProvider = new BaseProvider({}, {
        configs: [config]
      })
      baseProvider.getTotalPages().then(res => {
        expect(res).to.be.a('number')
        done()
      }).catch(done)
    })
  }

  [
    nyaaCommieConfig,
    katMovieConfig,
    ytsConfig
  ].map(executeTotalPages)

  /** @test {BaseProvider#scrapeConfig} */
  it.skip('should not be able to get the total pages to scrape', done => {
    baseProvider.setConfig(ytsConfig)
    const stub = sinon.stub(baseProvider, 'getTotalPages')
    stub.resolves(null)

    baseProvider.scrapeConfig(ytsConfig).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {BaseProvider#scrapeConfig} */
  it.skip('should throw and catch an error to continue', done => {
    baseProvider.setConfig(ytsConfig)
    const stub = sinon.stub(baseProvider, 'getTotalPages')
    stub.rejects()

    baseProvider.scrapeConfig(ytsConfig)
      .then(done)
      .catch(err => {
        expect(err).to.be.undefined
        stub.restore()

        done()
      })
  })
})
