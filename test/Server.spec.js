// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import cluster from 'cluster'
import del from 'del'
import Express from 'express'
import fs from 'fs'
import http from 'http'
import sinon from 'sinon'
import { expect } from 'chai'
import { join } from 'path'

import Server from '../src/Server'
import Scraper from '../src/Scraper'
import { name } from '../package.json'

/**
 * @test {Server}
 * @flow
 */
describe('Server', () => {
  /**
   * Hook for setting up the Server tests.
   * @type {Function}
   */
  before(() => {
    Server._Workers = 0
    del.sync([process.env.TEMP_DIR])
  })

  /**
   * Check the temporary directory for files.
   * @param {boolean} exists - Check if a file exists or not.
   * @param {number} length - Check the length of the files in the directory.
   * @returns {undefined}
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

  /** @test {Server._App} */
  it('should test if Server has a static _App attribute', () => {
    expect(Server._App).to.exist
  })

  /** @test {Server._CronTime} */
  it('should test if Server has a static _CronTime attribute', () => {
    expect(Server._CronTime).to.exist
    expect(Server._CronTime).to.be.a('string')
  })

  /** @test {Server._Port} */
  it('should test if Server has a static _Port attribute', () => {
    expect(Server._Port).to.exist
    expect(Server._Port).to.be.a('number')
  })

  /** @test {Server._Server} */
  it('should test if Server has a static _Server attribute', () => {
    expect(Server._Server).to.exist
    expect(Server._Server).to.be.an('object')
  })

  /** @test {Server._TimeZone} */
  it('should test if Server has a static _TimeZone attribute', () => {
    expect(Server._TimeZone).to.exist
    expect(Server._TimeZone).to.be.a('string')
  })

  /** @test {Server._Workers} */
  it('should test if Server has a static _Workers attribute', () => {
    expect(Server._Workers).to.exist
    expect(Server._Workers).to.be.a('number')
  })

  /** @test {Server._createTemp} */
  it('should create the temporary directory', () => {
    let exists = fs.existsSync(process.env.TEMP_DIR)
    expect(exists).to.be.false

    Server._createTemp()

    exists = fs.existsSync(process.env.TEMP_DIR)
    expect(exists).to.be.true
    checkTemp(true, 3)
  })

  /** @test {Server.setupApi} */
  it('should setup the API to run', () => {
    const express = new Express()
    Server.setupApi(false, false, true)
    expect(Server._App).to.not.equal(express)
  })

  /** @test {Server._onComplete} */
  it('should execute the onComplete method of the cron job', done => {
    Server._onComplete().then(res => {
      done()
    }).catch(done)
  })

  /** @test {Server._onTick} */
  it('should execute the onTick method of the cron job', done => {
    const stub = sinon.stub(Scraper, 'scrape')
    stub.resolves()

    Server._onTick().then(res => {
      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {Server._getCron} */
  it('should get the cron job', () => {
    const cron = Server._getCron()
    expect(cron).to.be.an('object')
  })

  /** @test {Server._ForkWorkers} */
  it('should fork the workers', () => {
    const stub = sinon.stub(cluster, 'fork')
    stub.returns(null)

    Server._Workers = 2
    Server._ForkWorkers()

    Server._Workers = 0
    stub.restore()
  })

  /** @test {Server._WorkersOnExit} */
  it('should handle the exit event of the workers', done => {
    const stub = sinon.stub(cluster, 'fork')
    stub.returns(null)

    Server._WorkersOnExit()

    cluster.emit('exit', {
      process: {
        pid: 1
      }
    })
    stub.restore()

    done()
  })

  /** @test {Server._startApi} */
  it('should start the API in master mode', () => {
    const stub = sinon.stub(Scraper, 'scrape')
    Server._startApi(true)

    stub.restore()
  })

  /**
   * @test {Server._startApi}
   * @todo implement this test
   */
  it('should throw an error when starting the API', () => {
    const stub = sinon.stub(Scraper, 'scrape')
    stub.throws()

    Server._startApi(true)

    stub.restore()
  })

  /** @test {Server._startApi} */
  it('should start the API in worker mode', () => {
    const httpStub = sinon.stub(http, 'createServer')
    const listen = {
      listen() {
        return null
      }
    }
    httpStub.returns(listen)

    const stubMaster = sinon.stub(cluster, 'isMaster')
    stubMaster.value(false)

    Server._startApi(true)

    httpStub.restore()
    stubMaster.restore()
  })

  /** @test {Server.closeApi} */
  it('should close the API', done => {
    Server.closeApi(done)
  })
})
