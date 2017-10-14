// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'
import { join } from 'path'

import Server from '../../src/Server'

/**
 * @test {ExportController}
 * @flow
 */
describe('ExportController', () => {
  /**
   * Hook for setting up the ExportController tests.
   * @type {Function}
   */
  before(() => {
    Server._Workers = 0

    chai.use(chaiHttp)
    Server.setupApi(false, false, true)
  })

  /** @test {ExportController} */
  describe('will work as expected', () => {
    /**
     * The file to be downloaded.
     * @type {string}
     */
    let file: string

    /**
     * Hook for setting up the ExportController tests.
     * @type {Function}
     */
    before(() => {
      file = join(process.env.TEMP_DIR, 'animes.json')
      fs.createWriteStream(file).end()
    })

    /** @test {ExportController#getExport} */
    it('should get a 200 status from the GET [/exports/:collection] route', done => {
      chai.request(Server._App).get('/exports/anime')
        .then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
    })

    /** @test {ExportController#getExport} */
    it('should get a 200 status from the GET [/exports/:collection] route', done => {
      chai.request(Server._App).get('/exports/animes')
        .then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
    })

    /**
     * Hook for teaing down the ExportController tests.
     * @type {Function}
     */
    after(done => {
      fs.unlink(file, err => {
        if (err) {
          done(err)
        }

        done()
      })
    })
  })

  /** @test {ExportController} */
  describe('will throw errors', () => {
    /** @test {ExportController#getExport} */
    it('should get a 500 status from the GET [/exports/:collection] route', done => {
      chai.request(Server._App).get('/exports/anime')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })

    /** @test {ExportController#getExport} */
    it('should get a 500 status form the GET [/exports/:collection] route', done => {
      chai.request(Server._App).get('/exports/faulty')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })
  })

  /**
   * Hook for teaing down the ExportController tests.
   * @type {Function}
   */
  after(done => {
    Server.closeApi(done)
  })
})
