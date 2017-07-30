// Import the necessary modules.
import bodyParser from 'body-parser'
import compress from 'compression'
import mongoose from 'mongoose'
import responseTime from 'response-time'

import Logger from './Logger'

/**
 * Class for setting up ExpressJS and MongoDB.
 * @type {Setup}
 * @flow
 */
export default class Setup {

  /**
   * The name of the database. Default is `popcorn-development`.
   * @type {string}
   */
  static _DbName: string

  /**
   * The host of the server of the database. Default is `['localhost']`.
   * @type {Array<string>}
   */
  static _DbHosts: Array<string>

  /**
   * The port of the database. Default is `27017`.
   * @type {string}
   */
  static _DbPort: string

  /**
   * The username of the database. DBy default this is left empty.
   * @type {string}
   */
  static _DbUsername: string

  /**
   * The password of the database. By default this is left empty.
   * @type {string}
   */
  static _DbPassword: string

  /**
   * Get the database name of the API.
   * @return {string} - The database name of the API.
   */
  static get _DbName(): string {
    return `${process.env.MONGO_DATABASE || 'popcorn'}-${process.env.NODE_ENV || 'development'}`
  }

  /**
   * Get the database hosts of the API.
   * @return {Array<string>} - The database hosts of the API.
   */
  static get _DbHosts(): Array<string> {
    return [process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost']
  }

  /**
   * Get the port of the database of the API.
   * @return {string} - The port of the database of the API.
   */
  static get _DbPort(): string {
    const { MONGO_PORT, MONGO_PORT_27017_TCP_PORT } = process.env
    return MONGO_PORT_27017_TCP_PORT || MONGO_PORT || '27017'
  }

  /**
   * Get the username of the database of the API.
   * @return {string} - The username of the database of the API.
   */
  static get _DbUsername(): string {
    return process.env.MONGO_USER || ''
  }

  /**
   * Get the password of the database of the API.
   * @return {string} - The password of the database of the API.
   */
  static get _DbPassword(): string {
    return process.env.MONGO_PASS || ''
  }

  /**
   * Setup the ExpressJS service.
   * @param {!Express} app - The ExpresssJS instance.
   * @param {?boolean} [pretty] - Pretty output with Winston logging.
   * @returns {undefined}
   */
  static setupDatabase(app: Express, pretty?: boolean): void {
    // Function for escaping strings.
    RegExp.escape = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

    // Connection and configuration of the MongoDB database.
    Setup.connectMongoDb()

    // Enable parsing URL encoded bodies.
    app.use(bodyParser.urlencoded({
      extended: true
    }))

    // Enable parsing JSON bodies.
    app.use(bodyParser.json())

    // Enables compression of response bodies.
    app.use(compress({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }))

    // Enable response time tracking for HTTP request.
    app.use(responseTime())

    // Enable HTTP request logging.
    if (pretty) {
      app.use(Logger.getLogger('express'))
    }
  }

  /**
   * Connection and configuration of the MongoDB database.
   * @returns {Promise<undefined, Error>} - The promise to connect to MongoDB.
   */
  static connectMongoDb(): Promise<void, Error> {
    let uri = 'mongodb://'
    if (Setup._DbUsername && Setup._DbPassword) {
      uri += `${Setup._DbUsername}:${Setup._DbPassword}@`
    }
    uri += `${Setup._DbHosts.join(',')}:${Setup._DbPort}/${Setup._DbName}`

    mongoose.Promise = global.Promise
    return mongoose.connect(uri, {
      useMongoClient: true
    })
  }

  /**
   * Disconnect from the MongoDB database.
   * @returns {Promise<undefined, Error>} - The promise to disconnect from
   * MongoDB.
   */
  static disconnectMongoDb(): Promise<void, Error> {
    return mongoose.connection.close()
  }

}
