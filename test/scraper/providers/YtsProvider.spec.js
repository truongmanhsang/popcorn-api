// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import Setup from '../../../src/config/Setup'
import YtsProvider from '../../../src/scraper/providers/YtsProvider'
import ytsConfig from '../../../src/scraper/configs/ytsmovies.json'
import * as baseProviderTests from './BaseProvider.spec'

/**
 * @test {BulkProvider}
 * @flow
 */
describe('YtsProvider', () => {
  /**
   * The yts provider to test.
   * @type {YtsProvider}
   */
  let ytsProvider: YtsProvider

  /**
   * The torrent object to test with.
   * @type {Object}
   */
  let torrent: Object

  /**
   * Hook for setting up the YtsProvider tests.
   * @type {Function}
   */
  before(done => {
    ytsConfig[0].query.limit = 1
    ytsProvider = new YtsProvider(ytsConfig[0])
    torrent = {
      hash: 'hash',
      quality: '720p',
      size: '700 Mb',
      size_bytes: 123456789
    }

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {YtsProvider#constructor} */
  it('should check the attributes of the YtsProvider', () => {
    baseProviderTests.checkProviderAttributes(ytsProvider, ytsConfig[0].name)
  })

  /** @test {YtsProvider#_extractContent} */
  it('should extract movie information form a YTS object', () => {
    const movie = ytsProvider._extractContent({
      title: 'title',
      imdb_code: 'tt123456',
      year: 1234,
      torrents: [torrent]
    })
    expect(movie).to.be.an('object')
  })

  /** @test {YtsProvider#_getContentData} */
  it('should get movie data from a given torrent', () => {
    let data = ytsProvider._getContentData({
      torrents: [torrent],
      imdb_code: 'tt123456',
      language: 'english'
    }, 'de')
    expect(data).to.be.an('object')

    data = ytsProvider._getContentData({
      torrents: [torrent],
      imdb_code: 'tt123456',
      language: 'faulty'
    })
    expect(data).to.be.undefined
  })

  /** @test {YtsProvider#search} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(ytsProvider, '_getTotalPages')
    stub.resolves(1)

    ytsProvider.search().then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

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
