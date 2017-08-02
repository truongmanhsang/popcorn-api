// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import AnimeShow from '../../src/models/AnimeShow'
import testAnimeShow from '../data/animeshow.json'
import * as showTests from './show.spec'

/**
 * @test {AnimeShow}
 * @flow
 */
describe('AnimeShow', () => {
  /**
   * The anime show object to test.
   * @type {AnimeShow}
   */
  let animeShow: AnimeShow

  /**
   * The anime show obejct initiated without a constructor object.
   * @type {AnimeShow}
   */
  let animeShowEmpty: AnimeShow

  /**
   * Hook for setting up the AnimeShow tests.
   * @type {Function}
   */
  before(() => {
    animeShow = new AnimeShow(testAnimeShow)
    animeShowEmpty = new AnimeShow()
  })

  /** @test {AnimeShow#constructor} */
  it('should check the attributes of a anime show', () => {
    showTests.testShowAttributes(animeShow, testAnimeShow)
  })

  /** @test {AnimeShow#constructor} */
  it('should check the attributes of an empty anime show', () => {
    showTests.testEmptyShowAttributes(animeShowEmpty)
  })
})
