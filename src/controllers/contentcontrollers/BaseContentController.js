// Import the neccesary modules.
import IContentController from './IContentController';

/**
 * Base class for getting content from endpoints.
 * @implements {IContentController}
 */
export default class BaseContentController extends IContentController {

  /**
   * Object used to query for anime content.
   * @type {Object}
   */
  static Query = {
    $or: [{
      num_seasons: {
        $gt: 0
      }
    }, {
      torrents: {
        $exists: true
      }
    }]
  };

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
   * @returns {Array<String>} - A list of pages which are available.
   */
  getContents(req, res) {
    return this._model.count(BaseContentController.Query).exec().then(count => {
      const pages = Math.ceil(count / this._pageSize);
      const docs = [];

      for (let i = 1; i < pages + 1; i++) // eslint-disable-line semi-spacing
        docs.push(`${this._model.collection.name}/${i}`);

      return res.json(docs);
    }).catch(err => res.json(err));
  }

  /**
   * Get one page.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {Array<Object>} - The contents of one page.
   */
  getPage(req, res) {
    if (req.params.page.match(/all/i)) {
      return this._model.aggregate([{
        $match: BaseContentController.Query
      }, {
        $project: this._projection
      }, {
        $sort: {
          title: -1
        }
      }]).exec()
        .then(docs => res.json(docs))
        .catch(err => res.json(err));
    }

    const page = !isNaN(req.params.page) ? req.params.page - 1 : 0;
    const offset = page * this._pageSize;
    const query = Object.assign({}, BaseContentController.Query);
    const { keywords, sort } = req.query;
    const order = req.query.order ? parseInt(req.query.order, 10) : -1;

    let { genre } = req.query,
      $sort = {
        'rating.votes': order,
        'rating.percentage': order,
        'rating.watching': order
      };

    if (genre && !genre.match(/all/i)) {
      // TODO: bit of a hack, should be handled by the client.
      if (genre.match(/science[-\s]fiction/i) || genre.match(/sci[-\s]fi/i))
        genre = 'science-fiction';

      query.genres = genre.toLowerCase();
    }

    if (keywords) {
      const words = keywords.split(' ');
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

    if (sort) {
      if (sort.match(/name/i)) $sort = {
        title: order
      };
      if (sort.match(/rating/i)) $sort = {
        'rating.percentage': order,
        'rating.votes': order
      };
      if (sort.match(/trending/i)) $sort = {
        'rating.watching': order
      };
      if (sort.match(/released/i)) $sort = {
        latest_episode: order,
        released: order
      };
      if (sort.match(/year/i)) $sort = {
        year: order
      };
    }

    return this._model.aggregate([{
      $sort
    }, {
      $match: query
    }, {
      $project: this._projection
    }, {
      $skip: offset
    }, {
      $limit: this._pageSize
    }]).exec()
      .then(docs => res.json(docs))
      .catch(err => res.json(err));
  }

  /**
   * Get info from one show.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {Object} - The details of a single show.
   */
  getContent(req, res) {
    return this._model.findOne({
      _id: req.params.id
    }, {
      latest_episode: 0
    }).exec()
      .then(docs => res.json(docs))
      .catch(err => res.json(err));
  }

  /**
   * Get a random movie.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {Object} - A random movie.
   */
  getRandomContent(req, res) {
    return this._model.aggregate([{
      $match: BaseContentController.Query
    }, {
      $sample: {
        size: 1
      }
    }, {
      $limit: 1
    }]).exec()
      .then(docs => res.json(docs[0]))
      .catch(err => res.json(err));
  }

}
