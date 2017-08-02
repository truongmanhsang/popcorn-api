// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

import Index from '../../../src/Index'

/**
 * Test suite for fetching content from the database.
 * @param {BaseContentController} Controller - The controller to fetch the
 * content with.
 * @param {Content} model - The model object of the content to fetch.
 * @param {Content} testContent - The test content to test with.
 * @param {string} content - The type of content to fetch.
 * @return {undefined}
 */
export default function testBaseContentController(
  Controller: BaseContentController,
  model: Content,
  testContent: Content,
  content: string
): void {
  /**
   * @test {BaseContentController}
   * @flow
   */
  describe('BaseContentController', () => {
    /**
     * The content controller object to test.
     * @type {BaseContentController}
     */
    let controller: BaseContentController

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
      chai.use(chaiHttp)
      Index.setupApi(false, false, true)

      controller = new Controller(model)
    })

    /** @test {Controller.Query} */
    it('should check if Controller has a Query', () => {
      expect(Controller.Query).to.exist
      expect(Controller.Query).to.be.an('object')
    })

    /** @test {Controller._PageSize} */
    it('should check if Controller has a _PageSize', () => {
      expect(Controller._PageSize).to.exist
      expect(Controller._PageSize).to.be.a('number')
    })

    /** @test {Controller._projection} */
    it('should check if Controller has a _projection', () => {
      expect(controller._projection).to.exist
      expect(controller._projection).to.be.an('object')
    })

    /** @test {BaseContentController} */
    describe('204 status code', () => {
      /**
       * Hook for setting up the AudioController tests.
       * @type {Function}
       */
      before(done => {
        model.remove({}).exec()
          .then(() => done())
          .catch(done)
      })

      /** @test {BaseContentController#getContents} */
      it(`should test the GET [/${content}s] route with a 204 status`, done => {
        chai.request(Index._App).get(`/${content}s`).then(res => {
          expect(res).to.have.status(204)
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should test the GET [/${content}s/:page] route with a 204 status`, done => {
        chai.request(Index._App).get(`/${content}s/1`).then(res => {
          expect(res).to.have.status(204)
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getContent} */
      it(`should test the GET [/${content}/:id] route with a 204 status`, done => {
        chai.request(Index._App).get(`/${content}/${id}`).then(res => {
          expect(res).to.have.status(204)
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getRandomContent} */
      it(`should test the GET [/random/${content}] route with a 204 status`, done => {
        chai.request(Index._App).get(`/random/${content}`).then(res => {
          expect(res).to.have.status(204)
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })
    })

    /** @test {BaseContentController} */
    describe('200 status code', () => {
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
          genres: 'all',
          order: -1
        }

        model.findOneAndUpdate({
          _id: testContent.id
        }, testContent, {
          upsert: true,
          new: true
        }).exec()
          .then(() => done())
          .catch(done)
      })

      /** @test {BaseContentController#getContents} */
      it(`should test the GET [/${content}] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}s`).query({
          ...query,
          sort: 'name'
        }).then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should test the GET [/${content}s/:page] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'rating'
        }).then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          const random = Math.floor(Math.random() * res.body.length)
          id = res.body[random].imdb_id

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should test the GET [/${content}s/:page] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'released'
        }).then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should test the GET [/${content}s/:page] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'trending'
        }).then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getPage} */
      it(`should test the GET [/${content}s/:page] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}s/1`).query({
          ...query,
          sort: 'year'
        }).then(res => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res).to.not.redirect

          done()
        }).catch(done)
      })

      /** @test {BaseContentController#getContent} */
      it(`should test the GET [/${content}/{id}] route with a 200 status`, done => {
        chai.request(Index._App).get(`/${content}/${id}`)
          .then(res => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res).to.not.redirect

            done()
          }).catch(done)
      })

      /** @test {BaseContentController#getRandomContent} */
      it(`should test the GET [/random/${content}] route with a 200 status`, done => {
        chai.request(Index._App).get(`/random/${content}`)
          .then(res => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res).to.not.redirect

            done()
          }).catch(done)
      })
    })

    /**
     * Hook for tearing down the AudioController tests.
     * @type {Function}
     */
    after(done => {
      model.findOneAndRemove({
        _id: testContent.id
      }).exec()
        .then(() => Index.closeApi(done))
        .catch(done)
    })
  })
}
