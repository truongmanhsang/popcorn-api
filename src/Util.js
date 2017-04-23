// Import the neccesary modules.
import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';

import Setup from './config/Setup';

/** Class with frequently used methods. */
class Util {

  /**
   * The instance used for the singleton pattern.
   * @type {Util}
   */
  static _Instance = undefined;

  /** Create a singleton class for Util. */
  constructor() {
    if (!Util.Instance) Util.Instance = this;
    return Util.Instance;
  }

  /**
   * Get the Util singleton instance.
   * @returns {Util} - The Util singleton instance.
   */
  static get Instance() {
    return Util._Instance;
  }

  /**
   * Set the Util singleton class.
   * @param {Util} _Instance - The instance to set.
   * @returns {void}
   */
  static set Instance(_Instance) {
    Util._Instance = _Instance;
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

    const cmd = `mongoexport -d ${Setup.DbName} -c ${collection}s -o "${jsonFile}"`;
    this.executeCommand(cmd).catch(err => logger.error(err));
  }

  /**
   * Import a json file to a collection.
   * @param {String} collection - The collection to import.
   * @param {String} jsonFile - The JSON file to import.
   * @returns {void}
   */
  importCollection(collection, jsonFile) {
    if (!path.isAbsolute(jsonFile))
      jsonFile = path.join(process.cwd(), jsonFile); // eslint-disable-line no-param-reassign
    if (!fs.existsSync(jsonFile))
      throw new Error(`Error: no such file found for '${jsonFile}'`);

    logger.info(`Importing collection: '${collection}', from: '${jsonFile}'`);

    const cmd = `mongoimport -d ${Setup.DbName} -c ${collection}s --file "${jsonFile}" --upsert`;
    this.executeCommand(cmd).catch(err => logger.error(err));
  }

}

/**
 * The Util singleton object.
 * @type {Util}
 */
export default new Util();
