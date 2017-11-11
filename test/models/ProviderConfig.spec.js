// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import { ProviderConfig } from '../../src/models'

/** @test {ProviderConfig} */
describe('ProviderConfig', () => {
  /**
   * The provider configuration object to test.
   * @type {ProviderConfig}
   */
  let providerConfig: ProviderConfig

  /**
   * The provider configuration object initiated without a constructor object.
   * @type {ProviderConfig}
   */
  let providerConfigEmpty: ProviderConfig

  /**
   * Hook for setting up the ProviderConfig tests.
   * @type {Function}
   */
  before(() => {
    providerConfig = new ProviderConfig({
      api: 'string',
      clazz: 'string',
      modelType: 'string',
      name: 'string',
      query: {},
      type: 'string'
    })
    providerConfigEmpty = new ProviderConfig()
  })

  /** @test {ProviderConfig#constructor} */
  it('should check the attributes of a provider configuration', () => {
    expect(providerConfig.api).to.be.a('string')
    expect(providerConfig.api).to.equal('string')
    expect(providerConfig.clazz).to.be.a('string')
    expect(providerConfig.clazz).to.equal('string')
    expect(providerConfig.id).to.be.a('string')
    expect(providerConfig.id).to.equal('string')
    expect(providerConfig.modelType).to.be.a('string')
    expect(providerConfig.modelType).to.equal('string')
    expect(providerConfig.name).to.be.a('string')
    expect(providerConfig.name).to.equal('string')
    expect(providerConfig.query).to.be.an('object')
    expect(providerConfig.query).to.deep.equal({})
    expect(providerConfig.type).to.be.a('string')
    expect(providerConfig.type).to.equal('string')
    expect(providerConfig._id).to.be.a('string')
    expect(providerConfig._id).to.equal('string')
  })

  /** @test {ProviderConfig#constructor} */
  it('should check the attributes of an empty provider configuration', () => {
    expect(providerConfigEmpty.api).to.be.undefined
    expect(providerConfigEmpty.clazz).to.be.undefined
    expect(providerConfigEmpty.id).to.be.undefined
    expect(providerConfigEmpty.modelType).to.be.undefined
    expect(providerConfigEmpty.name).to.be.undefined
    expect(providerConfigEmpty.query).to.be.undefined
    expect(providerConfigEmpty.type).to.be.undefined
    expect(providerConfigEmpty._id).to.be.undefined
  })
})
