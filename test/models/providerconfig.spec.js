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

  /**
   * The provider configuration object to test.
   * @type {ProviderConfig}
   */
  let providerConfig: ProviderConfig

  /**
   * The provider configuration obejct initiated without a constructor object.
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

  /** @test {ProviderConfig#api} */
  it('should check if ProviderConfig has an api', () => {
    expect(providerConfig.api).to.be.a('string')
    expect(providerConfig.api).to.equal('string')
  })

  /** @test {ProviderConfig#clazz} */
  it('should check if ProviderConfig has a clazz', () => {
    expect(providerConfig.clazz).to.be.a('string')
    expect(providerConfig.clazz).to.equal('string')
  })

  /** @test {ProviderConfig#id} */
  it('should check if ProviderConfig has an id', () => {
    expect(providerConfig.id).to.be.a('string')
    expect(providerConfig.id).to.equal('string')
  })

  /** @test {ProviderConfig#modelType} */
  it('should check if ProviderConfig has a modelType', () => {
    expect(providerConfig.modelType).to.be.a('string')
    expect(providerConfig.modelType).to.equal('string')
  })

  /** @test {ProviderConfig#name} */
  it('should check if ProviderConfig has a name', () => {
    expect(providerConfig.name).to.be.a('string')
    expect(providerConfig.name).to.equal('string')
  })

  /** @test {ProviderConfig#query} */
  it('should check if ProviderConfig has a query', () => {
    expect(providerConfig.query).to.be.an('object')
    expect(providerConfig.query).to.deep.equal({})
  })

  /** @test {ProviderConfig#type} */
  it('should check if ProviderConfig has a type', () => {
    expect(providerConfig.type).to.be.a('string')
    expect(providerConfig.type).to.equal('string')
  })

  /** @test {ProviderConfig#_id} */
  it('should check if ProviderConfig has an _id', () => {
    expect(providerConfig._id).to.be.a('string')
    expect(providerConfig._id).to.equal('string')
  })

  /** @test {ProviderConfig#api} */
  it('should check if api is undefined', () => {
    expect(providerConfigEmpty.api).to.be.undefined
  })

  /** @test {ProviderConfig#clazz} */
  it('should check if clazz is undefined', () => {
    expect(providerConfigEmpty.clazz).to.be.undefined
  })

  /** @test {ProviderConfig#id} */
  it('should check if id is undefined', () => {
    expect(providerConfigEmpty.id).to.be.null
  })

  /** @test {ProviderConfig#modelType} */
  it('should check if modelType is undefined', () => {
    expect(providerConfigEmpty.modelType).to.be.undefined
  })

  /** @test {ProviderConfig#name} */
  it('should check if name is undefined', () => {
    expect(providerConfigEmpty.name).to.be.undefined
  })

  /** @test {ProviderConfig#query} */
  it('should check if query is undefined', () => {
    expect(providerConfigEmpty.query).to.be.undefined
  })

  /** @test {ProviderConfig#type} */
  it('should check if type is undefined', () => {
    expect(providerConfigEmpty.type).to.be.undefined
  })

  /** @test {ProviderConfig#_id} */
  it('should check if _id is undefined', () => {
    expect(providerConfigEmpty._id).to.be.undefined
  })

})
