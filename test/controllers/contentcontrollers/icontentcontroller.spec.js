// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IContentController from '../../../src/controllers/contentcontrollers/IContentController'

/**
 * @test {IContentController}
 * @flow
 */
describe('IContentController', () => {
  /**
   * The IContentController object to be tested.
   * @type {IContentController}
   */
  let iContentController: IContentController

  /**
   * Hook for setting up the IContentController tests.
   * @type {Function}
   */
  before(() => {
    iContentController = new IContentController()
  })

  /** @test {IContentController#getContent} */
  it('should throw an error when calling the getContent method', () => {
    expect(iContentController.getContent).to
      .throw('Using default method: \'getContent\'')
  })

  /** @test {IContentController#getContents} */
  it('should throw an error when calling the getContents method', () => {
    expect(iContentController.getContents).to
      .throw('Using default method: \'getContents\'')
  })

  /** @test {IContentController#getPage} */
  it('should throw an error when calling the getPage method', () => {
    expect(iContentController.getPage).to
      .throw('Using default method: \'getPage\'')
  })

  /** @test {IContentController#getRandomContent} */
  it('should throw an error when calling the getRandomContent method', () => {
    expect(iContentController.getRandomContent).to
      .throw('Using default method: \'getRandomContent\'')
  })
})
