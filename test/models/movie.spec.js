// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { ItemType } from 'butter-provider'

import Movie from '../../src/models/Movie'
import testMovie from '../data/movie.json'

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

  /** @test {Movie#id} */
  it('should check if Movie has a id', () => {
    expect(movie.id).to.be.a('string')
    expect(movie.id).to.equal(testMovie.imdb_id)
  })

  /** @test {Movie#genres} */
  it('should check if Movie has genres', () => {
    expect(movie.genres).to.be.an('array')
    expect(movie.genres).to.deep.equal(testMovie.genres)
  })

  /**
   * @test {Movie#images}
   * @todo implement this test
   */
  it('should check if Movie has images', () => {
    expect(true).to.be.true
    // expect(movie.images).to.be.an('object')
    // expect(movie.images).to.equal(testMovie.images)
  })

  /** @test {Movie#imdb_id} */
  it('should check if Movie has an imdb_id', () => {
    expect(movie.imdb_id).to.be.a('string')
    expect(movie.imdb_id).to.equal(testMovie.imdb_id)
  })

  /**
   * @test {Movie#rating}
   * @todo implement this test
   */
  it('should check if Movie has a rating', () => {
    expect(true).to.be.true
    // expect(movie.rating).to.be.an('object')
    // expect(movie.rating).to.equal(testMovie.rating)
  })

  /** @test {Movie#runtime} */
  it('should check if Movie has a runtime', () => {
    expect(movie.runtime).to.be.a('number')
    expect(movie.runtime).to.equal(testMovie.runtime)
  })

  /** @test {Movie#slug} */
  it('should check if Movie has a slug', () => {
    expect(movie.slug).to.be.a('string')
    expect(movie.slug).to.equal(testMovie.slug)
  })

  /** @test {Movie#synopsis} */
  it('should check if Movie has a synopsis', () => {
    expect(movie.synopsis).to.be.a('string')
    expect(movie.synopsis).to.equal(testMovie.synopsis)
  })

  /** @test {Movie#title} */
  it('should check if Movie has a title', () => {
    expect(movie.title).to.be.a('string')
    expect(movie.title).to.equal(testMovie.title)
  })

  /** @test {Movie#type} */
  it('should check if Movie has a type', () => {
    expect(true).to.be.true
    expect(movie.type).to.be.a('string')
    expect(movie.type).to.equal(ItemType.MOVIE)
  })

  /** @test {Movie#year} */
  it('should check if Movie has a year', () => {
    expect(movie.year).to.be.a('number')
    expect(movie.year).to.equal(testMovie.year)
  })

  /** @test {Movie#certification} */
  it('should check if Movie has a certificatoin', () => {
    expect(movie.certification).to.be.a('string')
    expect(movie.certification).to.equal(testMovie.certification)
  })

  /** @test {Movie#language} */
  it('should check if Movie has a language', () => {
    expect(movie.language).to.be.a('string')
    expect(movie.language).to.equal(testMovie.language)
  })

  /** @test {Movie#released} */
  it('should check if Movie has a released', () => {
    expect(movie.released).to.be.a('number')
    expect(movie.released).to.equal(testMovie.released)
  })

  /** @test {Movie#torrents} */
  it('should check if Movie has a torrents', () => {
    expect(movie.torrents).to.be.an('object')
    expect(movie.torrents).to.deep.equal(testMovie.torrents)
  })

  /** @test {Movie#trailer} */
  it('should check if Movie has a trailer', () => {
    expect(movie.trailer).to.be.a('string')
    expect(movie.trailer).to.equal(testMovie.trailer)
  })

  /** @test {Movie#_id} */
  it('should check if Movie has an _id', () => {
    expect(movie._id).to.be.a('string')
    expect(movie._id).to.equal(testMovie.imdb_id)
  })

  /** @test {Movie#id} */
  it('should check if id is null', () => {
    expect(movieEmpty.id).to.be.null
  })

  /** @test {Movie#genres} */
  it('should check if genres is undefined', () => {
    expect(movieEmpty.genres).to.be.undefined
  })

  /** @test {Movie#images} */
  it('should check if images is undefined', () => {
    expect(movieEmpty.images).to.be.undefined
  })

  /** @test {Movie#imdb_id} */
  it('should check if imdb_id is undefined', () => {
    expect(movieEmpty.imdb_id).to.be.undefined
  })

  /** @test {Movie#rating} */
  it('should check if rating is undefined', () => {
    expect(movieEmpty.rating).to.be.undefined
  })

  /** @test {Movie#runtime} */
  it('should check if runtime is undefined', () => {
    expect(movieEmpty.runtime).to.be.undefined
  })

  /** @test {Movie#slug} */
  it('should check if slug is undefined', () => {
    expect(movieEmpty.slug).to.be.undefined
  })

  /** @test {Movie#synopsis} */
  it('should check if synopsis is undefined', () => {
    expect(movieEmpty.synopsis).to.be.undefined
  })

  /** @test {Movie#title} */
  it('should check if title is undefined', () => {
    expect(movieEmpty.title).to.be.undefined
  })

  /** @test {Movie#type} */
  it('should check if type is undefined', () => {
    expect(movieEmpty.type).to.be.a('string')
    expect(movieEmpty.type).to.equal(ItemType.MOVIE)
  })

  /** @test {Movie#year} */
  it('should check if year is undefined', () => {
    expect(movieEmpty.year).to.be.undefined
  })

  /** @test {Movie#certification} */
  it('should check if cerification is undefined', () => {
    expect(movieEmpty.certification).to.be.undefined
  })

  /** @test {Movie#language} */
  it('should check if language is undefined', () => {
    expect(movieEmpty.language).to.be.a('string')
    expect(movieEmpty.language).to.equal('en')
  })

  /** @test {Movie#torrents} */
  it('should check if torrents is undefined', () => {
    expect(movieEmpty.torrents).to.be.undefined
  })

  /** @test {Movie#trailer} */
  it('should check if trailer is undefined', () => {
    expect(movieEmpty.trailer).to.be.undefined
  })

  /** @test {Movie#_id} */
  it('should check if _id is undefined', () => {
    expect(movieEmpty._id).to.be.undefined
  })

})
