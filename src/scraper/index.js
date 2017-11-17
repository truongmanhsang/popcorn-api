// Import the necessary modules.
// @flow
import {
  bulkConfigs,
  movieConfigs,
  showConfigs,
  ytsConfigs
} from './configs'
import {
  BulkProvider,
  MovieProvider,
  ShowProvider,
  YtsProvider
} from './providers'

/**
 * The max concurreny web requests at a time.
 * @type {number}
 */
const maxWebRequests: number = 2

/**
 * Export the providers to be attached to the PopApiScraper.
 * @type {Array<Object>}
 */
export default [{
  Provider: BulkProvider,
  constructor: {
    maxWebRequests,
    configs: bulkConfigs
  }
}, {
  Provider: MovieProvider,
  constructor: {
    maxWebRequests,
    configs: movieConfigs
  }
}, {
  Provider: ShowProvider,
  constructor: {
    maxWebRequests,
    configs: showConfigs
  }
}, {
  Provider: YtsProvider,
  constructor: {
    maxWebRequests,
    configs: ytsConfigs
  }
}]
