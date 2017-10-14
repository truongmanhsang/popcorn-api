// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Util from '../src/Util'

/**
 * @test {Util}
 * @flow
 */
describe('Util', () => {
  /** @test {Util.executeCommand} */
  it('should successfully execute a command', done => {
    Util.executeCommand('git rev-parse --short HEAD').then(res => {
      expect(res).to.be.a('string')
      done()
    }).catch(done)
  })

  /** @test {Util.executeCommand} */
  it('should fail to execute a command', done => {
    Util.executeCommand('gi rev-parse --short HEAD')
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {Util.exportCollection} */
  it('should export a collection', done => {
    Util.exportCollection('show').then(res => {
      expect(res).to.be.a('string')
      done()
    }).catch(done)
  })

  /** @test {Util.importCollection} */
  it('should import a collection', done => {
    Util.importCollection('show', './test/data/show.json').then(res => {
      expect(res).to.be.a('string')
      done()
    }).catch(done)
  })

  /** @test {Util.importCollection} */
  it('should not find the file to import', done => {
    Util.importCollection('show', '/data/show.json')
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })
})
