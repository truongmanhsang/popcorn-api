// Import the necessary modules.
// @flow
import 'dotenv/config'
import { isMaster } from 'cluster'
import { join } from 'path'
import {
  Database,
  HttpServer,
  Logger,
  Routes,
  PopApi,
  utils
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
} from '../package'

// The default temporary directory for the API.
const defaultTempDir = join(...[
  __dirname,
  '..',
  'tmp'
])

/**
 * Attach the scraper to the PopApi instance.
 * @returns {Object} - The PopApi instance with a scraper attached.
 */
function initScraper(): Object {
  process.env.TEMP_DIR = process.env.TEMP_DIR || defaultTempDir
  const tempDir = process.env.TEMP_DIR

  PopApi.use(PopApiScraper, {
    statusPath: join(...[
      tempDir,
      'status.json'
    ]),
    updatedPath: join(...[
      tempDir,
      'updated.json'
    ])
  })

  // Register the provider to the PopApiScraper instance.
  providers.map(p => {
    const { Provider, constructor } = p
    PopApiScraper.use(Provider, constructor)
  })

  if (isMaster && PopApi.startScraper) {
    PopApi.scraper.scrape()
  }

  return PopApi
}

/**
 * Setup the api.
 * @returns {PopApi} - The PopApi instance.
 */
async function init({
  controllers,
  name,
  version,
  pretty,
  quiet,
  hosts = ['localhost'],
  dbPort = 27017,
  username,
  password,
  serverPort = process.env.PORT,
  workers = 2
}: Object): Object {

  const { app } = PopApi
  const logDir = process.env.TEMPDIR || defaultTempDir

  if (isMaster) {
    await utils.createTemp(logDir)
  }

  PopApi.use(Cli, {
    argv: process.argv,
    name,
    version
  })

  const loggerOpts = {
    name,
    logDir,
    pretty,
    quiet,
    ...PopApi.loggerArgs
  }
  PopApi.use(Logger, loggerOpts)
  PopApi.use(Database, {
    database: name,
    hosts,
    username,
    password,
    port: dbPort
  })
  PopApi.use(HttpServer, {
    app,
    workers,
    port: serverPort
  })
  PopApi.use(Routes, {
    app,
    controllers
  })
  PopApi.use(Cron)

  await PopApi.database.connect()

  initScraper()
  return PopApi
}

init({
  controllers,
  name,
  version
})
