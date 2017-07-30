// Import the neccesary modules.
import asyncq from 'async-q'
import fs from 'fs'
import path from 'path'

import Context from './scraper/Context'
import ProviderConfig from './models/ProviderConfig'
import Util from './Util'

// The path to the temporary directory.
global.tempDir = path.join(process.cwd(), 'tmp')

/** Class for Initiating the scraping process. */
export default class Scraper {

  /**
   * An array of the supported collections for mongodb.
   * @type {Array<String>}
   */
  static _Collections = ['anime', 'movie', 'show'];

  /**
   * The path of the status file. Default is `./tmp/status.json`.
   * @type {String}
   */
  static StatusPath = path.join(tempDir, 'status.json');

  /**
   * The path of the updated file. Default is `./tmp/updated.json`.
   * @type {String}
   */
  static UpdatedPath = path.join(tempDir, 'updated.json');

  /**
   * Get the status object.
   * @returns {Promise<String, Error>} - The status of the scraping process.
   */
  static get Status() {
    return new Promise((resolve, reject) => {
      return fs.readFile(Scraper.StatusPath, 'utf8', (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  /**
   * Updates the `status.json` file.
   * @param {!String} status - The status which will be set to in the
   * `status.json` file.
   * @returns {undefined}
   */
  static set Status(status) {
    fs.writeFile(Scraper.StatusPath, status, 'utf8', () => {})
  }

  /**
   * Get the updated object.
   * @returns {Promise<Number, Error>} - The status of the scraping process.
   */
  static get Updated() {
    return new Promise((resolve, reject) => {
      return fs.readFile(Scraper.UpdatedPath, 'utf8', (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(Number(res))
      })
    })
  }

  /**
   * Updates the `updated.json` file.
   * @param {!Number} updated - The epoch time when the API last
   * started scraping.
   * @returns {undefined}
   */
  static set Updated(updated) {
    fs.writeFile(Scraper.UpdatedPath, updated, 'utf8', () => {})
  }

  /**
   * Initiate the scraping.
   * @returns {undefined}
   */
  static scrape() {
    Scraper.Updated = Math.floor(new Date().getTime() / 1000)

    const context = new Context()

    /**
     * NOTE: `.sort({ $natural: <order> })` sorts the provider configs based on
     * the order of insertion.
     */
    ProviderConfig.find().sort({
      $natural: -1
    }).exec().then(pConfigs => {
      return asyncq.eachSeries(pConfigs, async pConfig => {
        // XXX: import(``).default does not work.
        let Provider = await import(`./scraper/providers/${pConfig.class}`)
        Provider = Provider.default

        const provider = new Provider(pConfig)
        context.provider = provider
        Scraper.Status = provider.name
        return context.execute()
      })
    }).then(() => {
      Scraper.Status = 'Idle'
    }).then(() => asyncq.eachSeries(
      Scraper._Collections,
      collection => Util.Instance.exportCollection(collection)
    )).catch(err => logger.error(`Error while scraping: ${err}`))
  }

}
