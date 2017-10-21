// Import the necessary modules.
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
   * The images object initiated without a constructor object.
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

  /** @test {Images#constructor} */
  it('should check the attributes of an images', () => {
    expect(images.banner).to.be.a('string')
    expect(images.banner).to.equal(image)
    expect(images.fanart).to.be.a('string')
    expect(images.fanart).to.equal(image)
    expect(images.poster).to.be.a('string')
    expect(images.poster).to.equal(image)
  })

  /** @test {Images#constructor} */
  it('should check the attributes of an empty images', () => {
    expect(imagesEmpty.banner).to.be.undefined
    expect(imagesEmpty.fanart).to.be.undefined
    expect(imagesEmpty.poster).to.be.undefined
  })
})
