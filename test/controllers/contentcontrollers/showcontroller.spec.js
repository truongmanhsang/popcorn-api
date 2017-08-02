// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import Show from '../../../src/models/Show'
import ShowController from '../../../src/controllers/contentcontrollers/ShowController'
import testBaseContentController from './basecontentcontroller.spec'
import testShow from '../../data/show.json'

/**
 * @test {ShowController}
 * @flow
 */
describe('ShowController', () => {
  it('should test the show controller', () => {
    testBaseContentController(
      ShowController,
      Show,
      new Show(testShow),
      'show'
    )
  })
})
