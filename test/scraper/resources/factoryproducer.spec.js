// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import FactoryProducer from '../../../src/scraper/resources/FactoryProducer'

/**
 * @test {FactoryProducer}
 * @flow
 */
describe('FactoryProducer', () => {

  /** @test {FactoryProducer.getFactory} */
  it('should get the api factory', () => {
    const factory = FactoryProducer.getFactory('api')
    expect(factory).to.be.an('object')
  })

  /** @test {FactoryProducer.getFactory} */
  it('should get the factory factory', () => {
    const factory = FactoryProducer.getFactory('helper')
    expect(factory).to.be.an('object')
  })

  /** @test {FactoryProducer.getFactory} */
  it('should get the model factory', () => {
    const factory = FactoryProducer.getFactory('model')
    expect(factory).to.be.an('object')
  })

  /** @test {FactoryProducer.getFactory} */
  it('should not get a factory', () => {
    const factory = FactoryProducer.getFactory()
    expect(factory).to.be.undefined
  })

  /** @test {FactoryProducer.getFactory} */
  it('should get the default factory', () => {
    const factory = FactoryProducer.getFactory('faulty')
    expect(factory).to.be.undefined
  })

})
