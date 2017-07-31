// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Movie from '../../src/models/Movie'
import testMovie from '../data/movie.json'

/**
 * @test {Movie}
 * @flow
 */
describe('Movie', () => {

  let movie: Movie

  /**
   * Hook for setting up the Movie tests.
   * @type {Function}
   */
  before(() => {
    movie = new Movie(testMovie)
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the Movie tests.
   * @type {Function}
   */
  after(() => {})

})
