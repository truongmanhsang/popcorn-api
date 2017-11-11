// Import the necessary modules.
// @flow
import { PopApi } from 'pop-api'

import controllers from './controllers'
import {
  name,
  version
} from '../package'

PopApi.init({
  name,
  version,
  controllers
})
