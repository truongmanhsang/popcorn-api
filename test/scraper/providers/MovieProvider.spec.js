// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'
import { Database } from 'pop-api'

import MovieProvider from '../../../src/scraper/providers/MovieProvider'
import movieMap from '../../../src/scraper/providers/maps/movieMap'
import { katMovieConfig } from '../../../src/scraper/configs/movieConfigs'
import { name } from '../../../package'

/** @test {MovieProvider} */
describe('MovieProvider', () => {
  /**
   * The movie provider to test.
   * @type {Movie}
   */
  let movieProvider: MovieProvider

  /**
   * The database middleware from 'pop-api'.
   * @type {Database}
   */
  let database: Database

  /**
   * Hook for setting up the MovieProvider tests.
   * @type {Function}
   */
  before(done => {
    movieProvider = new MovieProvider({}, {
      configs: [katMovieConfig]
    })
    movieProvider.setConfig(katMovieConfig)

    database = new Database({}, {
      database: name
    })
    database.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {MovieProvider#extractContent} */
  it('should extract movie information based on a regex', () => {
    movieMap.testpool = 'deadpool'
    const content = movieProvider.extractContent({
      torrent: {
        title: 'Testpool   2016 BluRay 1080p x264 AAC 5 1 - Hon3y'
      },
      regex: {
        regex: /(.*).(\d{4})\D+(\d{3,4}p)/i
      },
      lang: 'en'
    })

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

  /** @test {MovieProvider#attachTorrent} */
  it.skip('should create a new movie object with a torrent attached', () => {
    expect(true).to.be.true
  })

  /** @test {MovieProvider#getAllContent} */
  it('should get no content from an empty torrents array', done => {
    movieProvider.getAllContent({
      torrents: [null]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {MovieProvider#getAllContent} */
  it('should get no content from a filled torrents array', done => {
    movieProvider.getAllContent({
      torrents: [{
        title: 'faulty'
      }]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {MovieProvider#getAllContent} */
  it('should merge the torrent objects into one', done => {
    movieProvider.getAllContent({
      torrents: [{
        title: 'Deadpool 2016 BluRay 1080p x264 AAC 5 1 - Hon3y'
      }, {
        title: 'Deadpool 2016 BluRay 720p x264 AAC 5 1 - Hon3y'
      }]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(1)

      done()
    }).catch(done)
  })

  /** @test {MovieProvider#scrapeConfig} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(movieProvider, 'getTotalPages')
    stub.resolves(1)

    movieProvider.scrapeConfig(katMovieConfig).then(res => {
      expect(res).to.be.an('array')
      // expect(res.length).to.be.at.least(1)
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the MovieProvider tests.
   * @type {Function}
   */
  after(done => {
    database.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
