// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ModelFactory from '../../../src/scraper/resources/ModelFactory'

/**
 * @test {ModelFactory}
 * @flow
 */
describe('ModelFactory', () => {
  /**
   * The model factory object to test
   * @type {ModelFactory}
   */
  let modelFactory: ModelFactory

  /**
   * Hook for setting up the ModelFactory tests.
   * @type {Function}
   */
  before(() => {
    modelFactory = new ModelFactory()
  })

  /** @test {ModelFactory#getModel} */
  it('should get the AnimeMovie model', () => {
    const model = modelFactory.getModel('animemovie')
    expect(model).to.be.a('function')
  })

  /** @test {ModelFactory#getModel} */
  it('should get the AnimeShow model', () => {
    const model = modelFactory.getModel('animeshow')
    expect(model).to.be.a('function')
  })

  /** @test {ModelFactory#getModel} */
  it('should get the Movie model', () => {
    const model = modelFactory.getModel('movie')
    expect(model).to.be.a('function')
  })

  /** @test {ModelFactory#getModel} */
  it('should get the Show model', () => {
    const model = modelFactory.getModel('show')
    expect(model).to.be.a('function')
  })

  /** @test {ModelFactory#getModel} */
  it('should not get a model', () => {
    const model = modelFactory.getModel()
    expect(model).to.be.undefined
  })

  /** @test {ModelFactory#getModel} */
  it('should get the default model', () => {
    const model = modelFactory.getModel('faulty')
    expect(model).to.be.undefined
  })
})
