// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import BulkProvider from '../../../src/scraper/providers/BulkProvider'
import eztvConfig from '../../../src/scraper/configs/eztvshows.json'
import Setup from '../../../src/config/Setup'
import * as baseProviderTests from './BaseProvider.spec'

/**
 * @test {BulkProvider}
 * @flow
 */
describe('BulkProvider', () => {
  /**
   * The bulk provider to test.
   * @type {BulkProvider}
   */
  let bulkProvider: BulkProvider

  /**
   * Hook for setting up the BulkProvider tests.
   * @type {Function}
   */
  before(done => {
    bulkProvider = new BulkProvider(eztvConfig[0])

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {BulkProvider#constructor} */
  it('should check the attributes of the BulkProvider', () => {
    baseProviderTests.checkProviderAttributes(bulkProvider, eztvConfig[0].name)
  })

  /** @test {BulkProvider#search} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(bulkProvider._api, 'getAll')
    stub.resolves([{
      show: 'Westworld',
      id: 1913,
      slug: 'westworld'
    }])

    bulkProvider.search().then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {BulkProvider#search} */
  it('should throw and catch an error while scraping', done => {
    const stub = sinon.stub(bulkProvider._api, 'getAll')
    stub.rejects()

    bulkProvider.search().then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the YtsProvider tests.
   * @type {Function}
   */
  after(done => {
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
