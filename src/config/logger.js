// Import the neccesary modules.
import expressWinston from "express-winston";
import fs from "fs";
import path from "path";
import sprintf from "sprintf";
import winston from "winston";

import { tempDir } from "./constants";
import { name } from "../../package.json";

/**
 * @class
 * @classdesc The factory function for overriding the default console object.
 * @memberof module:config/logger
 * @property {Object} logger - The Winston instance.
 * @property {Object} expressLogger - The Express Winston instance.
 * @param {Console} console - The default console object.
 */
export default class Logger {

  constructor() {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    Logger.logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          name,
          formatter: Logger.consoleFormatter,
          handleExceptions: true,
          prettyPrint: true
        }),
        new winston.transports.File({
          filename: path.join(tempDir, `${name}.log`),
          level: "warn",
          json: false,
          formatter: Logger.fileFormatter,
          maxsize: 5242880,
          handleExceptions: true
        })
      ],
      exitOnError: false
    });
    Logger.expressLogger = new expressWinston.logger({winstonInstance: Logger.logger, expressFormat: true});

    console.log = msg => Logger.logger.info(msg);
    console.error = msg => Logger.logger.error(msg);
    console.warn = msg => Logger.logger.warn(msg);
    console.info = msg => Logger.logger.info(msg);
    console.debug = msg => Logger.logger.debug(msg);
  };

  static checkEmptyMessage(args) {
    if (args.message === "" && Object.keys(args.meta).length !== 0)
      args.message = JSON.stringify(args.meta);

    return args;
  };

  static getLevelColor(level) {
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

  static consoleFormatter(args) {
    args = Logger.checkEmptyMessage(args);
    const color = Logger.getLevelColor(args.level);

    return sprintf(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
      new Date().toISOString(), args.level.toUpperCase(), name,
      process.pid, args.message);
  };

  static fileFormatter(args) {
    args = Logger.checkEmptyMessage(args);
    return JSON.stringify({
      name,
      pid: process.pid,
      level: args.level,
      msg: args.message,
      time: new Date().toISOString()
    });
  };

};
