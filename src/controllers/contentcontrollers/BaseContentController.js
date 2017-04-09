// Import the neccesary modules.
import IContentController from './IContentController';

/**
 * Base class for getting content from endpoints.
 * @implements {IContentController}
 */
export default class BaseContentController extends IContentController {

  /**
   * The amount of objects show per page. Default is `50`.
   * @type {Number}
   */
  _pageSize = 50;

  /**
   * Create a new content controller.
   * @param {Object} model - The model for the content controller.
   */
  constructor(model) {
    super();

    /**
     * The model for the content controller.
     * @type {Object}
     */
    this._model = model;
  }

  /**
   * Get all the pages.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<String>} - A list of pages which are available.
   */
  getContents(req, res, next) {
    return this._model.count(BaseContentController.query).exec().then(count => {
      const pages = Math.ceil(count / this._pageSize);
      const docs = [];

      for (let i = 1; i < pages + 1; i++) // eslint-disable-line semi-spacing
        docs.push(`${this._model.collection.name}/${i}`);

      return res.json(docs);
    }).catch(err => next(err));
  }

  /**
   * Get one page.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<Show>} - The contents of one page.
   */
  getPage(req, res, next) {
    const page = req.params.page - 1;
    const offset = page * this._pageSize;

    if (req.params.page.match(/all/i)) {
      return this._model.aggregate([{
        $match: BaseContentController.query
      }, {
        $project: BaseContentController._projections
      }, {
        $sort: {
          title: -1
        }
      }]).exec()
        .then(docs => res.json(docs))
        .catch(err => next(err));
    }

    const query = Object.assign({}, BaseContentController.query);
    const data = req.query;

    data.order = data.order ? parseInt(data.order, 10) : -1;

    let sort = {
      'rating.votes': data.order,
      'rating.percentage': data.order,
      'rating.watching': data.order
    };

    if (data.keywords) {
      const words = data.keywords.split(' ');
      let regex = '^';

      for (const w in words) {
        words[w] = words[w].replace(/[^a-zA-Z0-9]/g, '');
        regex += `(?=.*\\b${RegExp.escape(words[w].toLowerCase())}\\b)`;
      }

      query.title = {
        $regex: new RegExp(`${regex}.*`),
        $options: 'gi'
      };
    }

    if (data.sort) {
      if (data.sort.match(/name/i)) sort = {
        title: data.order
      };
      if (data.sort.match(/rating/i)) sort = {
        'rating.percentage': data.order,
        'rating.votes': data.order
      };
      if (data.sort.match(/trending/i)) sort = {
        'rating.watching': data.order
      };
      if (data.sort.match(/updated/i)) sort = {
        latest_episode: data.order
      };
      if (data.sort.match(/year/i)) sort = {
        year: data.order
      };
    }

    if (data.genre && !data.genre.match(/all/i)) {
      // TODO: bit of a hack, should be handled by the client.
      let { genre } = data;
      if (genre.match(/science[-\s]fiction/i) || genre.match(/sci[-\s]fi/i))
        genre = 'science-fiction';

      query.genres = genre.toLowerCase();
    }

    return this._model.aggregate([{
      $sort: sort
    }, {
      $match: query
    }, {
      $project: BaseContentController._projections
    }, {
      $skip: offset
    }, {
      $limit: this._pageSize
    }]).exec()
      .then(docs => res.json(docs))
      .catch(err => res.jfson(err));
  }

  /**
   * Get info from one show.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Show} - The details of a single show.
   */
  getContent(req, res, next) {
    return this._model.findOne({
      _id: req.params.id
    }, {
      latest_episode: 0
    }).exec()
      .then(docs => res.json(docs))
      .catch(err => next(err));
  }

  /**
   * Get a random movie.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Movie} - A random movie.
   */
  getRandomContent(req, res, next) {
    return this._model.aggregate([{
      $match: BaseContentController.query
    }, {
      $sample: {
        size: 1
      }
    }, {
      $limit: 1
    }]).exec()
      .then(docs => res.json(docs[0]))
      .catch(err => next(err));
  }

}
