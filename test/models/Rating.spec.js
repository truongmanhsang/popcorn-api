// Import the necessary modules.
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
   * The rating object initiated without a constructor object.
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

  /** @test {Rating#constructor} */
  it('should check the attributes of a rating', () => {
    expect(rating.percentage).to.be.a('number')
    expect(rating.percentage).to.equal(value)
    expect(rating.votes).to.be.a('number')
    expect(rating.votes).to.equal(value)
    expect(rating.watching).to.be.a('number')
    expect(rating.watching).to.equal(value)
  })

  /** @test {Rating#constructor} */
  it('should check the attributes of an empty rating', () => {
    expect(ratingEmpty.percentage).to.be.undefined
    expect(ratingEmpty.votes).to.be.undefined
    expect(ratingEmpty.watching).to.be.undefined
  })
})
