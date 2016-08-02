// Import the neccesary modules.
import childProcess from "child_process";
import fs from "fs";
import path from "path";

import { statusFile, tempDir, traktKey, updatedFile } from "./config/constants";
import { name } from "../package.json";

/** Class holding the frequently used functions. */
export default class Util {

  /**
   * Execute a command from within the root folder.
   * @param {String} cmd - The command to execute.
   * @returns {String} - The output of the command.
   */
  executeCommand(cmd) {
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, {cwd: __dirname}, (err, stdout, stderr) => {
        if (err) return reject(err);
        return resolve(stdout.split("\n").join(""));
      });
    });
  };

  /**
   * Create an emty file.
   * @param {String} path - The path to the file to create.
   */
  createEmptyFile(path) {
    fs.createWriteStream(path).end();
  };

  /** Create the temporary directory. */
  createTemp() {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (fs.existsSync(tempDir)) this.resetTemp();

    this.createEmptyFile(path.join(tempDir, statusFile));
    this.createEmptyFile(path.join(tempDir, updatedFile));
  };

  /**
   * Removes all the files in the temporary directory.
   * @param {String} [tmpPath=popcorn-api/tmp] - The path to remove all the files within (Default is set in the `config/constants.js`).
   */
  resetTemp(tmpPath = tempDir) {
    const files = fs.readdirSync(tmpPath);
    files.forEach(file => {
      const stats = fs.statSync(path.join(tmpPath, file));
      if (stats.isDirectory()) {
        this.resetTemp(file);
      } else if (stats.isFile()) {
        fs.unlinkSync(path.join(tmpPath, file));
      }
    });
  };

  /**
   * Updates the `lastUpdated.json` file.
   * @param {String} [updated=Date.now()] - The epoch time when the API last started scraping.
   */
  setLastUpdated(updated = (Math.floor(new Date().getTime() / 1000))) {
    fs.writeFile(path.join(tempDir, updatedFile), JSON.stringify({ updated }));
  };

  /**
   * Updates the `status.json` file.
   * @param {String} [status=Idle] - The status which will be set to in the `status.json` file.
   */
  setStatus(status = "Idle") {
    fs.writeFile(path.join(tempDir, statusFile), JSON.stringify({ status }));
  };

  /**
   * Error logger function.
   * @param {String} errorMessage - The error message you want to display.
   * @returns {Error} - A new error with the given error message.
   */
  onError(errorMessage) {
    console.error(errorMessage);
    return new Error(errorMessage);
  };

  /**
   * Search for a key in an array of object.
   * @param {String} key - The key to search for.
   * @param {String} value - The value of the key to search for.
   * @return {Object} - The object with the correct key-value pair.
   */
  search(key, value) {
    return element => element[key] === value;
  };

  /** Reset the default log file. */
  resetLog() {
    const logFile = path.join(tempDir, `${name}.log`);
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  };

};
