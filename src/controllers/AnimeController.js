// Import the neccesary modules.
import Provider from 'butter-provider';

import { AnimeShow as Anime } from '../models/Anime';
import { pageSize } from '../config/constants';

/** Class for getting anime data from the MongoDB. */
export default class AnimeController {

  /**
   * Object used to query for anime content.
   * @type {Object}
   */
  static query = {
    $or: [{
      num_seasons: {
        $gt: 0
      }
    }, {
      num_seasons: {
        $exists: false
      }
    }]
  };

  /**
   * Delete properties from an object according to the type.
   * @param {Object} doc - the anime object with all the properties.
   * @returns {Object} doc - the anime object without certain properties.
   */
  static _deleteAccordingToType(doc) {
    switch (doc.type) {
    case Provider.ItemType.MOVIE:
      delete doc.episodes;
      delete doc.num_seasons;
      delete doc.status;
      break;
    case Provider.ItemType.TVSHOW:
      delete doc.trailer;
      delete doc.torrents;
      break;
    default:
      break;
    }

    return doc;
  }

  /**
   * Get all the pages.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<String>} - A list of pages which are available.
   */
  getAnimes(req, res, next) {
    return Anime.count(AnimeController.query).exec().then(count => {
      const pages = Math.ceil(count / pageSize);
      const docs = [];

      for (let i = 1; i < pages + 1; i++) docs.push(`animes/${i}`); // eslint-disable-line semi-spacing

      return res.json(docs);
    }).catch(err => next(err));
  }

  /**
   * Get one page.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<Anime>} - The contents of one page.
   */
  getPage(req, res, next) {
    const page = req.params.page - 1;
    const offset = page * pageSize;

    if (req.params.page.match(/all/i)) {
      return Anime.aggregate([{
        $match: AnimeController.query
      }, {
        $sort: {
          title: -1
        }
      }]).exec().then(docs => {
        const result = docs.map(doc => AnimeController._deleteAccordingToType(doc));
        return res.json(result);
      }).catch(err => next(err));
    }

    const query = Object.assign({}, AnimeController.query);
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

    return Anime.aggregate([{
      $sort: sort
    }, {
      $match: query
    }, {
      $skip: offset
    }, {
      $limit: pageSize
    }]).exec().then(docs => {
      const result = docs.map(doc => AnimeController._deleteAccordingToType(doc));
      return res.json(result);
    }).catch(err => next(err));
  }

  /**
   * Get info from one anime.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Anime} - The details of a single anime.
   */
  getAnime(req, res, next) {
    return Anime.findOne({
      _id: req.params.id,
      $or: AnimeController.query.$or
    }, {
      latest_episode: 0
    }).exec()
      .then(docs => res.json(AnimeController._deleteAccordingToType(docs)))
      .catch(err => next(err));
  }

  /**
   * Get a random anime.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Anime} - A random movie.
   */
  getRandomAnime(req, res, next) {
    return Anime.aggregate([{
      $match: AnimeController.query
    }, {
      $sample: {
        size: 1
      }
    }, {
      $limit: 1
    }]).exec()
      .then(docs => res.json(AnimeController._deleteAccordingToType(docs[0])))
      .catch(err => next(err));
  }

}
