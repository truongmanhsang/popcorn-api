// Import the necessary modules.
import IContentController from './IContentController'

/**
 * Base class for getting content from endpoints.
 * @implements {IContentController}
 * @type {BaseContentController}
 * @flow
 */
export default class BaseContentController extends IContentController {

  /**
   * The item type of the content controller.
   * @type {string}
   */
  _itemType: string

  /**
   * The service of the content controller.
   * @type {ContentService}
   */
  _service: ContentService

  /**
   * Create a new content controller.
   * @param {!ContentService} service - The service for the content
   * controller.
   * @param {!string} itemType - The model of the content controller.
   */
  constructor(service: ContentService, itemType: string): void {
    super()

    /**
     * The item type of the content controller.
     * @type {string}
     */
    this._itemType = itemType
    /**
     * The service of the content controller.
     * @type {ContentService}
     */
    this._service = service
  }

  /**
   * Register the routes for the content controller to the Express instance.
   * @param {!Express} app - The Express instance to register the routes to.
   * @returns {undefined}
   */
  registerRoutes(app: Express): void {
    app.get(`/${this._itemType}s`, this.getContents.bind(this))
    app.get(`/${this._itemType}s/:page`, this.getPage.bind(this))
    app.get(`/${this._itemType}/:id`, this.getContent.bind(this))
    app.get(`/random/${this._itemType}`, this.getRandomContent.bind(this))
  }

  /**
   * Get all the available pages.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<string>, Object>} - A list of pages which are
   * available.
   */
  getContents(req: Object, res: Object): Promise<Array<string>, Object> {
    return this._service.getContents().then(content => {
      if (content.length === 0) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

  /**
   * Sort based on a propery.
   * @param {!string} sort - The property to sort on.
   * @param {!number} order - The way to sort the propery.
   * @returns {Object} - The sort object.
   */
  sortContent(sort: string, order: number): Object {
    let $sort = {
      'rating.votes': order,
      'rating.percentage': order,
      'rating.watching': order
    }

    if (sort) {
      if (sort.match(/name/i)) {
        $sort = {
          title: order
        }
      }
      if (sort.match(/rating/i)) {
        $sort = {
          'rating.percentage': order,
          'rating.votes': order
        }
      }
      if (sort.match(/(released|updated)/i)) {
        $sort = {
          latest_episode: order,
          released: order
        }
      }
      if (sort.match(/trending/i)) {
        $sort = {
          'rating.watching': order
        }
      }
      if (sort.match(/year/i)) {
        $sort = {
          year: order
        }
      }
    }

    return $sort
  }

  /**
   * Get content from one page.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<Content>, Object>} - The
   * content of one page.
   */
  getPage(req: Object, res: Object): Promise<Array<Content>, Object> {
    const { page } = req.params
    const { keywords, sort, genre, order } = req.query
    const o = parseInt(order, 10) ? parseInt(order, 10) : -1
    const s = this.sortContent(sort, o)

    this._service.getPage(s, page, keywords, genre).then(content => {
      if (content.length === 0) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

  /**
   * Get info from one item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Content, Object>} - The details
   * of a single item.
   */
  getContent(req: Object, res: Object): Promise<Content, Object> {
    return this._service.getContent(req.params.id).then(content => {
      if (!content) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))

  }

  /**
   * Get a random item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Content, Object>} - A random
   * item.
   */
  getRandomContent(req: Object, res: Object): Promise<Content, Object> {
    return this._service.getRandomContent().then(content => {
      if (!content) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

}
