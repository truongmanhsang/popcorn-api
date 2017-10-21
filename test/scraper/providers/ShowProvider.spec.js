// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import nyaaConfig from '../../../src/scraper/configs/nyaaanime.json'
import Setup from '../../../src/config/Setup'
import ShowProvider from '../../../src/scraper/providers/ShowProvider'
import showMap from '../../../src/scraper/providers/maps/showmap.json'
import * as baseProviderTests from './BaseProvider.spec'

/**
 * @test {ShowProvider}
 * @flow
 */
describe('ShowProvider', () => {
  /**
   * The show provider to test.
   * @type {ShowProvider}
   */
  let showProvider: ShowProvider

  /**
   * Hook for setting up the ShowProvider tests.
   * @type {Function}
   */
  before(done => {
    nyaaConfig[0].query.limit = 1
    showProvider = new ShowProvider(nyaaConfig[0])

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {ShowProvider#constructor} */
  it('should check the attributes of the ShowProvider', () => {
    baseProviderTests.checkProviderAttributes(showProvider, nyaaConfig[0].name)
    expect(showProvider._regexps).to.be.an('array')
    expect(showProvider._regexps.length).to.be.at.least(1)
  })

  /**
   * Test the attributes of an object returned by the `_extractContent method.
   * @param {!Object} content - The content object to test.
   * @param {!string} type - The type of the season and episode.
   * @returns {void}
   */
  function testContentAttributes(content: Object, type: string): void {
    expect(content).to.be.an('object')
    expect(content.showTitle).to.be.a('string')
    expect(content.slug).to.be.a('string')
    expect(content.season).to.be.a(type)
    expect(content.episode).to.be.a(type)
    expect(content.quality).to.be.a('string')
    expect(content.dateBased).to.be.a('boolean')
    expect(content.episodes).to.be.an('object')
    expect(content.type).to.be.a('string')
  }

  /** @test {ShowProvider#_extractContent} */
  it('should extract show information based on a seasonal regex', () => {
    showMap.testworld = 'westworld'
    const content = showProvider._extractContent({
      title: 'Testworld S01E06 720p HDTV x264-FLEET [eztv]',
      seeds: 1,
      peers: 1
    }, {
      regex: /(.*).[sS](\d{2})[eE](\d{2})/i,
      dateBased: false
    })

    testContentAttributes(content, 'string')
  })

  /** @test {ShowProvider#_extractContent} */
  it('should extract show information based on a datebased regex', () => {
    const content = showProvider._extractContent({
      title: 'Jimmy Fallon 2017 10 10 Mandy Moore 720p HDTV x264-CROOKS [eztv]',
      seeds: 1,
      peers: 1
    }, {
      regex: /(.*).(\d{4}).(\d{2}.\d{2})/i,
      dateBased: true
    })

    testContentAttributes(content, 'number')
  })

  /** @test {ShowProvider#_extractContent} */
  it('should not extract show information based on a regex', () => {
    const content = showProvider._extractContent({
      title: 'faulty'
    }, {
      regex: /(.*).[sS](\d{2})[eE](\d{2})/i
    })

    expect(content).to.be.undefined
  })

  /** @test {ShowProvider#attachTorrent} */
  it('should create a new show object with a torrent attached', () => {
    let show = showProvider.attachTorrent({
      showTitle: 'repack',
      episodes: {}
    }, {
      seeds: 2
    }, 1, 1, '480p')
    expect(show).to.be.an('object')

    show.showTitle = 'test'
    show = showProvider.attachTorrent(show, {
      seeds: 1
    }, 1, 1, '480p')
    expect(show).to.be.an('object')
  })

  /** @test {ShowProvider#_getAllContent} */
  it('should get no content from an empty torrents array', done => {
    showProvider._getAllContent([null]).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#_getAllContent} */
  it('should get no content from a filled torrents array', done => {
    showProvider._getAllContent([{
      title: 'faulty'
    }]).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#_getAllContent} */
  it('should merge the torrent objects into one', done => {
    showProvider._getAllContent([{
      title: 'Westworld S01E06 720p HDTV x264-FLEET [eztv]'
    }, {
      title: 'Westworld S01E07 720p HDTV x264-FLEET [eztv]'
    }]).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(1)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#search} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(showProvider, '_getTotalPages')
    stub.resolves(1)

    showProvider.search().then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the ShowProvider tests.
   * @type {Function}
   */
  after(done => {
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
