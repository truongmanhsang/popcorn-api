// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import type { MongooseModel } from 'mongoose'

import AbstractHelper from '../../../src/scraper/helpers/AbstractHelper'
import { Show } from '../../../src/models'

/**
 * Check the constructor of the base helper.
 * @param {!AbstractHelper} helper - The helper to test.
 * @param {!string} name - The name to check for.
 * @param {!Model} Model - The model to check for.
 * @returns {undefined}
 */
export function checkHelperAttributes(
  helper: AbstractHelper,
  name: string,
  Model: MongooseModel
): void {
  expect(helper.name).to.be.a('string')
  expect(helper.name).to.equal(name)
  expect(helper.Model).to.be.a('function')
  expect(helper.Model).to.equal(Model)
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
 * Test the failures of the `_getFanartImages`.
 * @param {!Object} resolves - The object the stub will resolve.
 * @param {!string} type - The type of images to get.
 * @param {!Fanart} fanart - The fanart api service.
 * @param {!AbstractHelper} helper - The helper to test.
 * @param {!Function} done - The mocha done function.
 * @returns {undefined}
 */
export function testGetFanartImages(
  resolves: Object,
  type: string,
  fanart: Object,
  helper: Object,
  done: Function
): void {
  const cap = `${type.charAt(0).toUpperCase()}${type.slice(1)}`
  const stub = sinon.stub(fanart, `get${cap}Images`)
  stub.resolves(resolves)

  helper._getFanartImages()
    .then(done)
    .catch(err => {
      expect(err).to.be.an('Error')
      stub.restore()
      done()
    })
}

/** @test {AbstractHelper} */
describe('AbstractHelper', () => {
  /**
   * The abstract helper to test.
   * @type {AbstractHelper}
   */
  let abstractHelper: AbstractHelper

  /**
   * Hook for setting up the AbstractHelper tests.
   * @type {Function}
   */
  before(() => {
    abstractHelper = new AbstractHelper({
      name: 'AbstractHelper',
      Model: Show
    })
  })

  /** @test {AbstractHelper#constructor} */
  it('should check the attributes of the BaseHelper', () => {
    checkHelperAttributes(abstractHelper, 'AbstractHelper', Show)
  })

  /** @test {AbstractHelper.Holder} */
  it('should check if AbstractHelper has a static Holder attribute', () => {
    expect(AbstractHelper.Holder).to.exist
    expect(AbstractHelper.Holder).to.be.a('string')
  })

  /** @test {AbstractHelper.DefaultImages} */
  it('should check if AbstractHelper has a static DefaultImages attribute', () => {
    expect(AbstractHelper.DefaultImages).to.exist
    expect(AbstractHelper.DefaultImages).to.be.an('object')
  })

  /** @test {AbstractHelper#checkImages} */
  it('should check if all the images are found', () => {
    const input = {
      poster: 'poster'
    }
    const res = abstractHelper.checkImages(input)

    expect(res).to.be.an('object')
    expect(res).to.be.equal(input)
  })

  /** @test {AbstractHelper#checkImages} */
  it('should throw an error when not all images are found', () => {
    const input = {
      poster: AbstractHelper.Holder
    }
    expect(abstractHelper.checkImages.bind(abstractHelper.checkImages, input))
      .to.throw('An image could not been found!')
  })
})
