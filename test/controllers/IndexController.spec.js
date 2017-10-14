// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'
import sinon from 'sinon'
import { join } from 'path'

import Server from '../../src/Server'
import Show from '../../src/models/Show'
import IndexController from '../../src/controllers/IndexController'
import { name } from '../../package.json'

/**
 * @test {IndexController}
 * @flow
 */
describe('IndexController', () => {
  /**
   * Hook for setting up the IndexController tests.
   * @type {Function}
   */
  before(() => {
    Server._Workers = 0

    chai.use(chaiHttp)
    Server.setupApi(false, false, true)
  })

  /** @test {IndexController#registerRoutes} */
  it('should not throw an error when calling the implemented registerRoutes methods', () => {
    const indexController = new IndexController()
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
    /** @test {IndexController#getErrorLog} */
    it('should get a 200 status from the GET [/logs/error] route', done => {
      chai.request(Server._App).get('/logs/error')
        .then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.text
          expect(res).to.not.redirect

          done()
        }).catch(done)
    })

    /** @test {IndexController#getIndex} */
    it('should get a 200 status from the GET [/status] route', done => {
      chai.request(Server._App).get('/status').then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res).to.not.redirect

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
      const filePath = join(process.env.TEMP_DIR, file)

      fs.unlinkSync(filePath)
    })
  })

  /** @test {IndexController} */
  describe('will throw errors', () => {
    /** @test {IndexController#getErrorLog} */
    it('should get a 500 status from the GET [/logs/error] route', done => {
      chai.request(Server._App).get('/logs/error')
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

      chai.request(Server._App).get('/status')
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
    Server.closeApi(done)
  })
})
