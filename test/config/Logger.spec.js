// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Logger from '../../src/config/Logger'

/**
 * @test {Logger}
 * @flow
 */
describe('Logger', () => {
  /**
   * Test the global logger object for functions.
   * @returns {undefined}
   */
  function testGlobalLogger(): void {
    Object.keys(Logger._Levels).map(level => {
      expect(logger[level]).to.be.a('function')
    })
  }

  /** @test {Logger._Levels} */
  it('should check if Logger has a static _Levels attribute', () => {
    expect(Logger._Levels).to.exist
    expect(Logger._Levels).to.be.an('object')
  })

  /** @test {Logger._checkEmptyMessage} */
  it('should check for an empty message with a full message', () => {
    const empty = {
      message: '',
      meta: {
        message: 'test'
      }
    }
    const emptyResult = Logger._checkEmptyMessage(empty)
    expect(emptyResult.message).to.exist
    expect(emptyResult.message).to.equal(JSON.stringify(empty.meta))
    expect(emptyResult.meta).to.exist
    expect(emptyResult.meta).to.deep.equal({
      message: 'test'
    })
  })

  /** @test {Logger._checkEmptyMessage} */
  it('should check for an empty message with an empty message', () => {
    const full = {
      message: 'test',
      meta: {}
    }
    const fullResult = Logger._checkEmptyMessage(full)
    expect(fullResult.message).to.exist
    expect(fullResult.message).to.equal('test')
    expect(fullResult.meta).to.exist
    expect(fullResult.meta).to.deep.equal({})
  })

  /** @test {Logger._getLevelColor} */
  it('should test if the correct logger colors are returned', () => {
    const error = Logger._getLevelColor('error')
    expect(error).to.equal('\x1b[31m')
    const warn = Logger._getLevelColor('warn')
    expect(warn).to.equal('\x1b[33m')
    const info = Logger._getLevelColor('info')
    expect(info).to.equal('\x1b[36m')
    const debug = Logger._getLevelColor('debug')
    expect(debug).to.equal('\x1b[34m')
    const nothing = Logger._getLevelColor(undefined)
    expect(nothing).to.equal('\x1b[36m')
  })

  /** @test {Logger._consoleFormatter} */
  it('should make an object into a string for the console formatter', () => {
    expect(Logger._consoleFormatter({
      level: 'info'
    })).to.be.a('string')
  })

  /** @test {Logger._fileFormatter} */
  it('should make an object into a string for the file formatter', () => {
    expect(Logger._fileFormatter({})).to.be.a('string')
  })

  /** @test {Logger._createWinston} */
  it('should create a configured winston instance', () => {
    const logger = Logger._createWinston()
    expect(logger).to.be.an('object')
  })

  /** @test {Logger._createExpressWinston} */
  it('should create a configured ExpressWinston instance', () => {
    const logger = Logger._createExpressWinston()
    expect(logger).to.be.a('function')
  })

  /** @test {Logger._createLogger} */
  it('should create the global logger object', () => {
    let val = Logger._createLogger(true, true)
    expect(val).to.be.undefined

    val = Logger._createLogger(false, true)
    expect(val).to.be.undefined
  })

  /** @test {Logger.getLogger} */
  it('should create instances of ExpressWinston and Winston', () => {
    expect(Logger.getLogger()).to.be.undefined
    expect(Logger.getLogger('FAULTY')).to.be.undefined

    expect(Logger.getLogger('EXPRESS')).to.be.a('function')

    Logger.getLogger('WINSTON')
    testGlobalLogger()

    Logger.getLogger('WINSTON', true)
    testGlobalLogger()

    Logger.getLogger('WINSTON', false)
    testGlobalLogger()

    Logger.getLogger('WINSTON', undefined, true)
    testGlobalLogger()
  })
})
