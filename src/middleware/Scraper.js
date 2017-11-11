// Import the necessary modules.
// @flow
import pMap from 'p-map'
import { AbstractScraper } from 'pop-api-scraper'
import type { MongooseModel } from 'mongoose'

import { ProviderConfig } from '../models'

/**
 * Class for Initiating the scraping process.
 * @type {Scraper}
 */
export default class Scraper extends AbstractScraper {

  /**
   * An array of the supported collections for mongodb.
   * @type {Array<string>}
   */
  _collections: Array<string> = ['anime', 'movie', 'show']

  /**
   * Create a new BaseScraper object.
   * @param {!PopApi} PopApi - The PopApiScraper instance.
   * @param {!Context} options.context - The context the run the providers in.
   * @param {!Object} options - The options for the BaseScraper middleware.
   * @param {!string} options.statusPath = - The path of the status file.
   * @param {!string} options.updatePath - The path of the updated file.
   */
  constructor(PopApi: any, {
    context,
    statusPath,
    updatedPath
  }: Object): void {
    super(PopApi, {
      context,
      statusPath,
      updatedPath
    })

    /**
    * An array of the supported collections for mongodb.
    * @type {Array<string>}
    */
    this._collections = ['anime', 'movie', 'show']
  }

  /**
   * Initiate the scraping.
   * @returns {Promise<Array<Model>, Error>} - The array of the exported
   * collections.
   */
  scrape(): Promise<Array<MongooseModel> | Error> {
    Scraper.Updated = Math.floor(new Date().getTime() / 1000)

    /**
     * NOTE: `.sort({ $natural: <order> })` sorts the provider configs based on
     * the order of insertion.
     */
    return ProviderConfig.find().sort({
      $natural: -1
    }).exec().then(pConfigs => {
      return pMap(pConfigs, async pConfig => {
        // @flow-ignore
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
    // }).then(() => {
    //   return pMap(
    //     Scraper._Collections,
    //     collection => Util.exportCollection(collection)
    //   )
    }).catch(err => logger.error(`Error while scraping: ${err}`))
  }

}
