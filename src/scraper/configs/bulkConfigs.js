// Import the necessary modules.
// @flow
import {
  AnimeShow,
  Show
} from '../../models'
import { BulkProvider } from '../providers'
import {
  eztv,
  horribleSubs
} from '../apiModules'
import { ShowHelper } from '../helpers'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const eztvConfig: Object = {
  name: 'EZTV',
  api: eztv,
  contentType: BulkProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: Show
}

/**
 * The configuration for HorribleSubs.
 * @type {Object}
 */
export const horribleSubsConfig: Object = {
  name: 'HorribleSubs',
  api: horribleSubs,
  contentType: BulkProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: AnimeShow
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [
  eztvConfig,
  horribleSubsConfig
]
