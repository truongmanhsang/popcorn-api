// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import testAnimeShow from '../data/animeshow'
import { AnimeShow } from '../../src/models'
import * as showTests from './Show.spec'

/** @test {AnimeShow} */
describe('AnimeShow', () => {
  /**
   * The anime show object to test.
   * @type {AnimeShow}
   */
  let animeShow: AnimeShow

  /**
   * The anime show object initiated without a constructor object.
   * @type {AnimeShow}
   */
  let animeShowEmpty: AnimeShow

  /**
   * Hook for setting up the AnimeShow tests.
   * @type {Function}
   */
  before(() => {
    // console.log(new AnimeShow())
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
