// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import BaseHelper from '../../../src/scraper/helpers/BaseHelper'
import Show from '../../../src/models/Show'

/**
 * Check the constructor of the base helper.
 * @param {!BaseHelper} helper - The helper to test.
 * @param {!string} name - The name to check for.
 * @param {!Model} Model - The model to check for.
 * @returns {undefined}
 */
export function checkHelperAttributes(
  helper: BaseHelper,
  name: string,
  Model: Model
): void {
  expect(helper._name).to.be.a('string')
  expect(helper._name).to.equal(name)
  expect(helper._model).to.be.a('function')
  expect(helper._model).to.equal(Model)
  expect(helper._defaultImages).to.exist
  expect(helper._defaultImages).to.be.an('object')
  expect(helper._apiFactory).to.exist
  expect(helper._apiFactory).to.be.an('object')
  expect(helper._fanart).to.exist
  expect(helper._fanart).to.be.an('object')
  expect(helper._tmdb).to.exist
  expect(helper._tmdb).to.be.an('object')
  expect(helper._trakt).to.exist
  expect(helper._trakt).to.be.an('object')
}

/**
 * Helper function to test the image attributes
 * @param {!Object} images - The images object to test. 
 * @param {!Function} done - The done function of mocha.
 * @returns {undefined}
 */
export function testImages(images: Object, done: Function): void {
  expect(images).to.be.an('object')
  expect(images.banner).to.be.a('string')
  expect(images.fanart).to.be.a('string')
  expect(images.poster).to.be.a('string')
  done()
}

/**
 * @test {BaseHelper}
 * @flow
 */
describe('BaseHelper', () => {
  /**
   * The base helper to test.
   * @type {BaseHelper}
   */
  let baseHelper: BaseHelper

  /**
   * Hook for setting up the BaseHelper tests.
   * @type {Function}
   */
  before(() => {
    baseHelper = new BaseHelper('BaseHelper', Show)
  })

  /** @test {BaseHelper#constructor} */
  it('should check the attributes of the BaseHelper', () => {
    checkHelperAttributes(baseHelper, 'BaseHelper', Show)
  })

  /** @test {BaseHelper._Holder} */
  it('should check the static attributes of the BaseHelper', () => {
    expect(BaseHelper._Holder).to.exist
    expect(BaseHelper._Holder).to.be.a('string')
  })

  /** @test {BaseHelper#_checkImages} */
  it('should check if all the images are found', () => {
    const input = {
      poster: 'poster'
    }
    const res = baseHelper._checkImages(input)

    expect(res).to.be.an('object')
    expect(res).to.be.equal(input)
  })

  /** @test {BaseHelper#_checkImages} */
  it('should throw an error when not all images are found', () => {
    const input = {
      poster: BaseHelper._Holder
    }
    expect(baseHelper._checkImages.bind(baseHelper._checkImages, input))
      .to.throw('An image could not been found!')
  })
})
