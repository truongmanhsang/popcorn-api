// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ShowProvider from '../../../src/scraper/providers/ShowProvider'
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
  before(() => {
    showProvider = new ShowProvider({
      api: 'extratorrent',
      name: 'ShowProvider',
      modelType: 'show',
      type: 'tvshow'
    })
  })

  /** @test {ShowProvider#constructor} */
  it('should check the attributes of the ShowProvider', () => {
    baseProviderTests.checkProviderAttributes(showProvider, 'ShowProvider')
    expect(showProvider._regexps).to.be.an('array')
    expect(showProvider._regexps.length).to.be.at.least(1)
  })

  /** @test {ShowProvider#_extractContent} */
  it.skip('should extract show information based on a regex', () => {
    expect(true).to.be.true
  })

  /** @test {ShowProvider#_attachTorrent} */
  it.skip('should create a new show object with a torrent attached', () => {
    expect(true).to.be.true
  })

  /** @test {ShowProvider#_getAllContent} */
  it.skip('should put all the found shows from the torrents in an array', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {BaseProvider#search} */
  it.skip('should return a list of all the intersted torrents', done => {
    expect(true).to.be.true
    done()
  })
})
