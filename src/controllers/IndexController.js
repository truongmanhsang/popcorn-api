// Import the necessary modules.
import fs from 'fs'
import path from 'path'

import Anime from '../models/AnimeShow'
import IController from './IController'
import BaseContentController from './BaseContentController'
import Movie from '../models/Movie'
import Scraper from '../Scraper'
import Show from '../models/Show'
import Util from '../Util'
import {
  name,
  repository,
  version
} from '../../package.json'

/**
 * Class for displaying information about the server the API is running on.
 * @type {IndexController}
 * @implements {IController}
 * @flow
 */
export default class IndexController extends IController {

  /**
   * The name of the server. Default is `serv01`.
   * @type {string}
   */
  static _Server: string = 'serv01'

  /**
   * Register the routes for the index controller to the Express instance.
   * @param {!Express} app - The Express instance to register the routes to.
   * @returns { undefined}
   */
  registerRoutes(app: Express): void {
    app.get('/status', this.getIndex)
    app.get('/logs/error', this.getErrorLog)
  }

  /**
   * Get general information about the server.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - General information about the server.
   */
  async getIndex(req: Object, res: Object): Promise<Object, Object> {
    try {
      const commit = await Util.executeCommand('git rev-parse --short HEAD')

      const query = BaseContentController.Query
      const totalAnimes = await Anime.count(query).exec()
      const totalMovies = await Movie.count(query).exec()
      const totalShows = await Show.count(query).exec()

      return res.json({
        repo: repository.url,
        server: IndexController._Server,
        status: await Scraper.Status,
        totalAnimes,
        totalMovies,
        totalShows,
        updated: await Scraper.Updated,
        uptime: process.uptime() | 0, // eslint-disable-line no-bitwise
        version,
        commit
      })
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  /**
   * Displays the 'popcorn-api.log' file.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Object} - The content of the log file.
   */
  getErrorLog(req: Object, res: Object): Object {
    const file = `${name}.log`
    const filePath = path.join(process.env.TEMP_DIR, file)

    if (fs.existsSync(filePath)) {
      return res.sendFile(file, {
        root: process.env.TEMP_DIR,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8'
        }
      })
    }

    return res.status(500).json({
      error: `Could not find file: '${filePath}'`
    })
  }

}
