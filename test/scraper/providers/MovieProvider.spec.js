// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'
import {
  Database,
  PopApi
} from 'pop-api'
import { PopApiScraper } from 'pop-api-scraper'

import MovieProvider from '../../../src/scraper/providers/MovieProvider'
import movieMap from '../../../src/scraper/providers/maps/movieMap'
import { logger } from '..'
import { katMovieConfig } from '../../../src/scraper/configs/movieConfigs'
import { name } from '../../../package.json'

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
    if (!global.logger) {
      global.logger = logger
    }

    movieProvider = new MovieProvider(PopApiScraper, {
      configs: [katMovieConfig]
    })
    movieProvider.setConfig(katMovieConfig)

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
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

    if (content) {
      expect(content).to.be.an('object')
      expect(content.movieTitle).to.be.a('string')
      expect(content.slug).to.be.a('string')
      expect(content.slugYear).to.be.a('string')
      expect(content.year).to.be.a('number')
      expect(content.quality).to.be.a('string')
      expect(content.language).to.be.a('string')
      expect(content.type).to.be.a('string')
      expect(content.torrents).to.be.an('object')
    } else {
      expect(true).to.be.false
    }
  })

  /** @test {MovieProvider#attachTorrent} */
  it('should create a new movie object with a torrent attached', () => {
    let movie = {
      torrents: {}
    }

    movie = movieProvider.attachTorrent({
      movie,
      torrent: {},
      quality: '720p',
      lang: 'en'
    })
    expect(movie.torrents.en).to.exist
    expect(movie.torrents.en['720p']).to.exist
    movie = movieProvider.attachTorrent({
      movie,
      torrent: {},
      quality: '720p',
      lang: 'en'
    })
    expect(movie.torrents.en).to.exist
    expect(movie.torrents.en['720p']).to.exist
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
  it.skip('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(movieProvider, 'getTotalPages')
    stub.resolves(1)

    movieProvider.scrapeConfig(katMovieConfig).then(res => {
      if (res) {
        expect(res).to.be.an('array')
        expect(res.length).to.be.at.least(1)
      } else {
        expect(true).to.be.false
      }
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the MovieProvider tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
