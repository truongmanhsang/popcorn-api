// Import the neccesary modules.
import fs from 'fs';
import path from 'path';

import { AnimeShow as Anime } from '../models/Anime';
import Movie from '../models/Movie';
import Show from '../models/Show';
import AnimeController from './contentcontrollers/AnimeController';
import MovieController from './contentcontrollers/MovieController';
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
  _server = 'serv01';

  /**
   * Get general information about the server.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {Object|Function} - General information about the server.
   */
  async getIndex(req, res) {
    try {
      const commit = await Util.executeCommand('git rev-parse --short HEAD');
      const totalAnimes = await Anime.count(AnimeController.Query).exec();
      const totalMovies = await Movie.count(MovieController.Query).exec();
      const totalShows = await Show.count(ShowController.Query).exec();

      return res.json({
        repo: repository.url,
        server: this._server,
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
      return res.json(err);
    }
  }

  /**
   * Displays the 'popcorn-api.log' file.
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @returns {void} - The content of the log file.
   */
  getErrorLog(req, res) {
    const file = `${name}.log`;
    const filePath = path.join(tempDir, file);

    if (fs.existsSync(filePath)) {
      return res.sendFile(file, {
        root: tempDir,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8'
        }
      });
    }

    return res.json({
      error: `Could not find file: '${filePath}'`
    });
  }

}
