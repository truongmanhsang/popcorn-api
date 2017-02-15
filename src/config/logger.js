// Import the neccesary modules.
import { logger as Logger } from 'express-winston';
import path from 'path';
import sprintf from 'sprintf';
import Winston from 'winston';

import { tempDir } from './constants';
import { name } from '../../package.json';

/**
 * The log levels Winston will be using.
 * @type {Object}
 */
const _levels = {
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
function _checkEmptyMessage(args) {
  if (args.message === '' && Object.keys(args.meta).length !== 0)
    args.message = JSON.stringify(args.meta);

  return args;
}

/**
 * Get the color of the output based on the log level.
 * @param {String} level - The log level.
 * @returns {String} - A color based on the log level.
 */
function _getLevelColor(level) {
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
function _consoleFormatter(args) {
  const newArgs = _checkEmptyMessage(args);
  const color = _getLevelColor(newArgs.level);

  return sprintf(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
    new Date().toISOString(), newArgs.level.toUpperCase(), name,
    process.pid, newArgs.message);
}

/**
 * Formatter function which formate the output to the log file.
 * @param {Object} args - Arguments passed by Winston.
 * @returns {String} - The formatted message.
 */
function _fileFormatter(args) {
  const newArgs = _checkEmptyMessage(args);
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
 * @external {Winston} https://github.com/winstonjs/winston
 * @returns {Wintson} - A configured Winston object.
 */
function _createWinston() {
  return new Winston.Logger({
    transports: [
      new Winston.transports.Console({
        name,
        levels: _levels,
        formatter: _consoleFormatter,
        handleExceptions: true,
        prettyPrint: true
      }),
      new Winston.transports.File({
        filename: path.join(tempDir, `${name}.log`),
        json: false,
        level: 'warn',
        formatter: _fileFormatter,
        maxsize: 5242880,
        handleExceptions: true
      })
    ],
    exitOnError: false
  });
}

/**
 * Create an Express Winston instance.
 * @external {ExpressWinston} http://bithavoc.io/express-winston/
 * @returns {ExpressWinston} - A configured Express Winston object.
 */
export function createExpressWinston() {
  return new Logger({
    winstonInstance: _createWinston(),
    expressFormat: true
  });
}

/**
 * Function to create a global logger object based on the properties of the logger function.
 * @param {?Boolean} [pretty] - Pretty mode for output with colors.
 * @param {?Boolean} [verbose] - Debug mode for no output.
 * @param {?winston} [winston=_createWinston()] - The Winston object to create a global logger.
 * @returns {void}
 */
export function createLogger(pretty, verbose, winston = _createWinston()) {
  if (!global.logger) global.logger = {};

  Object.keys(_levels).map(level => {
    if (pretty) {
      global.logger[level] = msg => {
        if (!verbose) winston[level](msg);
      };
    } else {
      global.logger[level] = msg => {
        if (!verbose) console[level](msg); // eslint-disable-line no-console
      };
    }
  });
}
