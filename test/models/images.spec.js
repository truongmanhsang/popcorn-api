// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Images from '../../src/models/Images'

/**
 * @test {Images}
 * @flow
 */
describe('Images', () => {

  /**
   * The images object to test.
   * @type {Images}
   */
  let images: Images

  /**
   * The images obejct initiated without a constructor object.
   * @type {Images}
   */
  let imagesEmpty: Images
    
  /**
   * The value for the images.
   * @type {string}
   */
  let image: string

  /**
   * Hook for setting up the Images tests.
   * @type {Function}
   */
  before(() => {
    image = 'string'
    images = new Images({
      banner: image,
      fanart: image,
      poster: image
    })
    imagesEmpty = new Images()
  })

  /** @test {Images#banner} */
  it('should check if Images has a banner', () => {
    expect(images.banner).to.be.a('string')
    expect(images.banner).to.equal(image)
  })

  /** @test {Images#fanart} */
  it('should check if Images has a fanart', () => {
    expect(images.fanart).to.be.a('string')
    expect(images.fanart).to.equal(image)
  })

  /** @test {Images#poster} */
  it('should check if Images has a poster', () => {
    expect(images.poster).to.be.a('string')
    expect(images.poster).to.equal(image)
  })

  /** @test {Images#banner} */
  it('should check if banner is undefined', () => {
    expect(imagesEmpty.banner).to.be.undefined
  })

  /** @test {Images#fanart} */
  it('should check if fanart is undefined', () => {
    expect(imagesEmpty.fanart).to.be.undefined
  })

  /** @test {Images#poster} */
  it('should check if poster is undefined', () => {
    expect(imagesEmpty.poster).to.be.undefined
  })

})
