// Import the necessary modules.
import pMap from 'p-map'
import { readFile, writeFile } from 'fs-extra'
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
   * The context to execute the providers in.
   * @type {Context}
   */
  static _Context: Context = new Context()

  /**
   * The path of the status file. Default is `./tmp/status.json`.
   * @type {string}
   */
  static StatusPath: string

  /**
   * The path of the updated file. Default is `./tmp/updated.json`.
   * @type {string}
   */
  static UpdatedPath: string

  /**
   * Get path of the status file.
   * @returns {string} - The path of the status file.
   */
  static get StatusPath(): string {
    return join(process.env.TEMP_DIR, 'status.json')
  }

  /**
   * Get path of the updated file.
   * @returns {string} - The path of the updated file.
   */
  static get UpdatedPath(): string {
    return join(process.env.TEMP_DIR, 'updated.json')
  }

  /**
   * Get the status of the scraping.
   * @returns {Promise<string, Error>} - The status of the scraping process.
   */
  static get Status(): Promise<string, Error> {
    return readFile(Scraper.StatusPath, 'utf8')
  }

  /**
   * Updates the `status.json` file.
   * @param {!string} status - The status which will be set in the
   * `status.json` file.
   * @returns {Promise<undefined, Error>} - The result of setting the status.
   */
  static set Status(status: string): Promise<void, Error> {
    return writeFile(Scraper.StatusPath, status, 'utf8')
  }

  /**
   * Get the epoch time for when the last time the scraping process was run.
   * @returns {Promise<number, Error>} - The epoch time for the last time the
   * scraping process has run. 
   */
  static get Updated(): Promise<number, Error> {
    return readFile(Scraper.UpdatedPath, 'utf8')
      .then(res => Number(res))
  }

  /**
   * Updates the `updated.json` file.
   * @param {!number} updated - The epoch time when the API last started
   * scraping.
   * @returns {Promise<undefined, Error>} - The result of setting the updated
   * status.
   */
  static set Updated(updated: number): Promise<void, Error> {
    return writeFile(Scraper.UpdatedPath, String(updated), 'utf8')
  }

  /**
   * Initiate the scraping.
   * @returns {Promise<Array<Content>, Error>} - The array of the exported 
   * collections.
   */
  static scrape(): Promise<Array<Content>, Error> {
    Scraper.Updated = Math.floor(new Date().getTime() / 1000)

    /**
     * NOTE: `.sort({ $natural: <order> })` sorts the provider configs based on
     * the order of insertion.
     */
    return ProviderConfig.find().sort({
      $natural: -1
    }).exec().then(pConfigs => {
      return pMap(pConfigs, async pConfig => {
        // XXX: import(``).default does not work.
        let Provider = await import(`./scraper/providers/${pConfig.clazz}`)
        Provider = Provider.default

        const provider = new Provider(pConfig)
        Scraper._Context.provider = provider
        Scraper.Status = provider.name
        return Scraper._Context.execute()
      }, {
        concurrency: 1
      })
    }).then(() => {
      Scraper.Status = 'Idle'
    }).then(() => pMap(
      Scraper._Collections,
      collection => Util.exportCollection(collection)
    )).catch(err => logger.error(`Error while scraping: ${err}`))
  }

}
