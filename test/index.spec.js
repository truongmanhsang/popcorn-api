// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import del from 'del'
import fs from 'fs'
import { expect } from 'chai'
import { join } from 'path'

import Index from '../src/Index'
import Scraper from '../src/Scraper'
import { name } from '../package.json'

/**
 * @test {Index}
 * @flow
 */
describe('Index', () => {
  /**
   * Hook for setting up the Index tests.
   * @type {Function}
   */
  before(() => {
    del.sync([process.env.TEMP_DIR])
  })

  /**
   * Check the temporaty directory for files.
   * @param {boolean} exists - Check if a file exists or not.
   * @param {number} length - Check the length of the files in the directory.
   * @returns {void}
   */
  function checkTemp(exists: boolean, length: number): void {
    const temp = fs.existsSync(process.env.TEMP_DIR)
    expect(temp).to.equal(exists)

    if (temp) {
      const list = fs.readdirSync(process.env.TEMP_DIR)
      expect(list.length).to.equal(length)
    }

    const status = fs.existsSync(Scraper.StatusPath)
    expect(status).to.equal(exists)
    const updated = fs.existsSync(Scraper.UpdatedPath)
    expect(updated).to.equal(exists)
    const log = fs.existsSync(join(process.env.TEMP_DIR, `${name}.log`))
    expect(log).to.equal(exists)
  }

  /** @test {Index._App} */
  it('should test if Index has an _App', () => {
    expect(Index._App).to.exist
    // expect(Index._App).to.be.an('object')
  })

  /** @test {Index._CronTime} */
  it('should test if Index has a _CronTime', () => {
    expect(Index._CronTime).to.exist
    expect(Index._CronTime).to.be.a('string')
  })

  /** @test {Index._Port} */
  it('should test if Index has a _Port', () => {
    expect(Index._Port).to.exist
    expect(Index._Port).to.be.a('number')
  })

  /** @test {Index._Server} */
  it('should test if Index has a _Server', () => {
    expect(Index._Server).to.exist
    expect(Index._Server).to.be.an('object')
  })

  /** @test {Index._TimeZone} */
  it('should test if Index has a _TimeZone', () => {
    expect(Index._TimeZone).to.exist
    expect(Index._TimeZone).to.be.a('string')
  })

  /** @test {Index._Workers} */
  it('should test if Index has a _Workers', () => {
    expect(Index._Workers).to.exist
    expect(Index._Workers).to.be.a('number')
  })

  /** @test {Index._createTemp} */
  it('should test the _createTemp method', () => {
    const exists = fs.existsSync(process.env.TEMP_DIR)
    expect(exists).to.be.false

    Index._createTemp()

    checkTemp(true, 3)
  })

  /**
   * @test {Index.setupApi}
   * @todo test the setupApi method
   */
  it('should test the setupApi method', () => {
    expect(true).to.true
  })

  /**
   * @test {Index.closeApi}
   * @todo test the closeApi method
   */
  it('should test the closeApi method', () => {
    expect(true).to.be.true
  })

  /**
   * @test {Index._startApi}
   * @todo test the _startApi method
   */
  it('should test the _startApi method', () => {
    expect(true).to.be.true
  })
})
