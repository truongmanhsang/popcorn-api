// Import the necessary modules.
// @flow
import {
  bulkConfigs
  // movieConfigs,
  // showConfigs,
  // ytsConfigs
} from './configs'
import {
  BulkProvider
  // MovieProvider,
  // ShowProvider,
  // YtsProvider
} from './providers'

/**
 * Export the providers to be attached to the PopApiScraper.
 * @type {Array<Object>}
 */
export default [{
  Provider: BulkProvider,
  constructor: {
    maxWebRequests: 2,
    configs: bulkConfigs
  }
}]
