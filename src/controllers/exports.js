// Import the neccesary modules.
import fs from "fs";
import mime from "mime";
import path from "path";

import Util from "../util";
import { tempDir } from "../config/constants";

/** Class for getting anime data from the MongoDB. */
export default class Exports {

  /** Create an exports object. */
  constructor() {
    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new Util();
  };

  /**
   * Download the export of a collection.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {Download} - The download of an export of a collection.
   */
  getExport(req, res, next) {
    const collection = req.params.collection;
    let err;

    if (collection.match(/(anime)$|(movie)$|(show)$/i)) {
      const jsonFile = path.join(tempDir, `${collection}s.json`);
      if (!fs.existsSync(jsonFile)) {
        err = {error: `Error: no such file found for '${jsonFile}'`};
        return res.status(500).json(err);
      } else {
        return res.download(jsonFile);
      }
    } else {
      err = {error: `Error: '${collection}' is not a valid collection to export.`};
      res.status(500).json(err);
    }
  };

};
