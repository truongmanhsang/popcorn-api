// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'

import AnimeShow from '../../src/models/AnimeShow'
import BaseContentController from '../../src/controllers/BaseContentController'
import ContentService from '../../src/services/ContentService'
import Movie from '../../src/models/Movie'
import Server from '../../src/Server'
import Show from '../../src/models/Show'
import testAnime from '../data/animeshow.json'
import testMovie from '../data/movie.json'
import testShow from '../data/show.json'

/**
  * Test suite for fetching content from the database.
  * @param {string} content - The type of content to fetch.
  * @param {Content} Model - The model object of the content to fetch.
  * @param {Content} testContent - The test content to test with.
  * @returns {undefined}
  */
function testBaseContentController(
  content: string,
  Model: Content,
  testContent: Content
): void {
  const type = content.charAt(0).toUpperCase() + content.slice(1)

  /**
    * @test {BaseContentController}
    * @flow
    */
  describe(`${type}Controller`, () => {
    /**
      * The base content controller object to test.
      * @type {BaseContentController}
      */
    let baseContentController: BaseContentController

    /**
      * The id of the content to get.
      * @type {string}
      */
    let id: string

    /**
      * Hook for setting up the Controller tests.
      * @type {Function}
      */
    before(() => {
      Server._Workers = 0

      chai.use(chaiHttp)
      Server.setupApi(false, false, true)

      baseContentController = new BaseContentController(
        new ContentService(Model, content, {}, {}),
        content
      )
    })

    /** @test {BaseContentController#constructor} */
    it('should check the attributes of the BaseContentController', () => {
      expect(baseContentController._service).to.be.an('object')
      expect(baseContentController._itemType).to.be.a('string')
    })

    /** @test {BaseContentController#registerRoutes} */
    it('should not throw an error when calling the implemented registerRoutes method', () => {
      expect(baseContentController.registerRoutes)
        .to.not.throw('Using default method: \'registerRoutes\'')
    })

    /** @test {BaseContentController} */
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

      /** @test {BaseContentController#getContents} */
      it(`should get a 204 status from the GET [/${content}s] route`, done => {
        chai.request(Server._App).get(`/${content}s`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 204 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getContent} */
      it(`should get a 204 status from the GET [/${content}/:id] route`, done => {
        chai.request(Server._App).get(`/${content}/${id}`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getRandomContent} */
      it(`should get a 204 status from the GET [/random/${content}] route`, done => {
        chai.request(Server._App).get(`/random/${content}`)
          .then(res => expectNoContent(res, done))
          .catch(done)
      })
    })

    /** @test {BaseContentController} */
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

      /** @test {BaseContentController#getContents} */
      it(`should get a 200 status from the GET [/${content}] route`, done => {
        chai.request(Server._App).get(`/${content}s`)
          .then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`).query({
          // ...query,
          genre: 'sci-fi',
          sort: 'name'
        }).then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`).query({
          ...query,
          genre: 'string',
          sort: 'rating'
        }).then(res => {
          expectOk(res)

          const random = Math.floor(Math.random() * res.body.length)
          id = res.body[random].imdb_id

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'released'
        }).then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'trending'
        }).then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        chai.request(Server._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'year'
        }).then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getContent} */
      it(`should get a 200 status from the GET [/${content}/{id}] route`, done => {
        chai.request(Server._App).get(`/${content}/${id}`)
          .then(res => expectOk(res, done))
          .catch(done)
      })

      /** @test {BaseContentController#getRandomContent} */
      it(`should get a 200 status from the GET [/random/${content}] route`, done => {
        chai.request(Server._App).get(`/random/${content}`)
          .then(res => expectOk(res, done))
          .catch(done)
      })
    })

    /** @test {BaseContentController} */
    describe('will throw errors', () => {
      /**
       * Get a stub which rejects a promise.
       * @param {!Item} model - The model to create the stub for.
       * @param {!string} method - The name of the method to stub.
       * @returns {Object} - The method stub.
       */
      function getStub(model, method) {
        const exec = {
          exec() {
            return Promise.reject(sinon.stub().callsArg(0).throws())
          }
        }
        const stub = sinon.stub(Model, method)
        stub.returns(exec)

        return stub
      }

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

      /** @test {BaseContentController#getContents} */
      it(`should get a 500 status from the GET [/${content}s] route`, done => {
        const stub = getStub(Model, 'count')

        chai.request(Server._App).get(`/${content}s`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {BaseContentController#getPage} */
      it(`should get a 500 status from the GET [/${content}s/:page] route`, done => {
        const stub = getStub(Model, 'aggregate')

        chai.request(Server._App).get(`/${content}s/1`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {BaseContentController#getContent} */
      it(`should get a 500 status from the GET [/${content}/:id] route`, done => {
        const stub = getStub(Model, 'findOne')

        chai.request(Server._App).get(`/${content}/${id}`)
          .then(done)
          .catch(err => expectInternalError(err, stub, done))
      })

      /** @test {BaseContentController#getRandomContent} */
      it(`should get a 500 status from the GET [/random/${content}] route`, done => {
        const stub = getStub(Model, 'aggregate')

        chai.request(Server._App).get(`/random/${content}`)
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
        .then(() => Server.closeApi(done))
        .catch(done)
    })
  })
}

const itemTypes = [
  ['anime', AnimeShow, testAnime],
  ['movie', Movie, testMovie],
  ['show', Show, testShow]
]
itemTypes.map(i => testBaseContentController(...i))
