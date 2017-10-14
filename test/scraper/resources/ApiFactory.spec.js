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

  /** @test {ApiFactory#constructor} */
  it('should check the attributes of the ApiFactory', () => {
    expect(apiFactory._extraTorrentApi).to.be.an('object')
    expect(apiFactory._eztvApi).to.be.an('object')
    expect(apiFactory._fanartApi).to.be.an('object')
    expect(apiFactory._horribleSubsApi).to.be.an('object')
    expect(apiFactory._katApi).to.be.an('object')
    expect(apiFactory._nyaaApi).to.be.an('object')
    expect(apiFactory._omdbApi).to.be.an('object')
    expect(apiFactory._tmdbApi).to.be.an('object')
    expect(apiFactory._traktApi).to.be.an('object')
    expect(apiFactory._tvdbApi).to.be.an('object')
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
