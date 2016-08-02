// Import the neccesary modules.
import asyncq from "async-q";
import KatAPI from "kat-api-pt";
import { maxWebRequest, katShowMap } from "../../config/constants";
import Helper from "./helper";
import Util from "../../util";

/** Class for scraping shows from https://kat.cr/. */
export default class KAT {

   /**
    * Create a kat object.
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
     * The helper object for adding shows.
     * @type {Helper}
     */
    this._helper = new Helper(this.name);

    /**
     * A configured KAT API.
     * @type {KatAPI}
     * @see https://github.com/ChrisAlderson/kat-api-pt
     */
    this._kat = new KatAPI({ debug });

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new Util();

  };

  /**
   * Get all the shows.
   * @param {Object} katShow - The show information.
   * @returns {Show} - A show.
   */
  async _getShow(katShow) {
    try {
      const newShow = await this._helper.getTraktInfo(katShow.slug);
      if (newShow && newShow._id) {
        const slug = katShow.slug;

        delete katShow.showTitle;
        delete katShow.slug;
        delete katShow.torrentLink;
        delete katShow.season;
        delete katShow.episode;
        delete katShow.quality;
        delete katShow.dateBased;
        delete katShow[0];
        return await this._helper.addEpisodes(newShow, katShow, slug);
      }
    } catch (err) {
      return this._util.onError(err);
    }
  };

  /**
   * Extract show information based on a regex.
   * @param {Object} torrent - The torrent to extract the show information from.
   * @param {Regex} regex - The regex to extract the show information.
   * @param {Boolean} dateBased - Check for dateBased episodes.
   * @returns {Object} - Information about a show from the torrent.
   */
  _extractShow(torrent, regex, dateBased) {
    let showTitle = torrent.title.match(regex)[1];
    if (showTitle.endsWith(" ")) showTitle = showTitle.substring(0, showTitle.length - 1);
    showTitle = showTitle.replace(/\./g, " ");
    let slug = showTitle.replace(/\s+/g, "-").toLowerCase();
    slug = slug in katShowMap ? katShowMap[slug] : slug;
    let season = torrent.title.match(regex)[2];
    let episode = torrent.title.match(regex)[3];
    if (!dateBased) {
      season = parseInt(season, 10);
      episode = parseInt(episode, 10);
    }
    const quality = torrent.title.match(/(\d{3,4})p/) !== null ? torrent.title.match(/(\d{3,4})p/)[0] : "480p";

    const episodeTorrent = {
      url: torrent.magnet,
      seeds: torrent.seeds,
      peers: torrent.peers,
      provider: this.name
    };

    const show = { showTitle, slug, torrentLink: torrent.link, season, episode, quality, dateBased };

    if (!show[season]) show[season] = {};
    if (!show[season][episode]) show[season][episode] = {};
    if ((!show[season][episode][quality] || show.showTitle.toLowerCase().indexOf("repack") > -1) || (show[season][episode][quality] && show[season][episode][quality].seeds < episodeTorrent.seeds))
      show[season][episode][quality] = episodeTorrent;

    return show;
  };

  /**
   * Get show info from a given torrent.
   * @param {Object} torrent - A torrent object to extract show information from.
   * @returns {Object} - Information about a show from the torrent.
   */
  _getShowData(torrent) {
    const seasonBased = /(.*).[sS](\d{2})[eE](\d{2})/;
    const vtv = /(.*).(\d{1,2})[x](\d{2})/;
    const dateBased = /(.*).(\d{4}).(\d{2}.\d{2})/;
    if (torrent.title.match(seasonBased)) {
      return this._extractShow(torrent, seasonBased, false);
    } else if (torrent.title.match(vtv)) {
      return this._extractShow(torrent, vtv, false);
    } else if (torrent.title.match(dateBased)) {
      return this._extractShow(torrent, dateBased, true);
    } else {
      console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
    }
  };

  /**
   * Puts all the found shows from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract show information.
   * @returns {Array} - A list of objects with show information extracted from the torrents.
   */
  async _getAllKATShows(torrents) {
    try {
      const shows = [];

      await asyncq.mapSeries(torrents, torrent => {
        if (torrent) {
          const show = this._getShowData(torrent);
          if (show) {
            if (shows.length != 0) {
              const { showTitle, slug, season, episode, quality } = show;
              const matching = shows
                .filter(s => s.showTitle === showTitle)
                .filter(s => s.slug === slug);

              if (matching.length != 0) {
                const index = shows.indexOf(matching[0]);
                if (!matching[0][season]) matching[0][season] = {};
                if (!matching[0][season][episode]) matching[0][season][episode] = {};
                if ((!matching[0][season][episode][quality] || matching[0].showTitle.toLowerCase().indexOf("repack") > -1) || (matching[0][season][episode][quality] && matching[0][season][episode][quality].seeds < show[season][episode][quality].seeds))
                  matching[0][season][episode][quality] = show[season][episode][quality];

                shows.splice(index, 1, matching[0]);
              } else {
                shows.push(show);
              }
            } else {
              shows.push(show);
            }
          }
        }
      });

      return shows;
    } catch (err) {
      this._util.onError(err);
    }
  };

  /**
   * Get all the torrents of a given provider.
   * @param {Integer} totalPages - The total pages of the query.
   * @param {Object} provider - The provider to query https://kat.cr/.
   * @returns {Array} - A list of all the queried torrents.
   */
  async _getAllTorrents(totalPages, provider) {
    try {
      let katTorrents = [];
      await asyncq.timesSeries(totalPages, async page => {
        try {
          provider.query.page = page + 1;
          console.log(`${this.name}: Starting searching KAT on page ${provider.query.page} out of ${totalPages}`);
          const result = await this._kat.search(provider.query);
          katTorrents = katTorrents.concat(result.results);
        } catch (err) {
          return this._util.onError(err);
        }
      });
      console.log(`${this.name}: Found ${katTorrents.length} torrents.`);
      return katTorrents;
    } catch (err) {
      return this._util.onError(err);
    }
  };

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query https://kat.cr/.
   * @returns {Array} - A list of scraped shows.
   */
  async search(provider) {
    try {
      console.log(`${this.name} : Starting scraping...`);
      provider.query.page = 1;
      provider.query.category = "tv";
      provider.query.verified = 1;
      provider.query.adult_filter = 1;
      provider.query.language = "en";

      const getTotalPages = await this._kat.search(provider.query);
      const totalPages = getTotalPages.totalPages; // Change to 'const' for production.
      if (!totalPages) return this._util.onError(`${this.name}: totalPages returned; '${totalPages}'`);
      // totalPages = 3; // For testing purposes only.
      console.log(`${this.name}: Total pages ${totalPages}`);

      const katTorrents = await this._getAllTorrents(totalPages, provider);
      const katShows = await this._getAllKATShows(katTorrents);
      return await asyncq.mapLimit(katShows, maxWebRequest, async katShow => {
        try {
          return await this._getShow(katShow);
        } catch (err) {
          return this._util.onError(err);
        }
      });
    } catch (err) {
      return this._util.onError(err);
    }
  };

};
