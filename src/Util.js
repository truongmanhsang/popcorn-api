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
   * Execute a command from within the root folder.
   * @param {!string} cmd - The command to execute.
   * @returns {Promise<string, Error>} - The output of the command.
   */
  static executeCommand(cmd: string): Promise<string, Error> {
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
  static exportCollection(collection: string): Promise<string, undefined> {
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
  static importCollection(
    collection: string,
    jsonFile: string
  ): Promise<string, undefined> {
    const file = path.isAbsolute(jsonFile)
      ? jsonFile
      : path.join(process.cwd(), jsonFile)

    if (!fs.existsSync(file)) {
      const err = new Error(`Error: no such file found for '${file}'`)
      return Promise.reject(err)
    }

    logger.info(`Importing collection: '${collection}', from: '${file}'`)

    const cmd = `mongoimport -d ${Setup.DbName} -c ${collection}s --file "${file}" --upsert`
    return this.executeCommand(cmd).catch(logger.error)
  }

}
