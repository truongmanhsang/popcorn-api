// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import Express from 'express'
import mongoose from 'mongoose'
import { expect } from 'chai'

import Setup from '../../src/config/Setup'

/**
 * @test {Setup}
 * @flow
 */
describe('Setup', () => {

  /** @test {Setup._DbHosts} */
  it('should check if Setup has a _DbHosts', () => {
    expect(Setup._DbHosts).to.exist
    expect(Setup._DbHosts).to.be.an('array')
  })

  /** @test {Setup._DbName} */
  it('should check if Setup has a _DbName', () => {
    expect(Setup._DbName).to.exist
    expect(Setup._DbName).to.be.a('string')
  })

  /** @test {Setup._DbPassword} */
  it('should check if Setup has a _DbPassword', () => {
    expect(Setup._DbPassword).to.exist
    expect(Setup._DbPassword).to.be.an('string')
  })

  /** @test {Setup._DbPort} */
  it('should check if Setup has a _DbPort', () => {
    expect(Setup._DbPort).to.exist
    expect(Setup._DbPort).to.be.an('string')
  })

  /** @test {Setup._DbUsername} */
  it('should check if Setup has a _DbUsername', () => {
    expect(Setup._DbUsername).to.exist
    expect(Setup._DbUsername).to.be.an('string')
  })

  /** @test {Setup.connectMongoDb} */
  it('should connect to MongoDb', done => {
    expect(mongoose.connection.readyState).to.be.a('number')
    // expect(mongoose.connection.readyState).to.equal(0)

    Setup.connectMongoDb()
      .then(() => {
        expect(mongoose.connection.readyState).to.be.a('number')
        expect(mongoose.connection.readyState).to.equal(1)

        done()
      })
      .catch(done)
  })

  /** @test {Setup.disconnectMongoDb} */
  it('should disconnect from MongoDb', done => {
    expect(mongoose.connection.readyState).to.be.a('number')
    expect(mongoose.connection.readyState).to.equal(1)

    Setup.disconnectMongoDb()
      .then(() => {
        expect(mongoose.connection.readyState).to.be.a('number')
        expect(mongoose.connection.readyState).to.equal(0)

        done()
      })
      .catch(done)
  })

  /** @test {Setup.setupDatabase} */
  it('should setup MongoDb and express', () => {
    const express = new Express()
    Setup.setupDatabase(express, true)
    expect(express).to.not.equal(new Express())
  })

})
