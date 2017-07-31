// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import IContentController from '../../../src/controllers/contentcontrollers/IContentController'

/**
 * @test {IContentController}
 * @flow
 */
describe('IContentController', () => {

  let iContentController: IContentController

  /**
   * Hook for setting up the IContentController tests.
   * @type {Function}
   */
  before(() => {
    iContentController = new IContentController()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the IContentController tests.
   * @type {Function}
   */
  after(() => {})

})
