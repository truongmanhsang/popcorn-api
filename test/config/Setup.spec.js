// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import Express from 'express'
import mongoose from 'mongoose'
import sinon from 'sinon'
import { expect } from 'chai'

import Setup from '../../src/config/Setup'

/**
 * @test {Setup}
 * @flow
 */
describe('Setup', () => {
  /**
   * The stub for `process.env`.
   * @type {Object}
   */
  let stub: Object

  /**
   * Hook for setting up the Setup tests.
   * @type {Function}
   */
  before(done => {
    const { MONGO_PORT_27017_TCP_ADDR, TEMP_DIR } = process.env
    stub = sinon.stub(process, 'env')
    stub.value({
      MONGO_PORT_27017_TCP_ADDR,
      TEMP_DIR
    })

    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /**
   * Test the changing connection state.
   * @param {!Function} method - Method to change to connection state.
   * @param {!number} before - The connection state it is before executing the
   * method to change it.
   * @param {!number} after - The connection state it is after executing the
   * method to change it.
   * @param {Function} done - The method executed when the test is done.
   * @returns {undefined}
   */
  function testConnection(
    method: Function,
    before: number,
    after: number,
    done: Function
  ): void {
    expect(mongoose.connection.readyState).to.be.a('number')
    expect(mongoose.connection.readyState).to.equal(before)

    method().then(() => {
      expect(mongoose.connection.readyState).to.be.a('number')
      expect(mongoose.connection.readyState).to.equal(after)

      done()
    }).catch(done)
  }

  /**
   * Check if a property exists and is of a certain type.
   * @param {!string} type - The type to test for.
   * @param {!string} property - The property to test.
   * @returns {undefined}
   */
  function checkProperty(type: string, property: string): void {
    expect(property).to.exist
    expect(property).to.be.a(type)
  }

  /** @test {Setup._DbName} */
  it('should check if the Setup has a static _DbName attribute', () => {
    checkProperty('string', Setup._DbName)
  })

  /** @test {Setup._DbHosts} */
  it('should check if the Setup has a static _DbHosts attribute', () => {
    const temp = process.env.MONGO_PORT_27017_TCP_ADDR
    process.env.MONGO_PORT_27017_TCP_ADDR = null

    checkProperty('array', Setup._DbHosts)

    process.env.MONGO_PORT_27017_TCP_ADDR = temp
  })

  /** @test {Setup._DbPort} */
  it('should check if the Setup has a static _DbPort attribute', () => {
    checkProperty('string', Setup._DbPort)
  })

  /** @test {Setup._DbUsername} */
  it('should check if the Setup has a static _DbUsername attribute', () => {
    checkProperty('string', Setup._DbUsername)
  })

  /** @test {Setup._DbPassword} */
  it('should check if the Setup has a static _DbPassword attribute', () => {
    checkProperty('string', Setup._DbPassword)
  })

  /** @test {Setup.registerControllers} */
  it('should register a controller', () => {
    const express = new Express()
    const registered = Setup.registerControllers(express)

    expect(registered).to.be.an('array')
    expect(registered.length).to.be.at.least(1)
  })

  /** @test {Setup.connectMongoDb} */
  it('should connect to MongoDB', done => {
    testConnection(Setup.connectMongoDb, 0, 1, done)
  })

  /** @test {Setup.disconnectMongoDb} */
  it('should disconnect from MongoDB', done => {
    testConnection(Setup.disconnectMongoDb, 1, 0, done)
  })

  /** @test {Setup.connectMongoDb} */
  it('should fail to authenticate with MongoDB', done => {
    expect(mongoose.connection.readyState).to.be.a('number')
    expect(mongoose.connection.readyState).to.equal(0)

    process.env.MONGO_USER = 'faulty'
    process.env.MONGO_PASS = 'faulty'
    Setup.connectMongoDb().then(res => {
      process.env.MONGO_USER = ''
      process.env.MONGO_PASS = ''

      done(res)
    }).catch(err => {
      expect(err).to.be.an('Error')

      process.env.MONGO_USER = ''
      process.env.MONGO_PASS = ''

      done()
    })
  })

  /** @test {Setup.setupDatabase} */
  it('should setup the database and ExpressJS', () => {
    const express = new Express()
    Setup.setupDatabase(express, true)
    expect(express).to.not.equal(new Express())
  })

  /**
   * Hook for tearing down the Setup tests.
   * @type {Function}
   */
  after(done => {
    stub.restore()
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
