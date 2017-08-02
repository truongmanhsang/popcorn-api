// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'
import { join } from 'path'

import Index from '../../src/Index'
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
    chai.use(chaiHttp)
    Index.setupApi(false, false, true)
  })

  /** @test {IndexController._Server} */
  it('should test if IndexController has a _Server', () => {
    expect(IndexController._Server).to.exist
    expect(IndexController._Server).to.be.a('string')
  })

  /** @test {IndexController} */
  describe('200 status code', () => {
    /** @test {IndexController#getErrorLog} */
    it('should test the GET [/logs/error] route with a 200 status', done => {
      chai.request(Index._App).get('/logs/error')
        .then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.text
          expect(res).to.not.redirect

          done()
        }).catch(done)
    })

    /** @test {IndexController#getIndex} */
    it('should test the GET [/status] route with a 200 status', done => {
      chai.request(Index._App).get('/status').then(res => {
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
  describe('500 status code', () => {
    /**
     * Temporary variable used to set the uptime function back.
     * @type {Function}
     */
    let temp: Function

    /**
     * Hook for setting up the IndexController tests.
     * @type {Function}
     */
    before(() => {
      temp = process.uptime
    })

    /** @test {IndexController#getErrorLog} */
    it('should test the GET [/logs/error] route with a 500 status', done => {
      chai.request(Index._App).get('/logs/error')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })

    /** @test {IndexController#getIndex} */
    it('should test the GET [/status] route with a 500 status', done => {
      process.uptime = new Error('Failing on purpose')

      chai.request(Index._App).get('/status')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })

    /**
     * Hook for tearing down the IndexController tests.
     * @type {Function}
     */
    after(() => {
      process.uptime = temp
    })
  })

  /**
   * Hook for tearing down the IndexController tests.
   * @type {Function}
   */
  after(done => {
    Index.closeApi(done)
  })
})
