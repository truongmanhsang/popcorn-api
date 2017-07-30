// Import the necessary modules.
import cluster from 'cluster'
import del from 'del'
import domain from 'domain'
/**
 * Fast, unopinionated, minimalist web framework for node.
 * @external {Express} https://github.com/expressjs/express
 */
import Express from 'express'
import fs from 'fs'
import http from 'http'
import os from 'os'
import { CronJob } from 'cron'
import { join } from 'path'

import Logger from './config/Logger'
import Routes from './config/Routes'
import Scraper from './Scraper'
import Setup from './config/Setup'
import { name } from '../package.json'

/**
 * Class for starting the API.
 * @type {Index}
 * @flow
 */
export default class Index {

  /**
   * The express object.
   * @type {Express}
   */
  static _App = new Express()

  /**
   * The cron time for scraping audios. Default is `0 0 *\/6 * * *`.
   * @type {string}
   */
  static _CronTime: string = process.env.CRON_TIME || '0 0 */6 * * *'

  /**
   * The port on which the API will run on. Default is `5000`.
   * @type {number}
   */
  static _Port: number = process.env.PORT || 5000

  /**
   * The http server object.
   * @type {http.Server}
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   */
  static _Server = http.createServer(Index._App)

  /**
   * The timezone the conjob will hold. Default is `America/Los_Angeles`.
   * @type {string}
   */
  static _TimeZone: string = 'America/Los_Angeles'

  /**
   * The amount of workers on the cluster.
   * @type {number}
   */
  static _Workers: number = process.env.NODE_ENV === 'test' ? 0 : 2

  /**
   * Create an index class.
   * @param {?boolean} [start=true] - Start the scraping process.
   * @param {?boolean} [pretty=true] - Pretty output with Winston logging.
   * @param {?boolean} [quiet=false] - No output.
   * @param {?boolean} [debug=false] - Option to debug requests.
   * @returns {void}
   */
  static setupApi(
    start?: boolean = true,
    pretty?: boolean = true,
    quiet?: boolean = false,
    debug?: boolean = false
  ): void {
    // Setup the global logger object.
    Logger.getLogger('winston', pretty, quiet)

    // Setup the MongoDB configuration and ExpressJS configuration.
    Setup.setupDatabase(Index._App, pretty)

    // Setup the API routes.
    Routes.setupRoutes(Index._App)

    // Start the API.
    Index._startApi(start, debug)
  }

  /**
   * Create the temporary directory.
   * @returns {void}
   */
  static _createTemp(): void {
    del.sync([process.env.TEMP_DIR])
    if (!fs.existsSync(process.env.TEMP_DIR)) {
      fs.mkdirSync(process.env.TEMP_DIR)
    }

    fs.createWriteStream(Scraper.StatusPath).end()
    fs.createWriteStream(Scraper.UpdatedPath).end()
    fs.createWriteStream(join(process.env.TEMP_DIR, `${name}.log`)).end()
  }

  /**
   * Method to setup the cronjob.
   * @param {?boolean} [start] - Start the cronjob.
   * @param {?boolean} [debug] - Option to debug requests.
   * @return {void}
   */
  static _startApi(start?: boolean, debug?: boolean): void {
    if (cluster.isMaster) { // Check is the cluster is the master
      // Setup the temporary directory
      Index._createTemp()

      // Fork workers.
      for (let i = 0; i < Math.min(os.cpus().length, Index._Workers); i++) {
        cluster.fork()
      }

      // Check for errors with the workers.
      if (cluster.workers.length) {
        cluster.on('exit', worker => {
          logger.error(
            `Worker '${worker.process.pid}' died, spinning up another!`
          )
          cluster.fork()
        })
      }

      // XXX: Domain module is pending
      // deprication: https://nodejs.org/api/domain.html
      const scope = domain.create()
      scope.run(() => {
        logger.info(`API started on port: ${Index._Port}`)
        try {
          const cron = new CronJob({
            cronTime: Index._CronTime,
            timeZone: Index._TimeZone,
            onComplete: () => {
              Scraper.Status = 'Idle'
            },
            onTick: () => Scraper.scrape(debug),
            start
          })
          cron.start()

          Scraper.Updated = 0
          Scraper.Status = 'Idle'
          if (start) {
            Scraper.scrape()
          }
        } catch (err) {
          logger.error(err)
        }
      })
      scope.on('error', err => logger.error(err))
    } else {
      Index._Server.listen(Index._Port)
    }

    if (process.env.NODE_ENV === 'test') {
      Index._Server.listen(Index._Port)
    }
  }

  /**
   * Method to stop the API from running.
   * @param {?Function} [done=undefined] - function to exit the API.
   * @returns {void}
   */
  static closeApi(done?: Function = undefined): void {
    Index._Server.close(() => {
      Setup.disconnectMongoDb()
      logger.info('Closed out remaining connections.')
      return done ? done() : process.exit()
    })
  }

}
