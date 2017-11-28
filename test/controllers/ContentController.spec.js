// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
// @flow
import chaiHttp from 'chai-http'
import Express from 'express'
import sinon from 'sinon'
import {
  ContentService,
  Database
} from 'pop-api'
import type { MongooseModel } from 'mongoose'

import ContentController from '../../src/controllers/ContentController'
import testAnime from '../data/animeshow'
import testMovie from '../data/movie'
import testShow from '../data/show'
import {
  AnimeShow as Anime,
  Movie,
  Show
} from '../../src/models'
import { name } from '../../package'

/**
  * Test suite for fetching content from the database.
  * @param {!string} content - The content to test.
  * @param {!Model} Model - The model object of the content to fetch.
  * @param {!Object} testContent - The test content to test with.
  * @returns {undefined}
  */
function testContentController(
  content: string,
  Model: MongooseModel,
  testContent: Object
): void {
  /** @test {ContentController} */
  describe('ContentController', () => {
    /**
     * The express instance to test with.
     * @type {Express}
     */
    let app: $Application

    /**
      * The base content controller object to test.
      * @type {ContentController}
      */
    let contentController: ContentController

    /**
      * The id of the content to get.
      * @type {string}
      */
    let id: string

    /**
     * The database middleware from `pop-api`.
     * @type {Database}
     */
    let database: Database

    /**
      * Hook for setting up the Controller tests.
      * @type {Function}
      */
    before(done => {
      chai.use(chaiHttp)
      app = Express()

      contentController = new ContentController({
        service: new ContentService({
          Model,
          basePath: content,
          projection: {
            imdb_id: 1
          }
        })
      })
      contentController.registerRoutes(app)

      database = new Database({}, {
        database: name
      })
      database.connect()
        .then(() => done())
        .catch(done)
    })

    /** @test {ContentController#constructor} */
    it('should check the attributes of the ContentController', () => {
      expect(contentController._service).to.be.an('object')
    })

    /** @test {ContentController#registerRoutes} */
    it('should not throw an error when calling the implemented registerRoutes method', () => {
      expect(contentController.registerRoutes)
        .to.not.throw('Using default method: \'registerRoutes\'')
    })

    /** @test {ContentController} */
    describe('with an empty database', () => {
      /**
        * Hook for setting up the AudioController tests.
        * @type {Function}
        */
      before(done => {
        Model.remove({}).exec()
          .then(() => done())
          .catch(done)
      })

      /**
       * Expectations for a no content (204) result.
       * @param {!Object} res - The result to test.
       * @param {!Function} done - The done function of Mocha.
       * @returns {undefined}
       */
      function expectNoContent(res: Object, done: Function): void {
        expect(res).to.have.status(204)
        expect(res).to.not.redirect

        done()
      }

      /** @test {ContentController#getContents} */
      it(`should get a 204 status from the GET [/${content}s] route`, done => {
        chai.request(app).get(`/${content}s`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {ContentController#getPage} */
      it(`should get a 204 status from the GET [/${content}s/:page] route`, done => {
        chai.request(app).get(`/${content}s/1`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {ContentController#getContent} */
      it(`should get a 204 status from the GET [/${content}/:id] route`, done => {
        chai.request(app).get(`/${content}/${id}`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 204 status from the GET [/random/${content}] route`, done => {
        chai.request(app).get(`/random/${content}`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })
    })

    /** @test {ContentController} */
    describe('with a filled database', () => {
      /**
        * The query object passed along to the 'getAudios' tests.
        * @type {[type]}
        */
      let query: Object

      /**
        * Hook for setting up the AudioController tests.
        * @type {Function}
        */
      before(done => {
        query = {
          keywords: 'String',
          genre: 'all',
          order: -1
        }

        new Model(testContent).save()
          .then(() => done())
          .catch(done)
      })

      /**
       * Expectations for a ok result.
       * @param {!Object} res - The result to test.
       * @param {!Function} [done=() => {}] - The done function of Mocha.
       * @returns {undefined}
       */
      function expectOk(res, done = () => {}): void {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res).to.not.redirect

        done()
      }

      /** @test {ContentController#getContents} */
      it(`should get a 200 status from the GET [/${content}] route`, done => {
        chai.request(app).get(`/${content}s`)
          .then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {ContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(app).get(`/${content}s/1`).query({
          genre: 'sci-fi'
        }).then(res => {
          expectOk(res)

          const random = Math.floor(Math.random() * res.body.length)
          id = res.body[random].imdb_id

          done()
        }).catch(done)
      })

      /**
       * Helper function to test the `/contents/:page` route.
       * @param {!string} sort - The sorting method to use.
       * @returns {undefined}
       */
      function testGetPage(sort: string): void {
        /** @test {ContentController#getPage} */
        it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
          chai.request(app).get(`/${content}s/1`).query({
            ...query,
            genre: 'string',
            sort
          }).then(res => expectOk(res, done))
            .catch(done)
        })
      }

      // Execute the tests.
      [
        'faulty',
        'name',
        'rating',
        'released',
        'trending',
        'year'
      ].map(testGetPage)

      /** @test {ContentController#getContent} */
      it(`should get a 200 status from the GET [/${content}/:id] route`, done => {
        chai.request(app).get(`/${content}/${id}`)
          .then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 200 status from the GET [/random/${content}] route`, done => {
        chai.request(app).get(`/random/${content}`)
          .then(res => expectOk(res, done))
          .catch(done)
      })
    })

    /** @test {ContentController} */
    describe('will throw errors', () => {
      /**
        * Expectations for an internal server error result.
        * @param {!Object} err - The result to test.
        * @param {!Object} stub - The stub which made the internal server error.
        * @param {!Function} done - The done function of Mocha.
        * @returns {undefined}
        */
      function expectInternalError(err, stub, done): void {
        expect(err).to.have.status(500)
        expect(err).to.not.redirect

        stub.restore()
        done()
      }

      /** @test {ContentController#getContents} */
      it(`should get a 500 status from the GET [/${content}s] route`, done => {
        const stub = sinon.stub(Model, 'count')
        stub.rejects()

        chai.request(app).get(`/${content}s`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {ContentController#getPage} */
      it(`should get a 500 status from the GET [/${content}s/:page] route`, done => {
        const stub = sinon.stub(Model, 'aggregate')
        stub.rejects()

        chai.request(app).get(`/${content}s/1`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {ContentController#getContent} */
      it(`should get a 500 status from the GET [/${content}/:id] route`, done => {
        const stub = sinon.stub(Model, 'findOne')
        stub.rejects()

        chai.request(app).get(`/${content}/${id}`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 500 status from the GET [/random/${content}] route`, done => {
        const stub = sinon.stub(Model, 'aggregate')
        stub.rejects()

        chai.request(app).get(`/random/${content}`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })
    })

    /**
      * Hook for tearing down the AudioController tests.
      * @type {Function}
      */
    after(done => {
      Model.findOneAndRemove({
        _id: testContent.id
      }).exec()
        .then(() => database.disconnect())
        .then(() => done())
        .catch(done)
    })
  })
}

const itemTypes = [
  ['anime', Anime, testAnime],
  ['movie', Movie, testMovie],
  ['show', Show, testShow]
]
itemTypes.map(i => testContentController(...i))
