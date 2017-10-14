// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IContentController from '../../src/controllers/IContentController'

/**
 * @test {IContentController}
 * @flow
 */
describe('IContentController', () => {
  /**
   * The content controller interface to test.
   * @type {string}
   */
  let iContentController: IContentController

  /**
   * Hook for setting up the IContentController tests.
   * @type {Function}
   */
  before(() => {
    iContentController = new IContentController()
  })

  /** @test {IContentController#getContents} */
  it('should throw an error when calling the default getContents method', () => {
    expect(iContentController.getContents)
      .to.throw('Using default method: \'getContents\'')
  })

  /** @test {IContentController#sortItems} */
  it('should throw an error when calling the default sortItems method', () => {
    expect(iContentController.sortItems)
      .to.throw('Using default method: \'sortItems\'')
  })

  /** @test {IContentController#getPage} */
  it('should throw an error when calling the default getPage method', () => {
    expect(iContentController.getPage)
      .to.throw('Using default method: \'getPage\'')
  })

  /** @test {IContentController#getContent} */
  it('should throw an error when calling the default getContent method', () => {
    expect(iContentController.getContent)
      .to.throw('Using default method: \'getContent\'')
  })

  /** @test {IContentController#getRandomContent} */
  it('should throw an error when calling the default getRandomContent method', () => {
    expect(iContentController.getRandomContent)
      .to.throw('Using default method: \'getRandomContent\'')
  })
})
