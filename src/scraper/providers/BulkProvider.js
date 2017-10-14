// Import the necessary modules.
import pMap from 'p-map'

import BaseProvider from './BaseProvider'

/**
 * Class for scraping content from EZTV and HorribleSubs.
 * @extends {BaseProvider}
 * @type {BulkProvider}
 * @flow
 */
export default class BulkProvider extends BaseProvider {

  /**
   * Create a BulkProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {!Object} config.api - The name of api for the torrent provider.
   * @param {!string} config.name - The name of the torrent provider.
   * @param {!string} config.modelType - The model type for the helper.
   * @param {!string} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, type}: Object): void {
    super({api, name, modelType, type})
  }

  /**
   * Returns a list of all the inserted torrents.
   * @override
   * @returns {Promise<Array<Object>, undefined>} - A list of scraped content.
   */
  async search(): Promise<Array<Object>, void> {
    try {
      logger.info(`${this._name}: Started scraping...`)
      const contents = await this._api.getAll()
      logger.info(`${this._name}: Found ${contents.length} ${this._type}s.`)

      return await pMap(contents, async c => {
        const content = await this._api.getData(c)
        return this.getContent(content)
      }, {
        concurrency: BaseProvider._MaxWebRequest
      })
    } catch (err) {
      logger.error(err)
    }
  }

}
