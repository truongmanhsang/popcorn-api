// Import the necessary modules.
// @flow
import fs from 'fs'
import { join } from 'path'
import {
  IController,
  // PopApi,
  utils
} from 'pop-api'
import type {
  $Application,
  $Request,
  $Response
} from 'express'

import ContentController from './ContentController'
import {
  AnimeShow as Anime,
  Movie,
  Show
} from '../models'
import {
  name,
  repository,
  version
} from '../../package'

/**
 * Class for displaying information about the server the API is running on.
 * @type {IndexController}
 * @implements {IController}
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
  registerRoutes(app: $Application): void {
    app.get('/status', this.getIndex)
    app.get('/logs/error', this.getErrorLog)
  }

  /**
   * Get general information about the server.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - General information about the server.
   */
  async getIndex(req: $Request, res: $Response): Promise<Object | Object> {
    try {
      const commit = await utils.executeCommand('git', [
        'rev-parse',
        '--short',
        'HEAD'
      ])

      const query = ContentController.Query
      const totalAnimes = await Anime.count(query).exec()
      const totalMovies = await Movie.count(query).exec()
      const totalShows = await Show.count(query).exec()

      return res.json({
        repo: repository.url,
        server: IndexController._Server,
        // status: await PopApi.scraper.getStatus(),
        totalAnimes,
        totalMovies,
        totalShows,
        // updated: await PopApi.scraper.getUpdated(),
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
  getErrorLog(req: $Request, res: $Response): Object {
    process.env.TEMP_DIR = typeof process.env.TEMP_DIR === 'string'
      ? process.env.TEMP_DIR
      : join(...[
        __dirname,
        '..',
        '..',
        'tmp'
      ])

    const root = process.env.TEMP_DIR
    const file = `${name}.log`
    const filePath = join(...[
      process.env.TEMP_DIR,
      file
    ])

    if (fs.existsSync(filePath)) {
      return res.sendFile(file, {
        root,
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
