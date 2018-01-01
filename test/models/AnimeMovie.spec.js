// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import testAnimeMovie from '../data/animemovie'
import { AnimeMovie } from '../../src/models'
import * as movieTests from './Movie.spec'

/** @test {AnimeMovie} */
describe('AnimeMovie', () => {
  /**
   * The anime movie object to test.
   * @type {AnimeMovie}
   */
  let animeMovie: AnimeMovie

  /**
   * The anime movie object initiated without a constructor object.
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
