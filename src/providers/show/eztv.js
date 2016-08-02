// Import the neccesary modules.
import asyncq from "async-q";
import EztvAPI from "eztv-api-pt";
import { maxWebRequest } from "../../config/constants";
import Helper from "./helper";
import Util from "../../util";

/** Class for scraping shows from https://eztv.ag/. */
export default class EZTV {

  /**
   * Create an eztv object.
   * @param {String} name - The name of the torrent provider.
   * @param {Boolean} debug - Debug mode for extra output.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}  The name of the torrent provider.
     */
    this.name = name;

    /**
     * A configured EZTV API.
     * @type {EztvAPI}
     * @see https://github.com/ChrisAlderson/eztv-api-pt
     */
    this.eztv = new EztvAPI({ debug });

    /**
     * The helper object for adding shows.
     * @type {Helper}
     */
    this.helper = new Helper(this.name);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this.util = new Util();
  };

  /**
   * Get a complete show.
   * @param {Object} eztvShow - show data from eztv.
   * @returns {Show} - A complete show.
   */
  async getShow(eztvShow) {
    try {
      if (eztvShow) {
        eztvShow = await this.eztv.getShowData(eztvShow);
        const newShow = await this.helper.getTraktInfo(eztvShow.slug);

        if (newShow && newShow._id) {
          delete eztvShow.episodes.dateBased;
          delete eztvShow.episodes[0];
          return await this.helper.addEpisodes(newShow, eztvShow.episodes, eztvShow.slug);
        }
      }
    } catch (err) {
      return this.util.onError(err);
    }
  };

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Array} - A list of scraped shows.
   */
  async search() {
    try {
      console.log(`${this.name}: Starting scraping...`);
      const eztvShows = await this.eztv.getAllShows();
      console.log(`${this.name}: Found ${eztvShows.length} shows.`);
      return await asyncq.mapLimit(eztvShows, maxWebRequest, async eztvShow => {
        try {
          return await this.getShow(eztvShow);
        } catch (err) {
          return this.util.onError(err);
        }
      });
    } catch (err) {
      return this.util.onError(err);
    }
  };

};
