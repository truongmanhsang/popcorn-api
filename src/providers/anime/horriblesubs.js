// Import the neccesary modules.
import asyncq from "async-q";
import HorribleSubsAPI from "horriblesubs-api";
import { maxWebRequest } from "../../config/constants";
import Helper from "./helper";
import Util from "../../util";

/** Class for scraping anime from https://horriblesubs.info/. */
export default class HorribleSubs {

  /**
   * Create a horriblesubs object.
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
     * A configured HorribleSubs API.
     * @type {HorribleSubsAPI}
     * @see https://github.com/ChrisAlderson/horriblesubs-api
     */
    this.horriblesubs = new HorribleSubsAPI({ debug });

    /**
     * The helper object for adding anime shows.
     * @type {Helper}
     */
    this.helper = new Helper(this.name, debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this.util = new Util();
  };

  /**
   * Get a complete show.
   * @param {Object} horribleSubsAnime - anime data from horriblesubs.
   * @returns {Anime} - A complete show.
   */
  async getAnime(horribleSubsAnime) {
    try {
      if (horribleSubsAnime) {
        horribleSubsAnime = await this.horriblesubs.getAnimeData(horribleSubsAnime);
        const newShow = await this.helper.getHummingbirdInfo(horribleSubsAnime.slug);

        if (newShow && newShow._id) {
          delete horribleSubsAnime.episodes[0];
          return await this.helper.addEpisodes(newShow, horribleSubsAnime.episodes, horribleSubsAnime.slug);
        }
      }
    } catch (err) {
      return this.util.onError(err);
    }
  };

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Array} - A list of scraped animes.
   */
  async search() {
    try {
      console.log(`${this.name}: Starting scraping...`);
      const horribleSubsAnimes = await this.horriblesubs.getAllAnime();
      console.log(`${this.name}: Found ${horribleSubsAnimes.length} anime shows.`);
      return await asyncq.mapLimit(horribleSubsAnimes, maxWebRequest, async horribleSubsAnime => {
        try {
          return await this.getAnime(horribleSubsAnime);
        } catch (err) {
          return this.util.onError(err);
        }
      });
    } catch (err) {
      return this.util.onError(err);
    }
  };

};
