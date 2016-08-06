// Import the neccesary modules.
import expressWinston from "express-winston";
import fs from "fs";
import path from "path";
import sprintf from "sprintf";
import winston from "winston";

import { tempDir } from "./constants";
import { name } from "../../package.json";

/** Class for overriding the default console object. */
export default class Logger {

  /** Create a logger object. */
  constructor() {
     // Create the temp directory if it does not exists.
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    /**
     * The Winston instance.
     * @type {Object}
     */
    Logger.logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          name,
          formatter: Logger._consoleFormatter,
          handleExceptions: true,
          prettyPrint: true
        }),
        new winston.transports.File({
          filename: path.join(tempDir, `${name}.log`),
          level: "warn",
          json: false,
          formatter: Logger._fileFormatter,
          maxsize: 5242880,
          handleExceptions: true
        })
      ],
      exitOnError: false
    });

    /**
     * The Express Winston instance.
     * @type {Object}
     */
    Logger.expressLogger = new expressWinston.logger({winstonInstance: Logger.logger, expressFormat: true});

    // Override the console functions.
    console.log = msg => Logger.logger.info(msg);
    console.error = msg => Logger.logger.error(msg);
    console.warn = msg => Logger.logger.warn(msg);
    console.info = msg => Logger.logger.info(msg);
    console.debug = msg => Logger.logger.debug(msg);
  };

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */
  static _checkEmptyMessage(args) {
    if (args.message === "" && Object.keys(args.meta).length !== 0)
      args.message = JSON.stringify(args.meta);

    return args;
  };

  /**
   * Get the color of the output based on the log level.
   * @param {String} level - The log level.
   * @returns {String} - A color based on the log level.
   */
  static _getLevelColor(level) {
    switch (level) {
    case "error":
      return "\x1b[31m";
      break;
    case "warn":
      return "\x1b[33m";
      break;
    case "info":
      return "\x1b[36m";
      break;
    case "debug":
      return "\x1b[34m";
      break;
    default:
      return "\x1b[36m";
      break;
    }
  };

  /**
   * Formatter function which formats the output to the console.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {String} - The formatted message.
   */
  static _consoleFormatter(args) {
    args = Logger._checkEmptyMessage(args);
    const color = Logger._getLevelColor(args.level);

    return sprintf(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
      new Date().toISOString(), args.level.toUpperCase(), name,
      process.pid, args.message);
  };

  /**
   * Formatter function which formate the output to the log file.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {String} - The formatted message.
   */
  static _fileFormatter(args) {
    args = Logger._checkEmptyMessage(args);
    return JSON.stringify({
      name,
      pid: process.pid,
      level: args.level,
      msg: args.message,
      time: new Date().toISOString()
    });
  };

};
