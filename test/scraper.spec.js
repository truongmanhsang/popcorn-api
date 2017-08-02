// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import del from 'del'
import fs from 'fs'
import { expect } from 'chai'
import { join } from 'path'

import Scraper from '../src/Scraper'
import Setup from '../src/config/Setup'

/**
 * @test {Scraper}
 * @flow
 */
describe('Scraper', () => {
  /**
   * Hook for setting up the Scraper tests.
   * @type {Function}
   */
  before(() => {
    Setup.connectMongoDb()
    del.sync([process.env.TEMP_DIR])

    if (!fs.existsSync(process.env.TEMP_DIR)) {
      fs.mkdirSync(process.env.TEMP_DIR)
    }

    if (!fs.existsSync(Scraper.StatusPath)) {
      fs.createWriteStream(Scraper.StatusPath).end()
    }

    if (!fs.existsSync(Scraper.UpdatedPath)) {
      fs.createWriteStream(Scraper.UpdatedPath).end()
    }
  })

  /** @test {Scraper.StatusPath} */
  it('should test if Scraper has a StatusPath', () => {
    expect(Scraper.StatusPath).to.exist
    expect(Scraper.StatusPath).to.be.a('string')
  })

  /** @test {Scraper.UpdatedPath} */
  it('should test if Scraper has an UpdatedPath', () => {
    expect(Scraper.UpdatedPath).to.exist
    expect(Scraper.UpdatedPath).to.be.a('string')
  })

  /** @test {Scraper.Status} */
  it('should test if Scraper has a Status', done => {
    Scraper.Status.then(res => {
      expect(res).to.be.a('string')
      expect(res).to.equal('')

      Scraper.Status = 'Idle'
      return Scraper.Status
    }).then(res => {
      expect(res).to.equal('Idle')

      fs.unlinkSync(Scraper.StatusPath)
      return Scraper.Status
    }).catch(err => {
      expect(err.code).to.equal('ENOENT')
      done()
    })
  })

  /** @test {Scraper.Updated} */
  it('should test if Scraper has an Updated', done => {
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
  /* it('should test the scrape method', done => {
    Scraper.scrape().then(res => {
      expect(res).to.be.undefined

      done()
    }).catch(done)
  }) */

  /**
   * Hook for tearing down the SoundgasmDownloader tests.
   * @type {Function}
   */
  after(() => {
    Setup.disconnectMongoDb()
    del.sync([join(process.cwd(), 'audios')])
  })
})
