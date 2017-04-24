// Import the neccesary modules.
import bodyParser from 'body-parser';
import compress from 'compression';
import mongoose from 'mongoose';
import responseTime from 'response-time';

import Logger from './Logger';

/** Class for setting up ExpressJS and MongoDB */
export default class Setup {

  /**
   * The name of the database. Default is `popcorn`.
   * @type {String}
   */
  static DbName = 'popcorn';

  /**
   * The host of the server of the database. Default is `['localhost']`.
   * @type {Array}
   */
  static _DbHosts = ['localhost'];

  /**
   * Setup the ExpressJS service.
   * @param {Object} app - The ExpresssJS instance.
   * @param {Boolean} [pretty] - Pretty output with Winston logging.
   * @returns {void}
   */
  constructor(app, pretty) {
    // Function for escaping strings.
    RegExp.escape = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    // Connection and configuration of the MongoDB database.
    Setup.connectMongoDB();

    // Enable parsing URL encoded bodies.
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    // Enable parsing JSON bodies.
    app.use(bodyParser.json());

    // Enables compression of response bodies.
    app.use(compress({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }));

    // Enable response time tracking for HTTP request.
    app.use(responseTime());

    // Enable HTTP request logging.
    if (pretty) app.use(Logger.getLogger('express'));
  }

  /**
   * Connection and configuration of the MongoDB database.
   * @returns {void}
   */
  static connectMongoDB() {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${Setup._DbHosts.join(',')}/${Setup.DbName}`, {
      db: {
        native_parser: true
      },
      replset: {
        rs_name: 'pt0',
        connectWithNoPrimary: true,
        readPreference: 'nearest',
        strategy: 'ping',
        socketOptions: {
          keepAlive: 1
        }
      },
      server: {
        readPreference: 'nearest',
        strategy: 'ping',
        socketOptions: {
          keepAlive: 1
        }
      }
    });
  }

}
