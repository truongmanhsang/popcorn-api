// Import the neccesary modules.
import fs from 'fs'
import path from 'path'

/** Class for downloading export collections. */
export default class ExportController {

  /**
   * Download the export of a collection.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Object} - The download request of an export of a collection.
   */
  getExport(req, res) {
    const { collection } = req.params

    if (collection.match(/(anime|movie|show)s?/i)) {
      let jsonFile = path.join(tempDir, `${collection}.json`)
      if (fs.existsSync(jsonFile)) {
        return res.download(jsonFile)
      }

      jsonFile = path.join(tempDir, `${collection}s.json`)
      if (fs.existsSync(jsonFile)) {
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
