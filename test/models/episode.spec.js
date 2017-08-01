// Import the necessary modules.
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'

import Episode from '../../src/models/Episode'

/**
 * @test {Episode}
 * @flow
 */
describe('Episode', () => {

  /**
   * The episode object to test.
   * @type {Episode}
   */
  let episode: Episode

  /**
   * The episode obejct initiated without a constructor object.
   * @type {Episode}
   */
  let episodeEmpty: Episode

  /**
   * Hook for setting up the Episode tests.
   * @type {Function}
   */
  before(() => {
    episode = new Episode({
      date_based: false,
      episode: 1,
      overview: 'string',
      season: 1,
      title: 'string',
      torrents: {},
      tvdb_id: 1
    })
    episodeEmpty = new Episode()
  })

  /** @test {Episode#date_based} */
  it('should check if Episode has a date_based', () => {
    expect(episode.date_based).to.be.a('boolean')
    expect(episode.date_based).to.equal(false)
  })

  /** @test {Episode#episode} */
  it('should check if Episode has a episode', () => {
    expect(episode.episode).to.be.a('number')
    expect(episode.episode).to.equal(1)
  })

  /** @test {Episode#overview} */
  it('should check if Episode has an overview', () => {
    expect(episode.overview).to.be.a('string')
    expect(episode.overview).to.equal('string')
  })

  /** @test {Episode#season} */
  it('should check if Episode has a season', () => {
    expect(episode.season).to.be.a('number')
    expect(episode.season).to.equal(1)
  })

  /** @test {Episode#title} */
  it('should check if Episode has a title', () => {
    expect(episode.title).to.be.a('string')
    expect(episode.title).to.equal('string')
  })

  /** @test {Episode#torrents} */
  it('should check if Episode has a torrent', () => {
    expect(episode.torrents).to.be.an('object')
    expect(episode.torrents).to.deep.equal({})
  })

  /** @test {Episode#tvdb_id} */
  it('should check if Episode has a tvdb_id', () => {
    expect(episode.tvdb_id).to.be.a('number')
    expect(episode.tvdb_id).to.equal(1)
  })

  /** @test {Episode#date_based} */
  it('should check if date_based is undefined', () => {
    expect(episodeEmpty.date_based).to.be.undefined
  })

  /** @test {Episode#episode} */
  it('should check if episode is undefined', () => {
    expect(episodeEmpty.episode).to.be.undefined
  })

  /** @test {Episode#overview} */
  it('should check if date_based is undefined', () => {
    expect(episodeEmpty.date_based).to.be.undefined
  })

  /** @test {Episode#season} */
  it('should check if season is undefined', () => {
    expect(episodeEmpty.season).to.be.undefined
  })

  /** @test {Episode#title} */
  it('should check if title is undefined', () => {
    expect(episodeEmpty.title).to.be.undefined
  })

  /** @test {Episode#torrents} */
  it('should check if torrent is undefined', () => {
    expect(episodeEmpty.torrents).to.be.undefined
  })

  /** @test {Episode#tvdb_id} */
  it('should check if tvdb_id is undefined', () => {
    expect(episodeEmpty.tvdb_id).to.be.undefined
  })

})
