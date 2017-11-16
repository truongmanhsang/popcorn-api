// Import the necessary modules.
// @flow
import {
  AnimeShow,
  Show
} from '../models'
import {
  BulkProvider
  // MovieProvider,
  // ShowProvider,
  // YtsProvider
} from './providers'
import {
  eztv,
  horribleSubs
} from './apiModules'
import { ShowHelper } from './helpers'

/**
 * Export the providers to be attached to the PopApiScraper.
 * @type {Array<Object>}
 */
export default [{
  Provider: BulkProvider,
  constructor: {
    maxWebRequests: 2,
    configs: [{
      name: 'EZTV',
      api: eztv,
      contentType: BulkProvider.ContentTypes.Show,
      Helper: ShowHelper,
      Model: Show
    }, {
      name: 'HorribleSubs',
      api: horribleSubs,
      contentType: BulkProvider.ContentTypes.Show,
      Helper: ShowHelper,
      Model: AnimeShow
    }]
  }
}]
