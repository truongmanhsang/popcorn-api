const fs = require("fs"),
  path = require("path"),
  appDir = path.dirname(require.main.filename),
  config = require("../config"),
  Show = require("../models/Show"),
  util = require("../util");

/* Displays a given file. */
const displayFile = (req, res, path, file) => {
  if (fs.existsSync(path + file)) {
    return res.sendFile(file, {
      root: path,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      }
    })
  } else {
    return res.json({
      error: "Could not find file: '" + path + file + "'"
    })
  }
};

module.exports = {

  /* Display server info. */
  getIndex: (req, res) => {
    const lastUpdatedJSON = JSON.parse(fs.readFileSync(config.tempDir + "/" + config.updatedFile, "utf8")),
      packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8")),
      statusJSON = JSON.parse(fs.readFileSync(config.tempDir + "/" + config.statusFile, "utf8"));

    return Show.count({
      num_seasons: {
        $gt: 0
      }
    }).then((count) => {
      return res.json({
        repo: packageJSON.repository.url,
        server: config.serverName,
        status: statusJSON.status != null ? statusJSON.status : "Idle",
        totalShows: count,
        updated: lastUpdatedJSON.lastUpdated != null ? lastUpdatedJSON.lastUpdated : "Unknown",
        uptime: process.uptime() | 0,
        version: packageJSON.version != null ? packageJSON.version : "Unknown"
      });
    }).catch((err) => {
      util.onError(err);
      return res.json(err);
    });
  },

  /* Displays the 'popcorn-api.log' file. */
  getErrorLog: (req, res) => {
    return displayFile(req, res, config.tempDir + "/", config.errorLog);
  }

};
