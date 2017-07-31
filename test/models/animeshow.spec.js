// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import AnimeShow from '../../src/models/AnimeShow'
import testAnimeShow from '../data/animeshow.json'

/**
 * @test {AnimeShow}
 * @flow
 */
describe('AnimeShow', () => {

  let animeShow: AnimeShow

  /**
   * Hook for setting up the AnimeShow tests.
   * @type {Function}
   */
  before(() => {
    animeShow = new AnimeShow(testAnimeShow)
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the AnimeShow tests.
   * @type {Function}
   */
  after(() => {})

})
