// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import MovieProvider from '../../../src/scraper/providers/MovieProvider'
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
  before(() => {
    movieProvider = new MovieProvider({
      api: 'extratorrent',
      name: 'MovieProvider',
      modelType: 'movie',
      type: 'movie'
    })
  })

  /** @test {MovieProvider#constructor} */
  it('should check the attributes of the MovieProvider', () => {
    baseProviderTests.checkProviderAttributes(movieProvider, 'MovieProvider')
    expect(movieProvider._regexps).to.be.an('array')
    expect(movieProvider._regexps.length).to.be.at.least(1)
  })

  /** @test {MovieProvider#_extractCotent} */
  it.skip('should extract movie information based on a regex', () => {
    expect(true).to.be.true
  })

  /** @test {MovieProvider#_attachTorrent} */
  it.skip('should create a new movie object with a torrent attached', () => {
    expect(true).to.be.true
  })

  /** @test {MovieProvider#_getAllContent} */
  it.skip('should put all the found movies from the torrents in an array', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#search} */
  it.skip('should return a list of all the intersted torrents', done => {
    expect(true).to.be.true
    done()
  })
})
