// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import promptSchemas from '../../src/middleware/promptschemas'

/** @test {promptSchemas} */
describe('promptschemas', () => {
  /** @test {promptSchemas} */
  it('should have all the prompt schemas', () => {
    expect(promptSchemas.imdb).to.be.an('object')
    expect(promptSchemas.torrent).to.be.an('object')
    expect(promptSchemas.movieQuality).to.be.an('object')
    expect(promptSchemas.showQuality).to.be.an('object')
    expect(promptSchemas.language).to.be.an('object')
    expect(promptSchemas.season).to.be.an('object')
    expect(promptSchemas.episode).to.be.an('object')
    expect(promptSchemas.confirm).to.be.an('object')
  })

  /** @test {promptSchemas} */
  it('should validate the input for the imdb schema', () => {
    let res = promptSchemas.imdb.validate('tt1234567')
    expect(res).to.be.true

    res = promptSchemas.imdb.validate('faulty')
    expect(res).to.be.a('string')
  })

  /** @test {promptSchemas} */
  it('should validate the input for the torrent schema', () => {
    let res = promptSchemas.torrent.validate('faulty')
    expect(res).to.be.true

    res = promptSchemas.torrent.validate()
    expect(res).to.be.a('string')

    res = promptSchemas.torrent.validate(123)
    expect(res).to.be.a('string')
  })

  /** @test {promptSchemas} */
  it('should validate the input for the language schema', () => {
    let res = promptSchemas.language.validate('en')
    expect(res).to.be.true

    res = promptSchemas.language.validate(123)
    expect(res).to.be.a('string')
  })

  /** @test {promptSchemas} */
  it('should validate the input for the season schema', () => {
    let res = promptSchemas.season.validate(123)
    expect(res).to.be.true

    res = promptSchemas.season.validate('faulty')
    expect(res).to.be.a('string')
  })

  /** @test {promptSchemas} */
  it('should validate the input for the episode schema', () => {
    let res = promptSchemas.episode.validate(123)
    expect(res).to.be.true

    res = promptSchemas.episode.validate('faulty')
    expect(res).to.be.a('string')
  })
})
