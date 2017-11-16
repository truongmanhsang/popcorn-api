// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
// @flow
import chaiHttp from 'chai-http'
import Express from 'express'
import fs from 'fs'
import mkdirp from 'mkdirp'
import { join } from 'path'

import ExportController from '../../src/controllers/ExportController'

/** @test {ExportController} */
describe('ExportController', () => {
  /**
   * The express instance to test with.
   * @type {Express}
   */
  let app: $Application

  /**
   * The export controller to test.
   * @type {ExportController}
   */
  let exportController: ExportController

  /**
   * Hook for setting up the ExportController tests.
   * @type {Function}
   */
  before(() => {
    chai.use(chaiHttp)
    app = Express()

    exportController = new ExportController()
    exportController.registerRoutes(app)
  })

  /** @test {ExportController} */
  describe('will work as expected', () => {
    /**
     * The file to be downloaded.
     * @type {string}
     */
    let file: string

    /**
     * The temporary directory to hold the logs.
     * @type {string}
     */
    let tempDir

    /**
     * Hook for setting up the ExportController tests.
     * @type {Function}
     */
    before(() => {
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

      file = join(...[
        tempDir,
        'animes.json'
      ])
      fs.createWriteStream(file).end()
    })

    /**
     * Helper function to test the `/exports/:collection` route.
     * @param {!string} tempDir - The value for the temporary directory.
     * @returns {undefined}
     */
    function testExportCollection(tempDir: string): void {
      /** @test {ExportController#getExport} */
      it('should get a 200 status from the GET [/exports/:collection] route', done => {
        if (tempDir) {
          delete process.env.TEMP_DIR
        }

        chai.request(app).get('/exports/anime')
          .then(res => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res).to.not.redirect

            done()
          }).catch(done)
      })
    }

    // Execute the tests.
    [true, false].map(testExportCollection)

    /** @test {ExportController#getExport} */
    it('should get a 200 status from the GET [/exports/:collection] route', done => {
      chai.request(app).get('/exports/animes')
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
      chai.request(app).get('/exports/anime')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })

    /** @test {ExportController#getExport} */
    it('should get a 500 status form the GET [/exports/:collection] route', done => {
      chai.request(app).get('/exports/faulty')
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })
  })
})
