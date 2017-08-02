// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import Movie from '../../../src/models/Movie'
import MovieController from '../../../src/controllers/contentcontrollers/MovieController'
import testBaseContentController from './basecontentcontroller.spec'
import testMovie from '../../data/movie.json'

/**
 * @test {MovieController}
 * @flow
 */
describe('MovieController', () => {
  it('should test the movie controller', () => {
    testBaseContentController(
      MovieController,
      Movie,
      new Movie(testMovie),
      'movie'
    )
  })
})
