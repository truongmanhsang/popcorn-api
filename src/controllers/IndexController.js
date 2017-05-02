// Import the neccesary modules.
import fs from 'fs';
import path from 'path';

import AnimeController from './contentcontrollers/AnimeController';
import Movie from '../models/Movie';
import MovieController from './contentcontrollers/MovieController';
import Scraper from '../Scraper';
import Show from '../models/Show';
import ShowController from './contentcontrollers/ShowController';
import Util from '../Util';
import { AnimeShow as Anime } from '../models/Anime';
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
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - General information about the server.
   */
  async getIndex(req, res) {
    try {
      const commit = await Util.Instance
                               .executeCommand('git rev-parse --short HEAD');
      const totalAnimes = await Anime.count(AnimeController.Query).exec();
      const totalMovies = await Movie.count(MovieController.Query).exec();
      const totalShows = await Show.count(ShowController.Query).exec();

      return res.json({
        repo: repository.url,
        server: this._server,
        status: await Scraper.Status,
        totalAnimes: totalAnimes || 0,
        totalMovies: totalMovies || 0,
        totalShows: totalShows || 0,
        updated: await Scraper.Updated,
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
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Object} - The content of the log file.
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

    return res.status(500).json({
      error: `Could not find file: '${filePath}'`
    });
  }

}
