// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'
import { Database } from 'pop-api'

import YtsProvider from '../../../src/scraper/providers/YtsProvider'
import { ytsConfig } from '../../../src/scraper/configs/ytsConfigs'
import { name } from '../../../package'
// @flow

/** @test {YtsProvider} */
describe('YtsProvider', () => {
  /**
   * The yts provider to test.
   * @type {YtsProvider}
   */
  let ytsProvider: YtsProvider

  /**
   * The database middleware from 'pop-api'.
   * @type {Database}
   */
  let database: Database

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
    ytsProvider = new YtsProvider({}, {
      configs: [ytsConfig]
    })
    torrent = {
      hash: 'hash',
      quality: '720p',
      size: '700 Mb',
      size_bytes: 123456789
    }

    database = new Database({}, {
      database: name
    })
    database.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {YtsProvider#extractContent} */
  it('should extract movie information form a YTS object', () => {
    const movie = ytsProvider.extractContent({
      torrent: {
        title: 'title',
        imdb_code: 'tt123456',
        year: 1234,
        torrents: [torrent]
      }
    })
    expect(movie).to.be.an('object')
  })

  /** @test {YtsProvider#getContentData} */
  it('should get movie data from a given torrent', () => {
    let data = ytsProvider.getContentData({
      torrent: {
        torrents: [torrent],
        imdb_code: 'tt123456',
        language: 'english'
      },
      lang: 'de'
    })
    expect(data).to.be.an('object')

    data = ytsProvider.getContentData({
      torrent: {
        torrents: [torrent],
        imdb_code: 'tt123456',
        language: 'faulty'
      }
    })
    expect(data).to.be.undefined
  })

  /** @test {YtsProvider#scrapeConfig} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(ytsProvider, 'getTotalPages')
    stub.resolves(1)

    // const apiStub = sinon.stub(ytsProvider.api, 'search')
    // stub.resolves()

    ytsProvider.scrapeConfig(ytsConfig).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)
      stub.restore()
      // apiStub.restore()

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the YtsProvider tests.
   * @type {Function}
   */
  after(done => {
    database.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
