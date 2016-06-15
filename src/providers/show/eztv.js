// Import the neccesary modules.
import asyncq from "async-q";
import eztvApi from "eztv-api-pt";
import { global } from "../../config/global";
import Helper from "./helper";
import Util from "../../util";

/**
 * @class
 * @classdesc The factory function for scraping shows from {@link https://eztv.ag/}.
 * @memberof module:providers/show/eztv
 * @param {String} name - The name of the EZTV provider.
 * @property {Object} helper - The helper object for adding shows.
 * @property {Object} util - The util object with general functions.
 */
const EZTV = name => {

  const eztv = eztvApi();
  const helper = Helper(name);
  const util = Util();

  /**
   * @description Get a complete show.
   * @function EZTV#getShow
   * @memberof module:providers/show/eztv
   * @param {Object} eztvShow - show data from eztv.
   * @returns {Show} - A complete show.
   */
  const getShow = async eztvShow => {
    try {
      if (eztvShow) {
        eztvShow = await eztv.getShowData(eztvShow);
        const newShow = await helper.getTraktInfo(eztvShow.slug);

        if (newShow && newShow._id) {
          delete eztvShow.episodes.dateBased;
          delete eztvShow.episodes[0];
          return await helper.addEpisodes(newShow, eztvShow.episodes, eztvShow.slug);
        }
      }
    } catch (err) {
      return util.onError(err);
    }
  };

  /**
   * @description Returns a list of all the inserted torrents.
   * @function EZTV#search
   * @memberof module:providers/show/eztv
   * @returns {Array} - A list of scraped shows.
   */
  const search = async() => {
    try {
      console.log(`${name}: Starting scraping...`);
      const eztvShows = await eztv.getAllShows();
      console.log(`${name}: Found ${eztvShows.length} shows.`);
      return await asyncq.mapLimit(eztvShows, global.maxWebRequest, async eztvShow => {
        try {
          return await getShow(eztvShow);
        } catch (err) {
          return util.onError(err);
        }
      });
    } catch (err) {
      return util.onError(err);
    }
  };

  // Return the public functions.
  return { name, search };

};

// Export the eztv factory function.
export default EZTV;
