// Import the necessary modules.
import pMap from 'p-map'

/**
 * ContentService class for the CRUD operations.
 * @abstract
 * @type {ContentService}
 * @flow
 */
export default class ContentService {

  /**
   * The model of the service.
   * @type {Model}
   */
  Model: Model

  /**
   * The maximum items to display per page.
   * @type {number}
   */
  pageSize: number

  /**
   * Simple projection for showing multiple content items.
   * @type {Object}
   */
  projection: Object

  /**
   * The query of the service.
   * @type {Object}
   */
  query: Object = {}

  /**
   * The item type of the service.
   * @type {string}
   */
  _itemType: string

  /**
   * Create a new ContentService.
   * @param {!Model} Model - The model of the service.
   * @param {!string} itemType - The item type of the service.
   * @param {!Object} projection - The projection of the service.
   * @param {!Object} query - The query of the service.
   * @param {!number} [pageSize=25] - The page size of the service.
   */
  constructor(
    Model: Model,
    itemType: string,
    projection: Object,
    query: Object,
    pageSize: number = 50
  ): void {
    /**
     * The model of the service.
     * @type {Content}
     */
    this.Model = Model
    /**
     * The page size of the service.
     * @type {number}
     */
    this.pageSize = pageSize
    /**
     * The projection of the service.
     * @type {Object}
     */
    this.projection = projection
    /**
     * The query of the service.
     * @type {Object}
     */
    this.query = query
    /**
     * The item tyep of the service.
     * @type {string}
     */
    this._itemType = itemType
  }

  /**
   * Get all the available pages.
   * @param {!string} [base='/'] - The base of the url to display.
   * @returns {Promise<Array<string>, Error>} - A list of pages which are
   * available.
   */
  getContents(base: string = '/'): Promise<Array<string>, Error> {
    return this.Model.count(this.query).exec().then(count => {
      const pages = Math.ceil(count / this.pageSize)
      const docs = []

      for (let i = 1; i < pages + 1; i++) {
        docs.push(`${base}${this._itemType}/${i}`)
      }

      return docs
    })
  }

  /**
   * Get content from one page.
   * @param {!Object} sort - The sort object to sort and order content.
   * @param {?number|string} [p=0] - The page to get.
   * @param {?string} [keywords=null] - The keywords to search for.
   * @param {?string} [genre=null] - The genre the content is in.
   * @returns {Promise<Array<Model>, Error>} - The content of one page.
   */
  getPage(
    sort: Object,
    p: number | string,
    keywords: string = null,
    genre: string = null
  ): Promise<Array<Model>, Error> {
    const page = !isNaN(p) ? p - 1 : 0
    const offset = page * this.pageSize
    const query = {
      ...this.query
    }

    if (typeof p === 'string' && p.match(/all/i)) {
      return this.Model.aggregate([{
        $match: this.query
      }, {
        $project: this.projection
      }, {
        $sort: {
          title: -1
        }
      }]).exec()
    }

    if (genre && !genre.match(/all/i)) {
      // XXX: Bit of a hack, should be handled by the client.
      if (genre.match(/science[-\s]fiction/i) || genre.match(/sci[-\s]fi/i)) {
        query.genres = 'science-fiction'
      } else {
        query.genres = genre.toLowerCase()
      }
    }

    if (keywords) {
      const words = keywords.split(' ')
      let regex = '^'

      for (const w in words) {
        words[w] = words[w].replace(/[^a-zA-Z0-9]/g, '')
        regex += `(?=.*\\b${RegExp.escape(words[w].toLowerCase())}\\b)`
      }

      query.title = {
        $regex: new RegExp(`${regex}.*`),
        $options: 'gi'
      }
    }

    return this.Model.aggregate([{
      $sort: sort
    }, {
      $match: query
    }, {
      $project: this.projection
    }, {
      $skip: offset
    }, {
      $limit: this.pageSize
    }]).exec()
  }

  /**
   * Get info from the content.
   * @param {!string} id - The id of the content to get.
   * @param {!Object} projection - The projection for the content.
   * @returns {Promise<Model, Error>} - The details of the content.
   */
  getContent(id: string, projection: Object): Promise<Model, Error> {
    return this.Model.findOne({
      _id: id
    }, projection).exec()
  }

  /**
   * Insert the content into the database.
   * @param {!Object} obj - The object to insert.
   * @returns {Promise<Model, Error>} - The created content.
   */
  createContent(obj: Object): Promise<Model, Error> {
    // eslint-disable-next-line new-cap
    return new this.Model(obj).save()
  }

  /**
   * Insert multiple content models into the database.
   * @param {!Array<Object>} arr - The array of content to insert.
   * @returns {Promise<Array<Model>, Error>} - The inserted content.
   */
  createMany(arr: Array<Object>): Promise<Array<Model>, Error> {
    return pMap(arr, async obj => {
      const found = await this.Model.findOne({
        _id: obj.imdb_id
      })

      return found
        ? this.updateContent(obj.imdb_id, obj)
        : this.createContent(obj)
    }, {
      concurrency: 1
    })
  }

  /**
   * Update the content.
   * @param {!string} id - The id of the content to get.
   * @param {!Object} obj - The object to update.
   * @returns {Promise<Model, Error>} - The updated content.
   */
  updateContent(id: string, obj: Object): Promise<Model, Error> {
    return this.Model.findOneAndUpdate({
      _id: id
    }, new this.Model(obj), {
      upsert: true,
      new: true
    }).exec()
  }

  /**
   * Update multiple content models into the database.
   * @param {!Array<Object>} arr - The array of content to update.
   * @returns {Promise<Array<Model>, Error>} - The updated content.
   */
  updateMany(arr: Array<Object>): Promise<Array<Model>, Error> {
    return this.createMany(arr)
  }

  /**
   * Get random content.
   * @returns {Promise<Model, Error>} - Random content.
   */
  getRandomContent(): Promise<Model, Error> {
    return this.Model.aggregate([{
      $match: this.query
    }, {
      $project: this.projection
    }, {
      $sample: {
        size: 1
      }
    }, {
      $limit: 1
    }]).exec()
      .then(res => res[0])
  }

}
