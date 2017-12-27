// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import express, { type $Application } from 'express'
import fs from 'fs'
import mkdirp from 'mkdirp'
import request from 'supertest'
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
    app = express()

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
    let tempDir: string

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
     * @param {!boolean} tempDir - Whenever the temporary directory needs to
     * exists.
     * @returns {undefined}
     */
    function testExportCollection(tempDir: boolean): void {
      /** @test {ExportController#getExport} */
      it('should get a 200 status from the GET [/exports/:collection] route', done => {
        if (tempDir) {
          delete process.env.TEMP_DIR
        }

        request(app).get('/exports/anime')
          .expect(200)
          .then(() => done())
          .catch(done)
      })
    }

    // Execute the tests.
    [true, false].map(testExportCollection)

    /** @test {ExportController#getExport} */
    it('should get a 200 status from the GET [/exports/:collection] route', done => {
      request(app).get('/exports/animes')
        .expect(200)
        .then(() => done())
        .catch(done)
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
      request(app).get('/exports/anime')
        .expect(500)
        .then(() => done())
        .catch(done)
    })

    /** @test {ExportController#getExport} */
    it('should get a 500 status form the GET [/exports/:collection] route', done => {
      request(app).get('/exports/faulty')
        .expect(500)
        .then(() => done())
        .catch(done)
    })
  })
})
