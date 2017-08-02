// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import AnimeMovie from '../../src/models/AnimeMovie'
import testAnimeMovie from '../data/animemovie.json'
import * as movieTests from './movie.spec'

/**
 * @test {AnimeMovie}
 * @flow
 */
describe('AnimeMovie', () => {
  /**
   * The anime movie object to test.
   * @type {AnimeMovie}
   */
  let animeMovie: AnimeMovie

  /**
   * The anime movie obejct initiated without a constructor object.
   * @type {AnimeMovie}
   */
  let animeMovieEmpty: AnimeMovie

  /**
   * Hook for setting up the AnimeMovie tests.
   * @type {Function}
   */
  before(() => {
    animeMovie = new AnimeMovie(testAnimeMovie)
    animeMovieEmpty = new AnimeMovie()
  })

  /** @test {AnimeMovie#constructor} */
  it('should check the attributes of a anime movie', () => {
    movieTests.testMovieAttributes(animeMovie, testAnimeMovie)
  })

  /** @test {AnimeMovie#constructor} */
  it('should check the attributes of an empty anime movie', () => {
    movieTests.testEmptyMovieAttributes(animeMovieEmpty)
  })
})
