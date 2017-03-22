// Import the neccesary modules.
import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';

import {
  dbName,
  statusFile,
  tempDir,
  updatedFile
} from './config/constants';

/** Class with frequently used methods. */
class Util {

  /**
   * The instance used for the singleton pattern.
   * @type {Util}
   */
  static _instance = undefined;

  /** Create a singleton class for Util. */
  constructor() {
    if (!Util.instance) Util.instance = this;
    return Util.instance;
  }

  /**
   * Get the Util singleton instance.
   * @returns {Util} - The Util singleton instance.
   */
  static get instance() {
    return Util._instance;
  }

  /**
   * Set the Util singleton class.
   * @param {Util} instance - The instance to set.
   * @returns {void}
   */
  static set instance(instance) {
    Util._instance = instance;
  }

  /**
   * Returns the epoch time.
   * @returns {Number} - Epoch time.
   */
  _now() {
    return Math.floor(new Date().getTime() / 1000);
  }

  /**
   * Execute a command from within the root folder.
   * @param {String} cmd - The command to execute.
   * @returns {Promise} - The output of the command.
   */
  executeCommand(cmd) {
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, {
        cwd: __dirname
      }, (err, stdout) => {
        if (err) return reject(err);
        return resolve(stdout.split('\n').join(''));
      });
    });
  }

  /**
   * Export a collection to a JSON file.
   * @param {String} collection - The collection to export.
   * @returns {void}
   */
  exportCollection(collection) {
    const jsonFile = path.join(tempDir, `${collection}s.json`);
    logger.info(`Exporting collection: '${collection}s', to: '${jsonFile}'`);

    const cmd = `mongoexport -d ${dbName} -c ${collection}s -o '${jsonFile}'`;
    this.executeCommand(cmd);
  }

  /**
   * Import a json file to a collection.
   * @param {String} collection - The collection to import.
   * @param {String} jsonFile - The json file to import..
   * @returns {void}
   */
  importCollection(collection, jsonFile) {
    if (!path.isAbsolute(jsonFile))
      jsonFile = path.join(process.cwd(), jsonFile); // eslint-disable-line no-param-reassign
    if (!fs.existsSync(jsonFile))
      throw new Error(`Error: no such file found for '${jsonFile}'`);

    logger.info(`Importing collection: '${collection}', from: '${jsonFile}'`);

    const cmd = `mongoimport -d ${dbName} -c ${collection}s --file '${jsonFile}' --upsert`;
    this.executeCommand(cmd);
  }

  /**
   * Error logger function.
   * @param {String} errorMessage - The error message you want to display.
   * @returns {Error} - A new error with the given error message.
   */
  onError(errorMessage) {
    logger.error(errorMessage);
    return new Error(errorMessage);
  }

  /**
   * Updates the `lastUpdated.json` file.
   * @param {String} [updated=Date.now()] - The epoch time when the API last
   * started scraping.
   * @returns {void}
   */
  setLastUpdated(updated = this._now()) {
    fs.writeFile(path.join(tempDir, updatedFile), JSON.stringify({
      updated
    }), () => {});
  }

  /**
   * Updates the `status.json` file.
   * @param {String} [status=Idle] - The status which will be set to in the
   * `status.json` file.
   * @returns {void}
   */
  setStatus(status = 'Idle') {
    fs.writeFile(path.join(tempDir, statusFile), JSON.stringify({
      status
    }), () => {});
  }

}

/**
 * The Util singleton object.
 * @type {Util}
 */
export default new Util();
