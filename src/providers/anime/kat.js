// Import the neccesary modules.
import asyncq from "async-q";
import KatAPI from "kat-api-pt";
import { maxWebRequest, katAnimeMap } from "../../config/constants";
import Helper from "./helper";
import Util from "../../util";

/** Class for scraping anime shows from https://kat.cr/. */
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
     * The helper object for adding anime shows.
     * @type {Helper}
     */
    this._helper = new Helper(this.name, debug);

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
   * Get all the animes.
   * @param {Object} katAnime - The anime information.
   * @returns {Anime} - An anime.
   */
  async _getAnime(katAnime) {
    try {
      const newAnime = await this._helper.getHummingbirdInfo(katAnime.slug);
      if (newAnime && newAnime._id) {
        const slug = katAnime.slug;

        delete katAnime.animeTitle;
        delete katAnime.slug;
        delete katAnime.torrentLink;
        delete katAnime.season;
        delete katAnime.episode;
        delete katAnime.quality;

        return await this._helper.addEpisodes(newAnime, katAnime, slug);
      }
    } catch (err) {
      return this._util.onError(err);
    }
  };

  /**
   * Extract anime information based on a regex.
   * @param {Object} torrent - The torrent to extract the anime information from.
   * @param {Regex} regex - The regex to extract the anime information.
   * @returns {Object} - Information about a anime from the torrent.
   */
  _extractAnime(torrent, regex) {
    let animeTitle = torrent.title.match(regex)[1];
    if (animeTitle.endsWith(" ")) animeTitle = animeTitle.substring(0, animeTitle.length - 1);
    animeTitle = animeTitle.replace(/\./g, " ");
    let slug = animeTitle.replace(/[!]/gi, "").replace(/\s-\s/gi, "").replace(/\s+/g, "-").toLowerCase();
    slug = slug in katAnimeMap ? katAnimeMap[slug] : slug;

    let season, episode, quality;
    if (torrent.title.match(regex).length >= 5) {
      season = parseInt(torrent.title.match(regex)[2], 10);
      episode = parseInt(torrent.title.match(regex)[3], 10);
      quality = torrent.title.match(regex)[4];
    } else {
      season = 1;
      episode = parseInt(torrent.title.match(regex)[2], 10);
      quality = torrent.title.match(regex)[3];
    }

    const episodeTorrent = {
      url: torrent.magnet,
      seed: torrent.seeds,
      peer: torrent.peers,
      provider: this.name
    };

    const anime = { animeTitle, slug, torrentLink: torrent.link, season, episode, quality };

    if (!anime[season]) anime[season] = {};
    if (!anime[season][episode]) anime[season][episode] = {};
    if (!anime[season][episode][quality] || (anime[season][episode][quality] && anime[season][episode][quality].seed < episodeTorrent.seed))
      anime[season][episode][quality] = episodeTorrent;

    return anime;
  };

  /**
   * Get anime info from a given torrent.
   * @param {Object} torrent - A torrent object to extract anime information from.
   * @returns {Object} - Information about an anime from the torrent.
   */
  _getAnimeData(torrent) {
    const secondSeason = /\[horriblesubs\].(.*).S(\d)...(\d{2,3}).\[(\d{3,4}p)\]/i;
    if (torrent.title.match(secondSeason)) {
      return this._extractAnime(torrent, secondSeason);
    } else {
      console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
    }
  };

  /**
   * Puts all the found animes from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract anime information.
   * @returns {Array} - A list of objects with anime information extracted from the torrents.
   */
  async _getAllKATAnimes(torrents) {
    try {
      const animes = [];
      await asyncq.mapSeries(torrents, torrent => {
        if (torrent) {
          const anime = this._getAnimeData(torrent);
          if (anime) {
            if (animes.length != 0) {
              const { animeTitle, slug, season, episode, quality } = anime;
              const matching = animes
                .filter(a => a.animeTitle === animeTitle)
                .filter(a => a.slug === slug);

              if (matching.length != 0) {
                const index = animes.indexOf(matching[0]);
                if (!matching[0][season]) matching[0][season] = {};
                if (!matching[0][season][episode]) matching[0][season][episode] = {};
                if (!matching[0][season][episode][quality] || (matching[0][season][episode][quality] && matching[0][season][episode][quality].seed < anime[season][episode][quality].seed))
                  matching[0][season][episode][quality] = anime[season][episode][quality];

                animes.splice(index, 1, matching[0]);
              } else {
                animes.push(anime);
              }
            } else {
              animes.push(anime);
            }
          }
        }
      });
      return animes;
    } catch (err) {
      return this._util.onError(err);
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
   * @returns {Array} - A list of scraped anime shows.
   */
  async search(provider) {
    try {
      console.log(`${this.name}: Starting scraping...`);
      provider.query.page = 1;
      provider.query.category = "english-translated";
      provider.query.verified = 1;
      provider.query.adult_filter = 1;

      const getTotalPages = await this._kat.search(provider.query);
      const totalPages = getTotalPages.totalPages; // Change to 'const' for production.
      if (!totalPages) return this._util.onError(`${this.name}: totalPages returned: '${totalPages}'`);
      // totalPages = 3; // For testing purposes only.
      console.log(`${this.name}: Total pages ${totalPages}`);

      const katTorrents = await this._getAllTorrents(totalPages, provider);
      const katAnimes = await this._getAllKATAnimes(katTorrents);
      return await asyncq.mapLimit(katAnimes, maxWebRequest,
        katAnime => this._getAnime(katAnime).catch(err => this._util.onError(err)));
    } catch (err) {
      this._util.onError(err);
    }
  };

};
