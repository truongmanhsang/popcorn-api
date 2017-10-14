// Import the necessary modules.
import { join } from 'path'
import { existsSync } from 'fs'

import IController from './IController'

/**
 * Class for downloading export collections.
 * @type {ExportController}
 * @implements {IController}
 * @flow
 */
export default class ExportController extends IController {

  /**
   * Register the routes for the export controller to the Express instance.
   * @param {!Express} app - The Express instance to register the routes to.
   * @returns {undefined}
   */
  registerRoutes(app: Express): void {
    app.get('/exports/:collection', this.getExport)
  }

  /**
   * Download the export of a collection.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Object} - The download request of an export of a collection.
   */
  getExport(req: Object, res: Object): Object {
    const { collection } = req.params

    if (collection.match(/(anime|movie|show)s?/i)) {
      let jsonFile = join(process.env.TEMP_DIR, `${collection}.json`)
      if (existsSync(jsonFile)) {
        return res.download(jsonFile)
      }

      jsonFile = join(process.env.TEMP_DIR, `${collection}s.json`)
      if (existsSync(jsonFile)) {
        return res.download(jsonFile)
      }

      return res.status(500).json({
        error: `Error: no such file found for '${jsonFile}'`
      })
    }

    return res.status(500).json({
      error: `Error: '${collection}' is not a valid collection to export.`
    })
  }

}
