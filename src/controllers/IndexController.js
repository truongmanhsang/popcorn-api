// Import the neccesary modules.
import fs from 'fs';
import path from 'path';

import { AnimeShow as Anime } from '../models/Anime';
import Movie from '../models/Movie';
import Show from '../models/Show';
import AnimeController from './contentcontrollers/AnimeController';
import ShowController from './contentcontrollers/ShowController';
import Scraper from '../Scraper';
import Util from '../Util';
import {
  name,
  repository,
  version
} from '../../package.json';

/** Class for displaying information about the server the API is running on. */
export default class IndexController {

  /**
   * The name of the server. Default is `serv01`.
   * @type {String}
   */
  static _Server = 'serv01';

  /**
   * Displays a given file.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {String} file - The name of the file.
   * @returns {Object} - A file to display in the browser.
   */
  static _displayFile(req, res, file) {
    if (fs.existsSync(path.join(tempDir, file))) {
      return res.status(204).sendFile(file, {
        root: tempDir,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8'
        }
      });
    }

    return res.json({
      error: `Could not find file: '${root}'`
    });
  }

  /**
   * Get general information about the server.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Object|Function} - General information about the server.
   */
  async getIndex(req, res, next) {
    try {
      const commit = await Util.executeCommand('git rev-parse --short HEAD');
      const totalAnimes = await Anime.count(AnimeController.Query).exec();
      const totalMovies = await Movie.count().exec();
      const totalShows = await Show.count(ShowController.Query).exec();

      return res.json({
        repo: repository.url,
        server: IndexController._Server,
        status: Scraper.Status,
        totalAnimes: totalAnimes || 0,
        totalMovies: totalMovies || 0,
        totalShows: totalShows || 0,
        updated: Scraper.Updated,
        uptime: process.uptime() | 0, // eslint-disable-line no-bitwise
        version,
        commit
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Displays the 'popcorn-api.log' file.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {void} - The content of the log file.
   */
  getErrorLog(req, res) {
    IndexController._displayFile(req, res, `${name}.log`);
  }

}
