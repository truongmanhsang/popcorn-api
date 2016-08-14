// Import the neccesary modules.
import asyncq from "async-q";

import BaseExtractor from "./baseextractor";
import Helper from "../helpers/animehelper";
import Util from "../../util";
import { maxWebRequest, animeMap } from "../../config/constants";

/** Class for extracting anime shows from torrents. */
export default class Extractor extends BaseExtractor {

  /**
   * Create an extractor object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  constructor(name, contentProvider, debug) {
    super(name, contentProvider);

    /**
     * The helper object for adding anime shows.
     * @type {Helper}
     */
    this._helper = new Helper(this.name, debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new Util();
  };

  /**
   * Get all the animes.
   * @param {Object} anime - The anime information.
   * @returns {Anime} - An anime.
   */
  async getAnime(anime) {
    try {
      const newAnime = await this._helper.getHummingbirdInfo(anime.slug);
      if (newAnime && newAnime._id) {
        delete anime.episodes[0];
        return await this._helper.addEpisodes(newAnime, anime.episodes, anime.slug);
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
    slug = slug in animeMap ? animeMap[slug] : slug;

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
      url: torrent.torrent_link ? torrent.torrent_link : torrent.magnet,
      seeds: torrent.seeds ? torrent.seeds : 0,
      peers: torrent.peers ? torrent.peers : 0,
      provider: this.name
    };

    const anime = {
      animeTitle,
      slug,
      torrentLink: torrent.link,
      season,
      episode,
      quality
    };
    anime.episodes = {};

    if (!anime.episodes[season]) anime.episodes[season] = {};
    if (!anime.episodes[season][episode]) anime.episodes[season][episode] = {};
    if (!anime.episodes[season][episode][quality] || (anime.episodes[season][episode][quality] && anime.episodes[season][episode][quality].seed < episodeTorrent.seed))
      anime.episodes[season][episode][quality] = episodeTorrent;

    return anime;
  };

  /**
   * Get anime info from a given torrent.
   * @param {Object} torrent - A torrent object to extract anime information from.
   * @returns {Object} - Information about an anime from the torrent.
   */
  _getAnimeData(torrent) {
    const secondSeason = /\[horriblesubs\].(.*).S(\d)...(\d{2,3}).\[(\d{3,4}p)\]/i;
    const oneSeason = /\[horriblesubs\].(.*)...(\d{2,3}).\[(\d{3,4}p)\]/i;
    const animerg = /\[animerg\]\s+(\D+)\s\-\s(\d{3}|\d{2})\D+(\d{3,4}p)/i;
    if (torrent.title.match(secondSeason)) {
      return this._extractAnime(torrent, secondSeason);
    } else if  (torrent.title.match(oneSeason)) {
      return this._extractAnime(torrent, oneSeason);
    } else if (torrent.title.match(animerg)) {
      return this._extractAnime(torrent, animerg);
    } else {
      logger.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
    }
  };

  /**
   * Puts all the found animes from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract anime information.
   * @returns {Array} - A list of objects with anime information extracted from the torrents.
   */
  async _getAllAnimes(torrents) {
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
                if (!matching[0].episodes[season]) matching[0].episodes[season] = {};
                if (!matching[0].episodes[season][episode]) matching[0].episodes[season][episode] = {};
                if (!matching[0].episodes[season][episode][quality] || (matching[0].episodes[season][episode][quality] && matching[0].episodes[season][episode][quality].seed < anime.episodes[season][episode][quality].seed))
                  matching[0].episodes[season][episode][quality] = anime.episodes[season][episode][quality];

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
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query the content provider.
   * @returns {Anime[]} - A list of scraped anime shows.
   */
  async search(provider) {
    try {
      const getTotalPages = await this._contentProvider.search(provider.query);
      const totalPages = getTotalPages.total_pages; // Change to 'const' for production.
      if (!totalPages) return this._util.onError(`${this.name}: total_pages returned: '${totalPages}'`);
      // totalPages = 3; // For testing purposes only.
      logger.info(`${this.name}: Total pages ${totalPages}`);

      const torrents = await this._getAllTorrents(totalPages, provider);
      const animes = await this._getAllAnimes(torrents);
      return await asyncq.mapLimit(animes, maxWebRequest, anime => this.getAnime(anime));
    } catch (err) {
      this._util.onError(err);
    }
  };

};
