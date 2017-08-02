// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ApiFactory from '../../../src/scraper/resources/ApiFactory'

/**
 * @test {ApiFactory}
 * @flow
 */
describe('ApiFactory', () => {
  /**
   * The API factory object to test
   * @type {ApiFactory}
   */
  let apiFactory: ApiFactory

  /**
   * Hook for setting up the ApiFactory tests.
   * @type {Function}
   */
  before(() => {
    apiFactory = new ApiFactory()
  })

  /** @test {ApiFactory#_extraTorrentApi} */
  it('should check if ApiFactory has an _extraTorrentApi', () => {
    expect(apiFactory._extraTorrentApi).to.be.an('object')
  })

  /** @test {ApiFactory#_eztvApi} */
  it('should check if ApiFactory has an _eztvApi', () => {
    expect(apiFactory._eztvApi).to.be.an('object')
  })

  /** @test {ApiFactory#_fanartApi} */
  it('should check if ApiFactory has an _fanartApi', () => {
    expect(apiFactory._fanartApi).to.be.an('object')
  })

  /** @test {ApiFactory#_horribleSubsApi} */
  it('should check if ApiFactory has an _horribleSubsApi', () => {
    expect(apiFactory._horribleSubsApi).to.be.an('object')
  })

  /** @test {ApiFactory#_katApi} */
  it('should check if ApiFactory has an _katApi', () => {
    expect(apiFactory._katApi).to.be.an('object')
  })

  /** @test {ApiFactory#_nyaaApi} */
  it('should check if ApiFactory has an _nyaaApi', () => {
    expect(apiFactory._nyaaApi).to.be.an('object')
  })

  /** @test {ApiFactory#_omdbApi} */
  it('should check if ApiFactory has an _omdbApi', () => {
    expect(apiFactory._omdbApi).to.be.an('object')
  })

  /** @test {ApiFactory#_tmdbApi} */
  it('should check if ApiFactory has an _tmdbApi', () => {
    expect(apiFactory._tmdbApi).to.be.an('object')
  })

  /** @test {ApiFactory#_traktApi} */
  it('should check if ApiFactory has an _traktApi', () => {
    expect(apiFactory._traktApi).to.be.an('object')
  })

  /** @test {ApiFactory#_tvdbApi} */
  it('should check if ApiFactory has an _tvdbApi', () => {
    expect(apiFactory._tvdbApi).to.be.an('object')
  })

  /** @test {ApiFactory#_ytsApi} */
  it('should check if ApiFactory has an _ytsApi', () => {
    expect(apiFactory._ytsApi).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the extratorrent api', () => {
    const api = apiFactory.getApi('extratorrent')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the eztv api', () => {
    const api = apiFactory.getApi('eztv')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the fanart api', () => {
    const api = apiFactory.getApi('fanart')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the horriblesubs api', () => {
    const api = apiFactory.getApi('horriblesubs')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the kat api', () => {
    const api = apiFactory.getApi('kat')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the nyaa api', () => {
    const api = apiFactory.getApi('nyaa')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the omdb api', () => {
    const api = apiFactory.getApi('omdb')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the tmdb api', () => {
    const api = apiFactory.getApi('tmdb')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the trakt api', () => {
    const api = apiFactory.getApi('trakt')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the tvdb api', () => {
    const api = apiFactory.getApi('tvdb')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should get the yts api', () => {
    const api = apiFactory.getApi('yts')
    expect(api).to.be.an('object')
  })

  /** @test {ApiFactory#getApi} */
  it('should not get an api', () => {
    const api = apiFactory.getApi()
    expect(api).to.be.undefined
  })

  /** @test {ApiFactory#getApi} */
  it('should get the default api', () => {
    const api = apiFactory.getApi('faulty')
    expect(api).to.be.undefined
  })

  /**
   * Hook for teaing down the ApiFactory tests.
   * @type {Function}
   */
  after(() => {})
})
