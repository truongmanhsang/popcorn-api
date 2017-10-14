// Import the necessary modules.
import cluster from 'cluster'
import del from 'del'
/**
 * Fast, unopinionated, minimalist web framework for node.
 * @external {Express} https://github.com/expressjs/express
 */
import Express from 'express'
import fs from 'fs'
/** @external {http~Server} https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server */
import http from 'http'
import os from 'os'
import {
  /**
   * Cron for NodeJS.
   * @external {CronJob} - https://github.com/kelektiv/node-cron
   */
  CronJob
} from 'cron'
import { join } from 'path'

import Logger from './config/Logger'
import Scraper from './Scraper'
import Setup from './config/Setup'
import { name } from '../package.json'

/**
 * Class for starting the API.
 * @type {Server}
 * @flow
 */
export default class Server {

  /**
   * The express object.
   * @type {Express}
   */
  static _App: Express = new Express()

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
   * @type {http~Server}
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   */
  static _Server: http.Server

  /**
   * The timezone the con job will hold. Default is `America/Los_Angeles`.
   * @type {string}
   */
  static _TimeZone: string = 'America/Los_Angeles'

  /**
   * The amount of workers on the cluster. Default is `2`.
   * @type {number}
   */
  static _Workers: number = 2

  /**
   * The http server object.
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   * @returns {http.Server} - The http.Server object.
   */
  static get _Server(): http.Server {
    return http.createServer(Server._App)
  }

  /**
   * Create an index class.
   * @param {?boolean} start - Start the scraping process.
   * @param {?boolean} pretty - Pretty output with Winston logging.
   * @param {?boolean} quiet - No output.
   * @returns {undefined}
   */
  static setupApi(
    start?: boolean,
    pretty?: boolean,
    quiet?: boolean
  ): void {
    // Setup the global logger object.
    Logger.getLogger('winston', pretty, quiet)

    // Setup the MongoDB configuration and ExpressJS configuration.
    Setup.setupDatabase(Server._App, pretty)

    // Start the API.
    Server._startApi(start)
  }

  /**
   * Create the temporary directory.
   * @returns {undefined}
   */
  static _createTemp(): void {
    del.sync([process.env.TEMP_DIR])
    fs.mkdirSync(process.env.TEMP_DIR)

    fs.createWriteStream(Scraper.StatusPath).end()
    fs.createWriteStream(Scraper.UpdatedPath).end()
    fs.createWriteStream(join(process.env.TEMP_DIR, `${name}.log`)).end()
  }

  /**
   * Function execute on complete by the cron job.
   * @returns {Promise<undefined, Error>} - The promise to set the scraper
   * status .
   */
  static async _onComplete() {
    Scraper.status = await 'Idle'
  }

  /**
   * Function executed on tick by the cron job.
   * @returns {undefined}
   */
  static _onTick() {
    return Scraper.scrape()
  }

  /**
   * Get the cron job to run.
   * @param {?boolean} [start] - Start the cron job.
   * @returns {CronJob} - A configured cron job.
   */
  static _getCron(start?: boolean): CronJob {
    return new CronJob({
      cronTime: Server._CronTime,
      timeZone: Server._TimeZone,
      onComplete: Server._onComplete,
      onTick: Server._onTick,
      start
    })
  }

  /**
   * For the workers.
   * @returns {undefined}
   */
  static _ForkWorkers() {
    for (let i = 0; i < Math.min(os.cpus().length, Server._Workers); i++) {
      cluster.fork()
    }
  }

  /**
   * Handle the errors for workers.
   * @returns {undefined}
   */
  static _WorkersOnExit() {
    cluster.on('exit', worker => {
      const msg = `Worker '${worker.process.pid}' died, spinning up another!`
      logger.error(msg)

      cluster.fork()
    })
  }

  /**
   * Method to setup the cron job.
   * @param {?boolean} [start] - Start the cron job.
   * @returns {undefined}
   */
  static _startApi(start?: boolean): void {
    if (cluster.isMaster) { // Check is the cluster is the master
      // Setup the temporary directory
      Server._createTemp()

      // Fork workers.
      Server._ForkWorkers()

      // Check for errors with the workers.
      Server._WorkersOnExit()

      logger.info(`API started on port: ${Server._Port}`)
      try {
        const cron = Server._getCron(start)
        cron.start()

        Scraper.Updated = 0
        Scraper.Status = 'Idle'

        if (start) {
          Scraper.scrape()
        }
      } catch (err) {
        logger.error(err)
      }
    } else {
      Server._Server.listen(Server._Port)
    }
  }

  /**
   * Method to stop the API from running.
   * @param {?Function} done - function to exit the API.
   * @returns {undefined}
   */
  static closeApi(done?: Function): void {
    Server._Server.close(() => {
      Setup.disconnectMongoDb().then(() => {
        logger.info('Closed out remaining connections.')

        done()
      })
    })
  }

}
