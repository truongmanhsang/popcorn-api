// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import Anime from '../../../src/models/AnimeShow'
import AnimeController from '../../../src/controllers/contentcontrollers/AnimeController'
import testBaseContentController from './basecontentcontroller.spec'
import testAnimeShow from '../../data/animeshow.json'

/**
 * @test {AnimeController}
 * @flow
 */
describe('AnimeController', () => {
  it('should test the anime controller', () => {
    testBaseContentController(
      AnimeController,
      Anime,
      new Anime(testAnimeShow),
      'anime'
    )
  })
})
