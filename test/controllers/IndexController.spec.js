// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
// @flow
import chaiHttp from 'chai-http'
import Express from 'express'
import fs from 'fs'
import mkdirp from 'mkdirp'
import sinon from 'sinon'
import {
  Database,
  PopApi
} from 'pop-api'
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
  let tempDir

  /**
   * Hook for setting up the IndexController tests.
   * @type {Function}
   */
  before(done => {
    chai.use(chaiHttp)
    app = Express()

    indexController = new IndexController()
    indexController.registerRoutes(app)

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
     * @param {!string} tempDir - The value for the temporary directory.
     * @returns {undefined}
     */
    function testLogsError(tempDir: string): void {
      /** @test {IndexController#getErrorLog} */
      it('should get a 200 status from the GET [/logs/error] route', done => {
        if (tempDir) {
          delete process.env.TEMP_DIR
        }

        chai.request(app).get('/logs/error')
          .then(res => {
            expect(res).to.have.status(200)
            expect(res).to.be.text
            expect(res).to.not.redirect

            done()
          }).catch(done)
      })
    }

    // Execute the tests.
    [true, false].map(testLogsError)

    /** @test {IndexController#getIndex} */
    it('should get a 200 status from the GET [/status] route', done => {
      chai.request(app).get('/status').then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res).to.not.redirect

        const { body } = res
        expect(body).to.exist
        expect(body.repo).to.exist
        expect(body.server).to.exist
        // expect(body.status).to.exist
        expect(body.totalAnimes).to.exist
        expect(body.totalMovies).to.exist
        expect(body.totalShows).to.exist
        // expect(body.updated).to.exist
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
      const filePath = join(process.env.TEMP_DIR, file)

      fs.unlinkSync(filePath)
    })
  })

  /** @test {IndexController} */
  describe('will throw errors', () => {
    /** @test {IndexController#getErrorLog} */
    it('should get a 500 status from the GET [/logs/error] route', done => {
      chai.request(app).get('/logs/error')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
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

      chai.request(app).get('/status')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          stub.restore()
          done()
        })
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
