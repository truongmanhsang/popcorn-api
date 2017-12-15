// Import the necessary modules.
// @flow
import 'dotenv/config'
import { join } from 'path'
import {
  Database,
  HttpServer,
  Logger,
  Routes,
  PopApi
} from 'pop-api'
import {
  Cron,
  PopApiScraper
} from 'pop-api-scraper'

import controllers from './controllers'
import providers from './scraper'
import { Cli } from './middleware'
import {
  name,
  version
} from '../package.json'

// The default temporary directory for the API.
const defaultTempDir = join(...[
  __dirname,
  '..',
  'tmp'
])

/**
 * Setup the api.
 * @returns {PopApi} - The PopApi instance.
 */
;(async () => {
  try {
    process.env.TEMP_DIR = process.env.TEMP_DIR || defaultTempDir
    const logDir = process.env.TEMP_DIR

    await PopApi.init({
      controllers,
      name,
      logDir,
      version
    }, [
      Cli,
      Logger,
      Database,
      Routes,
      HttpServer
    ])

    providers.map(p => {
      const { Provider, args } = p
      PopApiScraper.use(Provider, args)
    })

    PopApi.use(PopApiScraper, {
      statusPath: join(...[logDir, 'status.json']),
      updatedPath: join(...[logDir, 'updated.json'])
    })

    PopApi.use(Cron, {
      start: PopApi.startScraper
    })

    return PopApi
  } catch (err) {
    throw err
  }
})()
