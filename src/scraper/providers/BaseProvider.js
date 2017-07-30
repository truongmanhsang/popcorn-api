// Import the necessary modules.
import asyncq from 'async-q'
import { ItemType } from 'butter-provider'

import FactoryProducer from '../resources/FactoryProducer'
import IProvider from './IProvider'

/**
 * Class for scraping content from various sources.
 * @implements {IProvider}
 * @type {BaseProvider}
 * @flow
 */
export default class BaseProvider extends IProvider {

  /**
   * The types of models available for the API.
   * @type {Object}
   */
  static ModelTypes: Object = {
    AnimeMovie: 'animemovie',
    AnimeShow: 'animeshow',
    Movie: 'movie',
    Show: 'show'
  }

  /**
   * The types of content available for the API.
   * @type {Object}
   */
  static Types: Object = {
    Movie: ItemType.MOVIE,
    Show: ItemType.TVSHOW
  }

  /**
   * The maximum web requests can take place at the same time. Default is `2`.
   * @protected
   * @type {number}
   */
  static _MaxWebRequest: number = 2

  /**
   * The api of the torrent provider.
   * @type {Object}
   */
  _api: Object

  /**
   * The name of the torrent provider.
   * @type {string}
   */
  _name: string

  /**
   * The helper class for adding movies.
   * @type {MovieHelper|ShowHelper}
   */
  _helper: MovieHelper | ShowHelper

  /**
   * The query object for the api.
   * @type {Object}
   */
  _query: Object

  /**
   * The type of content to scrape.
   * @type {string}
   */
  _type: string

  /**
   * Create a BaseProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {!Object} config.api - The name of api for the torrent provider.
   * @param {!string} config.name - The name of the torrent provider.
   * @param {!string} config.modelType - The model type for the helper.
   * @param {!Object} config.query - The query object for the api.
   * @param {!string} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, query, type}: Object): void {
    super()

    const apiFactory = FactoryProducer.getFactory('api')
    const helperFactory = FactoryProducer.getFactory('helper')
    const modelFactory = FactoryProducer.getFactory('model')

    const model = modelFactory.getModel(modelType)

    /**
     * The api of the torrent provider.
     * @type {Object}
     */
    this._api = apiFactory.getApi(api)

    /**
     * The name of the torrent provider.
     * @type {string}
     */
    this._name = name

    /**
     * The helper class for adding movies.
     * @type {MovieHelper|ShowHelper}
     */
    this._helper = helperFactory.getHelper(this._name, model, type)

    /**
     * The query object for the api.
     * @type {Object}
     */
    this._query = query

    /**
     * The type of content to scrape.
     * @type {string}
     */
    this._type = type
  }

  /**
   * Get the name of the provider.
   * @returns {string} - The name of the provider.
   */
  get name(): string {
    return this._name
  }

  /**
   * Gets information about content from Trakt.tv and inserts the content into
   * the MongoDB database.
   * @override
   * @param {!Object} content - The content information.
   * @throws {Error} - 'CONTENT_TYPE' is not a valid value for Types!
   * @returns {Promise<Object, undefined>} - A content object.
   */
  async getContent(content: Object): Promise<Object, void> {
    try {
      let newContent

      if (this._type === BaseProvider.Types.Movie) {
        const { slugYear, torrents } = content
        newContent = await this._helper.getTraktInfo(slugYear)

        if (newContent && newContent._id) {
          return await this._helper.addTorrents(newContent, torrents)
        }
      } else if (this._type === BaseProvider.Types.Show) {
        const { episodes, slug } = content
        delete episodes[0]
        newContent = await this._helper.getTraktInfo(slug)

        if (newContent && newContent._id) {
          return await this._helper.addEpisodes(newContent, episodes, slug)
        }
      } else {
        throw new Error(`'${this._type}' is not a valid value for Types!`)
      }
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * Get content info from a given torrent.
   * @override
   * @protected
   * @param {!Object} torrent - A torrent object to extract content information
   * from.
   * @param {!string} [lang=en] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  _getContentData(torrent: Object, lang: string = 'en'): Object | void {
    const regex = this._regexps.find(
      r => r.regex.test(torrent.title) ? r : null
    )

    if (regex) {
      return this._extractContent(torrent, regex, lang)
    }

    logger.warn(`${this._name}: Could not find data from torrent: '${torrent.title}'`)
  }

  /**
   * Get all the torrents of a given torrent provider.
   * @override
   * @protected
   * @param {!number} totalPages - The total pages of the query.
   * @returns {Promise<Array<Object>, undefined>} - A list of all the queried
   * torrents.
   */
  _getAllTorrents(totalPages: number): Promise<Array<Object>, void> {
    let torrents = []
    return asyncq.timesSeries(totalPages, async page => {
      if (this._query.page) {
        this._query.page = page + 1
      }
      if (this._query.offset) {
        this._query.offset = page + 1
      }

      logger.info(`${this._name}: Started searching ${this._name} on page ${page + 1} out of ${totalPages}`)
      const res = await this._api.search(this._query)
      const data = res.results ? res.results : res.data ? res.data.movies : []

      torrents = torrents.concat(data)
    }).then(() => {
      logger.info(`${this._name}: Found ${torrents.length} torrents.`)
      return torrents
    })
  }

  /**
   * Returns a list of all the inserted torrents.
   * @override
   * @returns {Promise<Array<Object>, undefined>} - A list of scraped content.
   */
  async search(): Promise<Array<Object>, void> {
    try {
      const getTotalPages = await this._api.search(this._query)

      const totalPages = process.env.NODE_ENV === 'development'
        ? 3
        : getTotalPages.total_pages
          ? getTotalPages.total_pages
          : Math.ceil(getTotalPages.data.movie_count / 50)

      if (!totalPages) {
        return logger.error(
          `${this._name}: totalPages returned: '${totalPages}'`
        )
      }

      logger.info(`${this._name}: Total pages ${totalPages}`)

      const torrents = await this._getAllTorrents(totalPages)

      const { language } = this._query
      const allContent = await this._getAllContent(torrents, language)

      return await asyncq.mapLimit(allContent, BaseProvider._MaxWebRequest,
        content => this.getContent(content)
      )
    } catch (err) {
      logger.error(err)
    }
  }

}
