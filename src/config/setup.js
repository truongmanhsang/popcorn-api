// Import the neccesary modules.
import bodyParser from "body-parser";
import compress from "compression";
import mongoose from "mongoose";
import responseTime from "response-time";
import { global } from "./global";

/**
 * @class
 * @classdesc The factory function for setting up the API.
 * @memberof module:config/setup
 */
const Setup = () => {

  /**
   * @description Connection and configuration of the MongoDB database.
   * @function Setup#connectMongoDB
   * @memberof module:config/setup
   */
  const connectMongoDB = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${global.dbHosts.join(",")}/popcorn`, {
      db: {
        native_parser: true
      },
      replset: {
        rs_name: "pt0",
        connectWithNoPrimary: true,
        readPreference: "nearest",
        strategy: "ping",
        socketOptions: {
          keepAlive: 1
        }
      },
      server: {
        readPreference: "nearest",
        strategy: "ping",
        socketOptions: {
          keepAlive: 1
        }
      }
    });
  };

  /**
   * @description Setup the Express service.
   * @function Setup#setup
   * @memberof module:config/setup
   * @param {ExpressJS} app - The ExpresssJS instance.
   * @param {Winston} logger - The express-winston logger instance.
   */
  const setup = (app, logger) => {

    // Used to extract data from query strings.
    RegExp.escape = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    // Connection and configuration of the MongoDB database.
    connectMongoDB();

    // Enable parsing URL encoded bodies.
    app.use(bodyParser.urlencoded({extended: true}));

    // Enable parsing JSON bodies.
    app.use(bodyParser.json());

    // Enables compression of response bodies.
    app.use(compress({threshold: 1400, level: 4, memLevel: 3}));

    // Enable response time tracking for HTTP request.
    app.use(responseTime());

    // Enable HTTP request logging.
    app.use(logger.expressLogger);

  };

  // Return the public functions.
  return { connectMongoDB, setup };

};

// Export the Setup factory function.
export default Setup;
