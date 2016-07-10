// Import the neccesary modules.
import asyncq from "async-q";
import katApi from "kat-api-pt";
import { global } from "../../config/constants";
import Helper from "./helper";
import Util from "../../util";

export default class KAT {

  constructor(name) {
    this.name = name;

    this.helper = new Helper(this.name);
    this.kat = new katApi();
    this.util = new Util();
  };

  /**
   * @description Get all the animes.
   * @function KAT#getAnime
   * @memberof module:providers/anime/kat
   * @param {Object} katAnime - The anime information.
   * @returns {Anime} - An anime.
   */
  async getAnime(katAnime) {
    try {
      const newAnime = await this.helper.getHummingbirdInfo(katAnime.slug);
      if (newAnime && newAnime._id) {
        const slug = katAnime.slug;

        delete katAnime.animeTitle;
        delete katAnime.slug;
        delete katAnime.torrentLink;
        delete katAnime.episode;
        delete katAnime.quality;

        if (newAnime.type.toLowerCase() === "movie") {
            console.log(newAnime.title);
        } else if (newAnime.type.toLowerCase() === "show") {
          return await this.helper.addEpisodes(newAnime, katAnime, slug);
        }
      }
    } catch (err) {
      return this.util.onError(err);
    }
  };

  /**
   * @description Extract anime information based on a regex.
   * @function KAT#extractAnime
   * @memberof module:providers/anime/kat
   * @param {Object} torrent - The torrent to extract the anime information from.
   * @param {Regex} regex - The regex to extract the anime information.
   * @returns {Object} - Information about a anime from the torrent.
   */
  extractAnime(torrent, regex) {
    let animeTitle = torrent.title.match(regex)[1];
    if (animeTitle.endsWith(" ")) animeTitle = animeTitle.substring(0, animeTitle.length - 1);
    animeTitle = animeTitle.replace(/\./g, " ");
    let slug = animeTitle.replace(/\s+/g, "-").toLowerCase();
    // slug = slug in katMap ? katMap[slug] : slug;
    let episode = parseInt(torrent.title.match(regex)[2], 10);
    const quality = torrent.title.match(regex)[3];

    const episodeTorrent = {
      url: torrent.magnet,
      seeds: torrent.seeds,
      peers: torrent.peers,
      provider: this.name
    };

    const anime = { animeTitle, slug, torrentLink: torrent.link, episode, quality };

    if (!anime[episode]) anime[episode] = {};
    if ((!anime[episode][quality] || anime.animeTitle.toLowerCase().indexOf("repack") > -1) || (anime[episode][quality] && anime[episode][quality].seeds < episodeTorrent.seeds))
      anime[episode][quality] = episodeTorrent;

    return anime;
  };

  /**
   * @description Get anime info from a given torrent.
   * @function KAT#getAnimeData
   * @memberof module:providers/anime/kat
   * @param {Object} torrent - A torrent object to extract anime information
   * from.
   * @returns {Object} - Information about an anime from the torrent.
   */
  getAnimeData(torrent) {
    const horribleSubs = /\[horriblesubs\].(.*)...(\d{2,3}).\[(\d{3,4}p)\]/i

    if (torrent.title.match(horribleSubs)) {
      return this.extractAnime(torrent, horribleSubs);
    } else {
      console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
    }
  };

  /**
   * @description Puts all the found animes from the torrents in an array.
   * @function KAT#getAllKATAnimes
   * @memberof module:providers/anime/kat
   * @param {Array} torrents - A list of torrents to extract anime information.
   * @returns {Array} - A list of objects with anime information extracted from
   * the torrents.
   */
  async getAllKATAnimes(torrents) {
    try {
      const animes = [];
      await asyncq.mapSeries(torrents, torrent => {
        if (torrent) {
          const anime = this.getAnimeData(torrent);
          if (anime) {
            if (animes.length != 0) {
              const { animeTitle, slug, episode, quality } = anime;
              const matching = animes
                .filter(a => a.animeTitle === animeTitle)
                .filter(a => a.slug === slug);

              if (matching.length != 0) {
                const index = animes.indexOf(matching[0]);
                if (!matching[0][episode]) matching[0][episode] = {};
                if ((!matching[0][episode][quality] || matching[0].animeTitle.toLowerCase().indexOf("repack") > -1) || (matching[0][episode][quality] && matching[0][episode][quality].seeds < anime[episode][quality].seeds))
                  matching[0][episode][quality] = anime[episode][quality];

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
      return this.util.onError(err);
    }
  };

  /**
   * @description Get all the torrents of a given provider.
   * @function KAT#getAllTorrents
   * @memberof module:providers/anime/kat
   * @param {Integer} totalPages - The total pages of the query.
   * @param {Object} provider - The provider to query {@link https://kat.cr/}.
   * @returns {Array} - A list of all the queried torrents.
   */
  async getAllTorrents(totalPages, provider) {
    try {
      let katTorrents = [];
      await asyncq.timesSeries(totalPages, async page => {
        try {
          provider.query.page = page + 1;
          console.log(`${this.name}: Starting searching kat on page ${provider.query.page} out of ${totalPages}`);
          const result = await this.kat.search(provider.query);
          katTorrents = katTorrents.concat(result.results);
        } catch (err) {
          return this.util.onError(err);
        }
      });
      console.log(`${this.name}: Found ${katTorrents.length} torrents.`);
      return katTorrents;
    } catch (err) {
      return this.util.onError(err);
    }
  };

  /**
   * @description Returns a list of all the inserted torrents.
   * @function KAT#search
   * @memberof module:providers/anime/kat
   * @param {Object} provider - The provider to query {@link https://kat.cr/}.
   * @returns {Array} - A list of scraped animes.
   */
  async search(provider) {
    try {
      console.log(`${this.name}: Starting scraping...`);
      provider.query.page = 1;
      provider.query.category = "english-translated";
      provider.query.verified = 1;
      provider.query.adult_filter = 1;

      const getTotalPages = await this.kat.search(provider.query);
      let totalPages = getTotalPages.totalPages; // Change to 'const' for production.
      if (!totalPages) return this.util.onError(`${this.name}: totalPages returned: '${totalPages}'`);
      totalPages = 3; // For testing purposes only.
      console.log(`${this.name}: Total pages ${totalPages}`);

      const katTorrents = await this.getAllTorrents(totalPages, provider);
      const katAnimes = await this.getAllKATAnimes(katTorrents);
      return await asyncq.mapLimit(katAnimes, global.maxWebRequest,
        katAnime => this.getAnime(katAnime).catch(err => this.util.onError(err)));
    } catch (err) {
      this.util.onError(err);
    }
  };

};
