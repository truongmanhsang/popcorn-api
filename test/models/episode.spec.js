// Import the necessary modules.
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

  /** @test {Episode#constructor} */
  it('should check the attributes of an episode', () => {
    expect(episode.date_based).to.be.a('boolean')
    expect(episode.date_based).to.equal(false)
    expect(episode.episode).to.be.a('number')
    expect(episode.episode).to.equal(1)
    expect(episode.overview).to.be.a('string')
    expect(episode.overview).to.equal('string')
    expect(episode.season).to.be.a('number')
    expect(episode.season).to.equal(1)
    expect(episode.title).to.be.a('string')
    expect(episode.title).to.equal('string')
    expect(episode.torrents).to.be.an('object')
    expect(episode.torrents).to.deep.equal({})
    expect(episode.tvdb_id).to.be.a('number')
    expect(episode.tvdb_id).to.equal(1)
  })

  /** @test {Episode#constructor} */
  it('should check the attributes of an empty episode', () => {
    expect(episodeEmpty.date_based).to.be.undefined
    expect(episodeEmpty.episode).to.be.undefined
    expect(episodeEmpty.date_based).to.be.undefined
    expect(episodeEmpty.season).to.be.undefined
    expect(episodeEmpty.title).to.be.undefined
    expect(episodeEmpty.torrents).to.be.undefined
    expect(episodeEmpty.tvdb_id).to.be.undefined
  })
})
