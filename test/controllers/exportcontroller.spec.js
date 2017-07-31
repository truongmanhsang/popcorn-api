// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

import Index from '../../src/Index'

/**
 * @test {ExportController}
 * @flow
 */
describe('ExportController', () => {

  /**
   * Hook for setting up the ExportController tests.
   * @type {Function}
   */
  before(() => {
    chai.use(chaiHttp)
    Index.setupApi(false, false, true)
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the ExportController tests.
   * @type {Function}
   */
  after(done => {
    Index.closeApi(done)
  })

})
