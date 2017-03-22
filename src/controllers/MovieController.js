// Import the neccesary modules.
import Movie from '../models/Movie';
import { pageSize } from '../config/constants';

/** Class for getting movie data from the MongoDB. */
export default class MovieController {

  /**
   * Object used for the projection of movies.
   * @type {Object}
   */
  static _projection = {
    _id: 1,
    imdb_id: 1,
    title: 1,
    year: 1,
    synopsis: 1,
    runtime: 1,
    released: 1,
    trailer: 1,
    certification: 1,
    torrents: 1,
    genres: 1,
    images: 1,
    rating: 1
  };

  /**
   * Get all the pages.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<String>} - A list of pages which are available.
   */
  getMovies(req, res, next) {
    return Movie.count().exec().then(count => {
      const pages = Math.ceil(count / pageSize);
      const docs = [];

      for (let i = 1; i < pages + 1; i++) docs.push(`movies/${i}`); // eslint-disable-line semi-spacing

      return res.json(docs);
    }).catch(err => next(err));
  }

  /**
   * Get one page.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Array<Movie>} - The contents of one page.
   */
  getPage(req, res, next) {
    const page = req.params.page - 1;
    const offset = page * pageSize;

    if (req.params.page.match(/all/i)) {
      return Movie.aggregate([{
        $project: MovieController._projection
      }, {
        $sort: {
          title: -1
        }
      }]).exec()
        .then(docs => res.json(docs))
        .catch(err => next(err));
    }

    const query = {};
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
      if (data.sort.match(/last added/i)) sort = {
        released: data.order
      };
      if (data.sort.match(/rating/i)) sort = {
        'rating.percentage': data.order,
        'rating.votes': data.order
      };
      if (data.sort.match(/title/i)) sort = {
        title: data.order
      };
      if (data.sort.match(/trending/i)) sort = {
        'rating.watching': data.order
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

    return Movie.aggregate([{
      $sort: sort
    }, {
      $match: query
    }, {
      $project: MovieController._projection
    }, {
      $skip: offset
    }, {
      $limit: pageSize
    }]).exec()
      .then(docs => res.json(docs))
      .catch(err => next(err));
  }

  /**
   * Get info from one movie.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Movie} - The details of a single movie.
   */
  getMovie(req, res, next) {
    return Movie.findOne({
      _id: req.params.id
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
  getRandomMovie(req, res, next) {
    return Movie.aggregate([{
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
