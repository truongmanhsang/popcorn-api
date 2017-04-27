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
    return Util;
  }

  /**
   * Return the Util singleton instance.
   * @returns {Util} - The Util singleton instance.
   */
  static get Instance() {
    return Util._Instance;
  }

  /**
   * Set the Util singleton class.
   * @param {!Util} Instance - The instance to set.
   * @returns {undefined}
   */
  static set Instance(Instance) {
    Util._Instance = Instance;
  }

  /**
   * Execute a command from within the root folder.
   * @param {!String} cmd - The command to execute.
   * @returns {Promise<String, String>} - The output of the command.
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
   * @param {!String} collection - The collection to export.
   * @returns {Promise<String, String>} - The promise to export a collection.
   */
  exportCollection(collection) {
    const jsonFile = path.join(tempDir, `${collection}s.json`);
    logger.info(`Exporting collection: '${collection}s', to: '${jsonFile}'`);

    const cmd = `mongoexport -d ${Setup.DbName} -c ${collection}s -o "${jsonFile}"`;
    return this.executeCommand(cmd).catch(err => logger.error(err));
  }

  /**
   * Import a JSON file to a collection.
   * @param {!String} collection - The collection to import.
   * @param {!String} jsonFile - The JSON file to import.
   * @throws {Error} - Error: no such file found for 'JSON_FILE'
   * @returns {Promise<String, String>} - The promise to import a collection.
   */
  importCollection(collection, jsonFile) {
    const file = path.isAbsolute(jsonFile)
                        ? jsonFile
                        : path.join(process.cwd(), jsonFile);

    if (!fs.existsSync(jsonFile))
      throw new Error(`Error: no such file found for '${file}'`);

    logger.info(`Importing collection: '${collection}', from: '${file}'`);

    const cmd = `mongoimport -d ${Setup.DbName} -c ${collection}s --file "${file}" --upsert`;
    return this.executeCommand(cmd).catch(err => logger.error(err));
  }

}

/**
 * The Util singleton object.
 * @type {Util}
 * @ignore
 */
export default new Util();
