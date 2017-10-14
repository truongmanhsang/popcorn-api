// Import the necessary modules.
import { join } from 'path'
/**
 * express.js middleware for winstonjs
 * @external {ExpressWinston} https://github.com/bithavoc/express-winston
 */
import { logger as ExpressWinston } from 'express-winston'
/**
 * a multi-transport async logging library for node.js
 * @external {Winston} https://github.com/winstonjs/winston
 */
import {
  createLogger,
  format,
  transports
} from 'winston'
import { name } from '../../package.json'
import { sprintf } from 'sprintf-js'

/**
 * Class for setting up the logger.
 * @flow
 * @type {Logger}
 */
export default class Logger {

  /**
   * The log levels Winston will be using.
   * @type {Object}
   */
  static _Levels: Object = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  }

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */
  static _checkEmptyMessage(args: Object): Object {
    if (args.message === '' && Object.keys(args.meta).length !== 0) {
      args.message = JSON.stringify(args.meta)
    }

    return args
  }

  /**
   * Get the color of the output based on the log level.
   * @param {?string} [level] - The log level.
   * @returns {string} - A color based on the log level.
   */
  static _getLevelColor(level?: string): string {
    switch (level) {
      case 'error':
        return '\x1b[31m'
      case 'warn':
        return '\x1b[33m'
      case 'info':
        return '\x1b[36m'
      case 'debug':
        return '\x1b[34m'
      default:
        return '\x1b[36m'
    }
  }

  /**
   * Formatter method which formats the output to the console.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  static _consoleFormatter(args: Object): string {
    const newArgs = Logger._checkEmptyMessage(args)
    const color = Logger._getLevelColor(newArgs.level)

    return sprintf(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
      new Date().toISOString(), newArgs.level.toUpperCase(), name,
      process.pid, newArgs.message)
  }

  /**
   * Formatter method which formats the output to the log file.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  static _fileFormatter(args: Object): string {
    const newArgs = Logger._checkEmptyMessage(args)
    return JSON.stringify({
      name,
      pid: process.pid,
      level: newArgs.level,
      msg: newArgs.message,
      time: new Date().toISOString()
    })
  }

  /**
   * Create a Winston instance.
   * @returns {Winston} - A configured Winston object.
   */
  static _createWinston() {
    const { Console, File } = transports

    return createLogger({
      levels: Logger._Levels,
      transports: [
        new Console({
          name,
          format: format.printf(Logger._consoleFormatter)
        }),
        new File({
          filename: join(process.env.TEMP_DIR, `${name}.log`),
          format: format.printf(Logger._fileFormatter),
          maxsize: 5242880,
          handleExceptions: true
        })
      ],
      exitOnError: false
    })
  }

  /**
   * Create an Express Winston instance.
   * @returns {ExpressWinston} - A configured Express Winston object.
   */
  static _createExpressWinston(): ExpressWinston {
    return new ExpressWinston({
      winstonInstance: Logger._createWinston(),
      expressFormat: true
    })
  }

  /**
   * Method to create a global logger object based on the properties of the
   * Logger class.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @param {?boolean} [quiet] - No output.
   * @returns {undefined}
   */
  static _createLogger(pretty?: boolean, quiet?: boolean): void {
    if (!global.logger) {
      global.logger = console
    }

    const winston = Logger._createWinston()
    Object.keys(Logger._Levels).map(level => {
      if (!quiet) {
        global.logger[level] = pretty
          ? winston[level].bind(winston)
          : console[level] // eslint-disable-line no-console
      } else {
        global.logger[level] = () => {}
      }
    })
  }

  /**
   * Get a logger object based on the choice.
   * @param {?string} [choice] - The choice for the logger object.
   * @param {?boolean} [pretty] - Pretty output with Winston logging.
   * @param {?boolean} [quiet] - No output.
   * @returns {ExpressWinston|undefined} - The logger object.
   */
  static getLogger(
    choice?: string,
    pretty?: boolean,
    quiet?: boolean
  ): ExpressWinston | undefined {
    if (!choice) {
      return undefined
    }

    const c = choice.toUpperCase()

    switch (c) {
      case 'EXPRESS':
        return Logger._createExpressWinston()
      case 'WINSTON':
        return Logger._createLogger(pretty, quiet)
      default:
        return undefined
    }
  }

}
