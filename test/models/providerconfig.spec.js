// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ProviderConfig from '../../src/models/ProviderConfig'

/**
 * @test {ProviderConfig}
 * @flow
 */
describe('ProviderConfig', () => {

  let providerConfig: ProviderConfig

  /**
   * Hook for setting up the ProviderConfig tests.
   * @type {Function}
   */
  before(() => {
    providerConfig = new ProviderConfig()
  })
  
  it('should test something', () => {
    expect(true).to.be.true
  })

  /**
   * Hook for teaing down the ProviderConfig tests.
   * @type {Function}
   */
  after(() => {})

})
