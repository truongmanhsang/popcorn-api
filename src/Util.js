// Import the necessary modules.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

import Setup from './config/Setup'

/**
 * Class with frequently used methods.
 * @type {Util}
 * @flow
 */
export default class Util {

  /**
   * The instance used for the singleton pattern.
   * @type {Util}
   */
  static _Instance: Util

  /**
   * Return the Util singleton instance.
   * @returns {Util} - The Util singleton instance.
   */
  static get Instance(): Util {
    if (!Util._Instance) {
      Util.Instance = new Util()
    }

    return Util._Instance
  }

  /**
   * Set the Util singleton class.
   * @param {!Util} Instance - The instance to set.
   * @returns {undefined}
   */
  static set Instance(Instance: Util): void {
    Util._Instance = Instance
  }

  /**
   * Execute a command from within the root folder.
   * @param {!string} cmd - The command to execute.
   * @returns {Promise<string, Error>} - The output of the command.
   */
  executeCommand(cmd: string): Promise<string, Error> {
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, {
        cwd: __dirname
      }, (err, stdout) => {
        if (err) {
          return reject(err)
        }

        return resolve(stdout.split('\n').join(''))
      })
    })
  }

  /**
   * Export a collection to a JSON file.
   * @param {!string} collection - The collection to export.
   * @returns {Promise<string, undefined>} - The promise to export a collection.
   */
  exportCollection(collection: string): Promise<string, undefined> {
    const jsonFile = path.join(process.env.TEMP_DIR, `${collection}s.json`)
    logger.info(`Exporting collection: '${collection}s', to: '${jsonFile}'`)

    const cmd = `mongoexport -d ${Setup.DbName} -c ${collection}s -o "${jsonFile}"`
    return this.executeCommand(cmd).catch(logger.error)
  }

  /**
   * Import a JSON file to a collection.
   * @param {!string} collection - The collection to import.
   * @param {!string} jsonFile - The JSON file to import.
   * @throws {Error} - Error: no such file found for 'JSON_FILE'
   * @returns {Promise<string, undefined>} - The promise to import a collection.
   */
  importCollection(
    collection: string,
    jsonFile: string
  ): Promise<string, undefined> {
    const file = path.isAbsolute(jsonFile)
      ? jsonFile
      : path.join(process.cwd(), jsonFile)

    if (!fs.existsSync(jsonFile)) {
      throw new Error(`Error: no such file found for '${file}'`)
    }

    logger.info(`Importing collection: '${collection}', from: '${file}'`)

    const cmd = `mongoimport -d ${Setup.DbName} -c ${collection}s --file "${file}" --upsert`
    return this.executeCommand(cmd).catch(logger.error)
  }

}
