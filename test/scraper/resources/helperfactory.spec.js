// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import HelperFactory from '../../../src/scraper/resources/HelperFactory'
import Provider from '../../../src/scraper/providers/BaseProvider'
import Movie from '../../../src/models/Movie'
import Show from '../../../src/models/Show'

/**
 * @test {HelperFactory}
 * @flow
 */
describe('HelperFactory', () => {
  /**
   * The helper factory object to test
   * @type {HelperFactory}
   */
  let helperFactory: HelperFactory

  /**
   * Hook for setting up the HelperFactory tests.
   * @type {Function}
   */
  before(() => {
    helperFactory = new HelperFactory()
  })

  /** @test {HelperFactory#getHelper} */
  it('should get the api factory', () => {
    const helper = helperFactory.getHelper('test', Movie, Provider.Types.Movie)
    expect(helper).to.be.an('object')
  })

  /** @test {HelperFactory#getHelper} */
  it('should get the helper factory', () => {
    const helper = helperFactory.getHelper('test', Show, Provider.Types.Show)
    expect(helper).to.be.an('object')
  })

  /** @test {HelperFactory#getHelper} */
  it('should not get a helper factory', () => {
    const helper = helperFactory.getHelper()
    expect(helper).to.be.undefined
  })

  /** @test {HelperFactory#getHelper} */
  it('should get the default helper factory', () => {
    const helper = helperFactory.getHelper('test', Movie, 'faulty')
    expect(helper).to.be.undefined
  })
})
