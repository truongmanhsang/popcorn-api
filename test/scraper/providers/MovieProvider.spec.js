// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import katConfig from '../../../src/scraper/configs/katmovies.json'
import MovieProvider from '../../../src/scraper/providers/MovieProvider'
import movieMap from '../../../src/scraper/providers/maps/moviemap.json'
import Setup from '../../../src/config/Setup'
import * as baseProviderTests from './BaseProvider.spec'

/**
 * @test {MovieProvider}
 * @flow
 */
describe('MovieProvider', () => {
  /**
   * The movie provider to test.
   * @type {Movie}
   */
  let movieProvider: MovieProvider

  /**
   * Hook for setting up the MovieProvider tests.
   * @type {Function}
   */
  before(done => {
    movieProvider = new MovieProvider(katConfig[0])

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {MovieProvider#constructor} */
  it('should check the attributes of the MovieProvider', () => {
    baseProviderTests.checkProviderAttributes(movieProvider, katConfig[0].name)
    expect(movieProvider._regexps).to.be.an('array')
    expect(movieProvider._regexps.length).to.be.at.least(1)
  })

  /** @test {MovieProvider#_extractCotent} */
  it('should extract movie information based on a regex', () => {
    movieMap.testpool = 'deadpool'
    const content = movieProvider._extractContent({
      title: 'Testpool   2016 BluRay 1080p x264 AAC 5 1 - Hon3y'
    }, {
      regex: /(.*).(\d{4})\D+(\d{3,4}p)/i
    }, 'en')

    expect(content).to.be.an('object')
    expect(content.movieTitle).to.be.a('string')
    expect(content.slug).to.be.a('string')
    expect(content.slugYear).to.be.a('string')
    expect(content.year).to.be.a('number')
    expect(content.quality).to.be.a('string')
    expect(content.language).to.be.a('string')
    expect(content.type).to.be.a('string')
    expect(content.torrents).to.be.an('object')
  })

  /** @test {MovieProvider#_attachTorrent} */
  it.skip('should create a new movie object with a torrent attached', () => {
    expect(true).to.be.true
  })

  /** @test {MovieProvider#_getAllContent} */
  it('should get no content from an empty torrents array', done => {
    movieProvider._getAllContent([null])
      .then(res => {
        expect(res).to.be.an('array')
        expect(res.length).to.equal(0)

        done()
      })
      .catch(done)
  })
  /** @test {MovieProvider#_getAllContent} */
  it('should get no content from a filled torrents array', done => {
    movieProvider._getAllContent([{
      title: 'faulty'
    }]).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {MovieProvider#_getAllContent} */
  it('should merge the torrent objects into one', done => {
    movieProvider._getAllContent([{
      title: 'Deadpool 2016 BluRay 1080p x264 AAC 5 1 - Hon3y'
    }, {
      title: 'Deadpool 2016 BluRay 720p x264 AAC 5 1 - Hon3y'
    }]).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(1)

      done()
    }).catch(done)
  })

  /** @test {MovieProvider#search} */
  it('should return a list of all the intersted torrents', done => {
    const stub = sinon.stub(movieProvider, '_getTotalPages')
    stub.resolves(1)

    movieProvider.search().then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the MovieProvider tests.
   * @type {Function}
   */
  after(done => {
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
