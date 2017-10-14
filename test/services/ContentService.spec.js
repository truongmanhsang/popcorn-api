// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import ContentService from '../../src/services/ContentService'
import Setup from '../../src/config/Setup'
import Show from '../../src/models/Show'
import testShow from '../data/show.json'

/**
 * @test {ContentService}
 * @flow
 */
describe('ContentService', () => {
  /**
   * The content service to test.
   * @type {ContentService}
   */
  let contentService: ContentService

  /**
   * Hook for setting up the ContentService tests.
   * @type {Function}
   */
  before(done => {
    contentService = new ContentService(Show, 'show', {
      slug: 1
    }, {})

    Setup.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {ContentService#constructor} */
  it('should check the attributes of the ContentService', () => {
    expect(contentService.Model).to.a('function')
    expect(contentService.Model).to.equal(Show)
    expect(contentService.projection).to.an('object')
    expect(contentService.projection).to.deep.equal({
      slug: 1
    })
    expect(contentService._itemType).to.a('string')
    expect(contentService._itemType).to.equal('show')
  })

  /** @test {ContentService#getContents} */
  it('should get the available pages', done => {
    contentService.getContents().then(res => {
      expect(res).to.be.an('array')
      done()
    }).catch(done)
  })

  /** @test {ContentService#getPage} */
  it('should get a page of content items', done => {
    contentService.getPage({
      title: -1
    }, 1).then(res => {
      expect(res).to.be.an('array')
      done()
    }).catch(done)
  })

  /** @test {ContentService#getPage} */
  it('should get all the pages of content items', done => {
    contentService.getPage({
      title: -1
    }, 'all').then(res => {
      expect(res).to.be.an('array')
      done()
    }).catch(done)
  })

  /** @test {ContentService#getContent} */
  it('should get a single content item', done => {
    contentService.getContent(testShow.imdb_id).then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {ContentService#createMany} */
  it('should create multiple content items', done => {
    contentService.createMany([testShow]).then(res => {
      expect(res).to.be.an('array')
      done()
    }).catch(done)
  })

  /** @test {ContentService#createContent} */
  it('should create a single content item', done => {
    testShow.imdb_id = 'imdb_id'
    contentService.createContent(testShow).then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {ContentService#updateContent} */
  it('should update a single content item', done => {
    const { imdb_id } = testShow
    contentService.updateContent(imdb_id, testShow).then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {ContentService#updateMany} */
  it('should update multiple content items', done => {
    testShow.imdb_id = 'imdb_id2'
    contentService.updateMany([testShow]).then(res => {
      expect(res).to.be.an('array')
      done()
    }).catch(done)
  })

  /** @test {ContentService#getRandomContent} */
  it('should get a single random content item', done => {
    contentService.getRandomContent('slug').then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the ContentService tests.
   * @type {Function}
   */
  after(done => {
    Setup.disconnectMongoDb()
      .then(() => done())
      .catch(done)
  })
})
