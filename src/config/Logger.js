// Import the neccesary modules.
import path from 'path';
/** @external {Winston} https://github.com/winstonjs/winston */
import Winston from 'winston';
/** @external {ExpressWinston} https://bithavoc.io/express-winston/ */
import { logger as ExpressWinston } from 'express-winston';
import { sprintf } from 'sprintf-js';

import { name } from '../../package.json';

/** Class for setting up the logger. */
export default class Logger {

  /**
   * The log levels Winston will be using.
   * @type {Object}
   */
  static _Levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */
  static _checkEmptyMessage(args) {
    if (args.message === '' && Object.keys(args.meta).length !== 0)
      args.message = JSON.stringify(args.meta);

    return args;
  }

  /**
   * Get the color of the output based on the log level.
   * @param {String} level - The log level.
   * @returns {String} - A color based on the log level.
   */
  static _getLevelColor(level) {
    switch (level) {
    case 'error':
      return '\x1b[31m';
    case 'warn':
      return '\x1b[33m';
    case 'info':
      return '\x1b[36m';
    case 'debug':
      return '\x1b[34m';
    default:
      return '\x1b[36m';
    }
  }

  /**
   * Formatter function which formats the output to the console.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {String} - The formatted message.
   */
  static _consoleFormatter(args) {
    const newArgs = Logger._checkEmptyMessage(args);
    const color = Logger._getLevelColor(newArgs.level);

    return sprintf(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
      new Date().toISOString(), newArgs.level.toUpperCase(), name,
      process.pid, newArgs.message);
  }

  /**
   * Formatter function which formate the output to the log file.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {String} - The formatted message.
   */
  static _fileFormatter(args) {
    const newArgs = Logger._checkEmptyMessage(args);
    return JSON.stringify({
      name,
      pid: process.pid,
      level: newArgs.level,
      msg: newArgs.message,
      time: new Date().toISOString()
    });
  }

  /**
   * Create a Winston instance.
   * @returns {Object} - A configured Winston object.
   */
  static _createWinston() {
    return new Winston.Logger({
      transports: [
        new Winston.transports.Console({
          name,
          levels: Logger._Levels,
          formatter: Logger._consoleFormatter,
          handleExceptions: true,
          prettyPrint: true
        }),
        new Winston.transports.File({
          filename: path.join(tempDir, `${name}.log`),
          json: false,
          level: 'warn',
          formatter: Logger._fileFormatter,
          maxsize: 5242880,
          handleExceptions: true
        })
      ],
      exitOnError: false
    });
  }

  /**
   * Create an Express Winston instance.
   * @returns {Object} - A configured Express Winston object.
   */
  static _createExpressWinston() {
    return new ExpressWinston({
      winstonInstance: Logger._createWinston(),
      expressFormat: true
    });
  }

  /**
   * Function to create a global logger object based on the properties of the
   * logger function.
   * @param {Boolean} [pretty] - Pretty mode for output with colors.
   * @param {Boolean} [quiet] - No output.
   * @returns {void}
   */
  static _createLogger(pretty, quiet) {
    if (!global.logger) global.logger = {};
    const winston = Logger._createWinston();

    Object.keys(Logger._Levels).map(level => {
      if (pretty) {
        global.logger[level] = msg => {
          if (!quiet) winston[level](msg);
        };
      } else {
        global.logger[level] = msg => {
          if (!quiet) console[level](msg); // eslint-disable-line no-console
        };
      }
    });
  }

  /**
   * Get a logger object based on the choice.
   * @param {String} choice - The choice for the logger object.
   * @param {Boolean} pretty - Pretty output with Winston logging.
   * @param {Boolean} quiet - No output.
   * @returns {Object|undefined} - The logger object.
   */
  static getLogger(choice, pretty, quiet) {
    if (!choice) return undefined;

    const c = choice.toUpperCase();

    switch (c) {
    case 'EXPRESS':
      return Logger._createExpressWinston();
    case 'WINSTON':
      return Logger._createLogger(pretty, quiet);
    default:
      return undefined;
    }
  }

}
