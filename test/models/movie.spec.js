// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { ItemType } from 'butter-provider'

import Movie from '../../src/models/Movie'
import testMovie from '../data/movie.json'
import * as contentTests from './content.spec'

/**
 * It should check the attributes of a movie
 * @flow
 * @param {Movie} movie - The movie to test.
 * @param {Object} testMovie - The movie to test against.
 * @returns {undefined}
 */
export function testMovieAttributes(movie: Movie, testMovie: Object): void {
  contentTests.testContentAttributes(movie, testMovie, ItemType.MOVIE)

  expect(movie.certification).to.be.a('string')
  expect(movie.certification).to.equal(testMovie.certification)
  expect(movie.language).to.be.a('string')
  expect(movie.language).to.equal(testMovie.language)
  expect(movie.released).to.be.a('number')
  expect(movie.released).to.equal(testMovie.released)
  expect(movie.torrents).to.be.an('object')
  expect(movie.torrents).to.deep.equal(testMovie.torrents)
  expect(movie.trailer).to.be.a('string')
  expect(movie.trailer).to.equal(testMovie.trailer)
}

/**
 * It should check the attributes of an empty movie.
 * @param {Movie} movieEmpty - The movie to test.
 * @returns {undefined}
 */
export function testEmptyMovieAttributes(movieEmpty: Movie): void {
  contentTests.testEmptyContentAttributes(movieEmpty, ItemType.MOVIE)

  expect(movieEmpty.certification).to.be.undefined
  expect(movieEmpty.language).to.be.a('string')
  expect(movieEmpty.language).to.equal('en')
  expect(movieEmpty.torrents).to.be.undefined
  expect(movieEmpty.trailer).to.be.undefined
}

/**
 * @test {Movie}
 * @flow
 */
describe('Movie', () => {
  /**
   * The movie object to test.
   * @type {Movie}
   */
  let movie: Movie

  /**
   * The movie obejct initiated without a constructor object.
   * @type {Movie}
   */
  let movieEmpty: Movie

  /**
   * Hook for setting up the Movie tests.
   * @type {Function}
   */
  before(() => {
    movie = new Movie(testMovie)
    movieEmpty = new Movie()
  })

  /** @test {Movie#constructor} */
  it('should check the attributes of a movie', () => {
    testMovieAttributes(movie, testMovie)
  })

  /** @test {Movie#constructor} */
  it('should check the attributes of an empty movie', () => {
    testEmptyMovieAttributes(movieEmpty)
  })
})
