// Import the necessary modules.
import asyncq from 'async-q'
import fs from 'fs'
import { join } from 'path'

import Context from './scraper/Context'
import ProviderConfig from './models/ProviderConfig'
import Util from './Util'

/**
 * Class for Initiating the scraping process.
 * @type {Scraper}
 * @flow
 */
export default class Scraper {

  /**
   * An array of the supported collections for mongodb.
   * @type {Array<string>}
   */
  static _Collections: Array<string> = ['anime', 'movie', 'show']

  /**
   * The path of the status file. Default is `./tmp/status.json`.
   * @type {string}
   */
  static StatusPath: string

  /**
   * Get path of the status file.
   * @return {string} - The path of the status file.
   */
  static get StatusPath(): string {
    return join(process.env.TEMP_DIR, 'status.json')
  }

  /**
   * The path of the updated file. Default is `./tmp/updated.json`.
   * @type {string}
   */
  static UpdatedPath: string

  /**
   * Get path of the updated file.
   * @return {string} - The path of the updated file.
   */
  static get UpdatedPath(): string {
    return join(process.env.TEMP_DIR, 'updated.json')
  }

  /**
   * Get the status object.
   * @returns {Promise<string, Error>} - The status of the scraping process.
   */
  static get Status(): Promise<string, Error> {
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
   * @param {!string} status - The status which will be set to in the
   * `status.json` file.
   * @returns {Promise<string, Error>} - 'ok' if saved, or the error is there is
   * one.
   */
  static set Status(status: string): Promise<string, Error> {
    return new Promise((resolve, reject) => {
      fs.writeFile(Scraper.StatusPath, status, 'utf8', err => {
        if (err) {
          return reject(err)
        }

        return resolve('ok')
      })
    })
  }

  /**
   * Get the updated object.
   * @returns {Promise<number, Error>} - The status of the scraping process.
   */
  static get Updated(): Promise<number, Error> {
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
   * @param {!number} updated - The epoch time when the API last started
   * scraping.
   * @returns {Promise<string, Error>} - 'ok' if saved, or the error is there is
   * one.
   */
  static set Updated(updated: number): Promise<string, Error> {
    return new Promise((resolve, reject) => {
      fs.writeFile(Scraper.UpdatedPath, String(updated), 'utf8', err => {
        if (err) {
          return reject(err)
        }

        return resolve('ok')
      })
    })
  }
  /**
   * Initiate the scraping.
   * @returns {undefined}
   */
  static scrape(): void {
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
