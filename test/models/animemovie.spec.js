// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import AnimeMovie from '../../src/models/AnimeMovie'
import testAnimeMovie from '../data/animemovie.json'

/**
 * @test {AnimeMovie}
 * @flow
 */
describe('AnimeMovie', () => {

  let animeMovie: AnimeMovie

  /**
   * Hook for setting up the AnimeMovie tests.
   * @type {Function}
   */
  before(() => {
    animeMovie = new AnimeMovie(testAnimeMovie)
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the AnimeMovie tests.
   * @type {Function}
   */
  after(() => {})

})
