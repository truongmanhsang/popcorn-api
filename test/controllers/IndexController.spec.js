// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import express, { type $Application } from 'express'
import fs from 'fs'
import mkdirp from 'mkdirp'
import request from 'supertest'
import sinon from 'sinon'
import {
  Database,
  PopApi
} from 'pop-api'
import { PopApiScraper } from 'pop-api-scraper'
import { join } from 'path'

import IndexController from '../../src/controllers/IndexController'
import { name } from '../../package.json'
import { Show } from '../../src/models'

/** @test {IndexController} */
describe('IndexController', () => {
  /**
   * The express instance to test with.
   * @type {Express}
   */
  let app: $Application

  /**
   * The database middleware from `pop-api`.
   * @type {Database}
   */
  let database: Database

  /**
   * The index controller to test.
   * @type {IndexController}
   */
  let indexController: IndexController

  /**
   * The temporary directory to hold the logs.
   * @type {string}
   */
  let tempDir: string

  /**
   * Hook for setting up the IndexController tests.
   * @type {Function}
   */
  before(done => {
    app = express()

    process.env.TEMP_DIR = process.env.TEMP_DIR || join(...[
      __dirname,
      '..',
      '..',
      'tmp'
    ])
    tempDir = process.env.TEMP_DIR
    if (!fs.existsSync(tempDir)) {
      mkdirp.sync(tempDir)
    }

    fs.createWriteStream(join(...[
      tempDir,
      `${name}.log`
    ])).end()

    PopApi.use(PopApiScraper, {
      statusPath: join(...[tempDir, 'status.json']),
      updatedPath: join(...[tempDir, 'updated.json'])
    })

    indexController = new IndexController()
    indexController.registerRoutes(app)

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
      .then(() => done())
      .catch(done)
  })

  /** @test {IndexController#registerRoutes} */
  it('should not throw an error when calling the implemented registerRoutes methods', () => {
    expect(indexController.registerRoutes)
      .to.not.throw('Using default method: \'registerRoutes\'')
  })

  /** @test {IndexController._Server} */
  it('should test if IndexController has a _Server', () => {
    expect(IndexController._Server).to.exist
    expect(IndexController._Server).to.be.a('string')
  })

  /** @test {IndexController} */
  describe('will work as expected', () => {
    /**
     * Helper function to test the `/logs/error` route.
     * @param {!boolean} tempDir - Whenever the temporary directory needs to
     * exists.
     * @returns {undefined}
     */
    function testLogsError(tempDir: boolean): void {
      /** @test {IndexController#getErrorLog} */
      it('should get a 200 status from the GET [/logs/error] route', done => {
        if (tempDir) {
          delete process.env.TEMP_DIR
        }

        request(app).get('/logs/error')
          .expect(200)
          .then(() => done())
          .catch(done)
      })
    }

    // Execute the tests.
    [true, false].map(testLogsError)

    /** @test {IndexController#getIndex} */
    it('should get a 200 status from the GET [/status] route', done => {
      request(app).get('/status')
        .expect(200)
        .then(res => {
          const { body } = res
          expect(body).to.exist
          expect(body.repo).to.exist
          expect(body.server).to.exist
          expect(body.status).to.exist
          expect(body.totalAnimes).to.exist
          expect(body.totalMovies).to.exist
          expect(body.totalShows).to.exist
          expect(body.updated).to.exist
          expect(body.uptime).to.exist
          expect(body.version).to.exist
          expect(body.commit).to.exist

          done()
        }).catch(done)
    })

    /**
     * Hook for tearing down the IndexController tests.
     * @type {Function}
     */
    after(() => {
      const file = `${name}.log`
      const filePath = join(...[tempDir, file])

      fs.unlinkSync(filePath)
    })
  })

  /** @test {IndexController} */
  describe('will throw errors', () => {
    /** @test {IndexController#getErrorLog} */
    it('should get a 500 status from the GET [/logs/error] route', done => {
      request(app).get('/logs/error')
        .expect(500)
        .then(() => done())
        .catch(done)
    })

    /** @test {IndexController#getIndex} */
    it('should get a 500 status form the  GET [/status] route', done => {
      const exec: Object = {
        exec() {
          return Promise.reject(sinon.stub().callsArg(0).throws())
        }
      }
      const stub = sinon.stub(Show, 'count')
      stub.returns(exec)

      request(app).get('/status')
        .expect(500)
        .then(() => {
          stub.restore()
          done()
        })
        .catch(done)
    })
  })

  /**
   * Hook for tearing down the IndexController tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
