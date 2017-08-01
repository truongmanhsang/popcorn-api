// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Rating from '../../src/models/Rating'

/**
 * @test {Rating}
 * @flow
 */
describe('Rating', () => {

  /**
   * The rating object to test.
   * @type {Rating}
   */
  let rating: Rating

  /**
   * The rating obejct initiated without a constructor object.
   * @type {Rating}
   */
  let ratingEmpty: Rating
    
  /**
   * The value for the rating.
   * @type {string}
   */
  let value: number

  /**
   * Hook for setting up the Rating tests.
   * @type {Function}
   */
  before(() => {
    value = 0
    rating = new Rating({
      percentage: value,
      votes: value,
      watching: value
    })
    ratingEmpty = new Rating()
  })

  /** @test {Rating#percentage} */
  it('should check if Rating has a percentage', () => {
    expect(rating.percentage).to.be.a('number')
    expect(rating.percentage).to.equal(value)
  })

  /** @test {Rating#votes} */
  it('should check if Rating has a votes', () => {
    expect(rating.votes).to.be.a('number')
    expect(rating.votes).to.equal(value)
  })

  /** @test {Rating#watching} */
  it('should check if Rating has a watching', () => {
    expect(rating.watching).to.be.a('number')
    expect(rating.watching).to.equal(value)
  })

  /** @test {Rating#percentage} */
  it('should check if percentage is undefined', () => {
    expect(ratingEmpty.percentage).to.be.undefined
  })

  /** @test {Rating#votes} */
  it('should check if votes is undefined', () => {
    expect(ratingEmpty.votes).to.be.undefined
  })

  /** @test {Rating#watching} */
  it('should check if watching is undefined', () => {
    expect(ratingEmpty.watching).to.be.undefined
  })

})
