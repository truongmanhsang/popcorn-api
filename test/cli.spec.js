// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import CLI from '../src/CLI'
import Index from '../src/Index'

/**
 * @test {CLI}
 * @flow
 */
describe('CLI', () => {

  /**
   * The CLI object to test
   * @type {CLI}
   */
  let cli: CLI

  /**
   * Hook for setting up the CLI tests.
   * @type {Function}
   */
  before(() => {
    cli = new CLI(true)
  })

  /** @test {CLI#_program} */
  it('should test if CLI has a _program', () => {
    expect(cli._program).to.exist
    expect(cli._program).to.be.an('object')
  })

  /** @test {CLI#constructor} */
  it('should test the CLI contructor', () => {
    expect(cli._program).to.exist
  })

  /** @test {CLI._help} */
  it('should test the run _help method', () => {
    const val = CLI._help()
    expect(val).to.be.undefined
  })

  /** @test {CLI#run} */
  it('should test the run method with \'mode\'', done => {
    cli._program.mode = 'pretty'

    const val = cli.run()
    expect(val).to.be.undefined

    cli._program.mode = false
    Index.closeApi(done)
  })

  /** @test {CLI#run} */
  it('should test the run method with null', done => {
    const val = cli.run(done)
    expect(val).to.equal(done)
    done()
  })

  /** @test {CLI#_mode} */
  it('should test the _mode method with \'pretty\'', done => {
    const val = cli._mode('pretty')
    expect(val).to.be.undefined

    Index.closeApi(done)
  })

  /** @test {CLI#_mode} */
  it('should test the _mode method with \'quiet\'', done => {
    const val = cli._mode('quiet')
    expect(val).to.be.undefined

    Index.closeApi(done)
  })

  /** @test {CLI#_mode} */
  it('should test the _mode method with \'ugly\'', done => {
    const val = cli._mode('ugly')
    expect(val).to.be.undefined

    Index.closeApi(done)
  })

  /**
   * @test {CLI#_mode} */
  it('should test the _mode method with null', done => {
    const val = cli._mode(null)
    expect(val).to.be.undefined

    Index.closeApi(done)
  })

})
