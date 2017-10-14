// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import del from 'del'
import fs from 'fs'
import sinon from 'sinon'
import { expect } from 'chai'
import { join } from 'path'

import ProviderConfig from '../src/models/ProviderConfig'
import providerConfigs from '../src/scraper/configs'
import Scraper from '../src/Scraper'

/**
 * @test {Scraper}
 * @flow
 */
describe('Scraper', () => {
  /**
   * Create a file if it doesn't exists yet.
   * @param {!string} file - The file to create.
   * @returns {undefined}
   */
  function createFile(file: string): void {
    if (!fs.existsSync(file)) {
      fs.createWriteStream(file).end()
    }
  }

  /**
   * Hook for setting up the Scraper tests.
   * @type {Function}
   */
  before(() => {
    del.sync([process.env.TEMP_DIR])

    if (!fs.existsSync(process.env.TEMP_DIR)) {
      fs.mkdirSync(process.env.TEMP_DIR)
    }

    createFile(Scraper.StatusPath)
    createFile(Scraper.UpdatedPath)
  })

  /**
   * Check if a property exists and is a string.
   * @param {!string} property - The property to test.
   * @returns {undefined}
   */
  function checkProperty(property: string): void {
    expect(property).to.exist
    expect(property).to.be.a('string')
  }

  /**
   * Get a stub for `Config.find`.
   * @returns {Object} - The stub to call `Config.find().sort().exec().then`.
   */
  function getSortStub() {
    const sort = {
      exec() {
        return Promise.resolve([providerConfigs[0]])
      },
      sort() {
        return this
      }
    }
    const stub = sinon.stub(ProviderConfig, 'find')
    stub.returns(sort)

    return stub
  }

  /** @test {Scraper.StatusPath} */
  it('should check if the Scraper has a static StatusPath attribute', () => {
    checkProperty(Scraper.StatusPath)
  })

  /** @test {Scraper.UpdatedPath} */
  it('should check if the Scraper has an static UpdatedPath attribute', () => {
    checkProperty(Scraper.UpdatedPath)
  })

  /** @test {Scraper._Context} */
  it('should check if the Scraper has a static _Context attribute', () => {
    expect(Scraper._Context).to.exist
    expect(Scraper._Context).to.be.an('object')
  })

  /** @test {Scraper.Status} */
  it('should test if Scraper has a static Status', done => {
    Scraper.Status.then(res => {
      expect(res).to.be.a('string')
      expect(res).to.equal('')

      Scraper.Status = 'Idle'
      return Scraper.Status
    }).then(res => {
      expect(res).to.equal('Idle')

      fs.unlinkSync(Scraper.StatusPath)
      return Scraper.Status
    }).then(res => {

      fs.unlinkSync(Scraper.StatusPath)
      return Scraper.Status
    }).catch(err => {
      expect(err.code).to.equal('ENOENT')
      done()
    })
  })

  /** @test {Scraper.Updated} */
  it('should test if Scraper has an static Updated', done => {
    let now = Math.floor(new Date().getTime() / 1000)

    Scraper.Updated.then(res => {
      expect(res).to.be.a('number')
      expect(res).to.equal(0)

      now = Math.floor(new Date().getTime() / 1000)
      Scraper.Updated = now

      return Scraper.Updated
    }).then(res => {
      expect(res).to.equal(now)

      fs.unlinkSync(Scraper.UpdatedPath)
      return Scraper.Updated
    }).catch(err => {
      expect(err.code).to.equal('ENOENT')
      done()
    })
  })

  /** @test {Scraper.scrape} */
  it('should execute the scrape method', done => {
    const sortStub = getSortStub()
    const contextStub = sinon.stub(Scraper._Context, 'execute')
    contextStub.resolves([0])

    Scraper.scrape().then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

      sortStub.restore()
      contextStub.restore()

      done()
    }).catch(done)
  })

  /** @test {Scraper.scrape} */
  it('should throw an error when executing the scrape method', done => {
    const sortStub = getSortStub()
    const contextStub = sinon.stub(Scraper._Context, 'execute')
    contextStub.throws()

    Scraper.scrape().then(res => {
      expect(res).to.be.undefined

      sortStub.restore()
      contextStub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the Scraper tests.
   * @type {Function}
   */
  after(() => {
    del.sync([join(__dirname, '..', '..', 'audios')])
  })
})
