// Import the neccesary modules.
import asyncq from 'async-q';
import Provider from 'butter-provider';

import BaseExtractor from './BaseExtractor';
import MovieHelper from '../helpers/MovieHelper';
import ShowHelper from '../helpers/ShowHelper';
import { AnimeShow, AnimeMovie } from '../../models/Anime';
import { maxWebRequest, animeMap } from '../../config/constants';
import { onError } from '../../utils';

/** Class for extracting anime shows from torrents. */
export default class AnimeExtractor extends BaseExtractor {

  /**
   * Create an extractor object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   */
  constructor(name, contentProvider) {
    super(name, contentProvider);

    /**
     * The helper object for adding anime movie.
     * @type {MovieHelper}
     */
    this._movieHhelper = new MovieHelper(this.name, AnimeMovie);

    /**
     * The helper object for adding anime shows.
     * @type {ShowHelper}
     */
    this._showHelper = new ShowHelper(this.name, AnimeShow);
  }

  /**
   * Get all the animes.
   * @param {Object} anime - The anime information.
   * @returns {Anime} - An anime.
   */
  async getAnime(anime) {
    try {
      switch (anime.type) {
      case Provider.ItemType.MOVIE:
        let newAnime = await this._movieHhelper.getTraktInfo(anime.slugYear);
        if (newAnime && newAnime._id) return await this._movieHhelper.addTorrents(newAnime, anime.torrents);
        break;
      case Provider.ItemType.TVSHOW:
        newAnime = await this._showHelper.getTraktInfo(anime.slug);
        if (newAnime && newAnime._id) {
          delete anime.episodes[0];
          return await this._showHelper.addEpisodes(newAnime, anime.episodes, anime.slug);
        }
        break;
      default:
        return onEror(`${anime.type} is not supported, '${anime.slug}'`);
        break;
      }
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Extract anime information based on a regex.
   * @param {Object} torrent - The torrent to extract the anime information from.
   * @param {Regex} regex - The regex to extract the anime information.
   * @param {String} type - Determine what kind of content it is.
   * @returns {Object} - Information about an anime from the torrent.
   */
  _extractAnime(torrent, regex, type) {
    let animeTitile, slug, episode;

    animeTitle = torrent.title.match(regex)[1];
    if (animeTitle.endsWith(' ')) animeTitle = animeTitle.substring(0, animeTitle.length - 1);
    animeTitle = animeTitle.replace(/_/g, ' ').replace(/\./g, ' ');

    slug = animeTitle.replace(/[^a-zA-Z0-9 ]/gi, '').replace(/\s+/g, '-').toLowerCase();
    if (slug.endsWith('-')) slug = slug.substring(0, slug.length - 1);
    slug = slug in animeMap ? animeMap[slug] : slug;

    const quality = torrent.title.match(/(\d{3,4})p/) !== null ? torrent.title.match(/(\d{3,4})p/)[0] : '480p';

    const season = 1;
    if (torrent.title.match(regex).length >= 4) {
      episode = parseInt(torrent.title.match(regex)[3], 10);
    } else {
      episode = parseInt(torrent.title.match(regex)[2], 10);
    }

    const episodeTorrent = {
      url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
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
      quality,
      type
    };
    anime.episodes = {};

    if (!anime.episodes[season]) anime.episodes[season] = {};
    if (!anime.episodes[season][episode]) anime.episodes[season][episode] = {};
    if (!anime.episodes[season][episode][quality] || (anime.episodes[season][episode][quality] && anime.episodes[season][episode][quality].seeds < episodeTorrent.seeds))
      anime.episodes[season][episode][quality] = episodeTorrent;

    return anime;
  }

  /**
   * Get anime info from a given torrent.
   * @param {Object} torrent - A torrent object to extract anime information from.
   * @param {String} type - Determine what kind of content it is.
   * @returns {Object} - Information about an anime from the torrent.
   */
  _getAnimeData(torrent, type) {
    const secondSeason = /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i;
    const oneSeason = /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i;
    if (torrent.title.match(secondSeason)) {
      return this._extractAnime(torrent, secondSeason, type);
    } else if (torrent.title.match(oneSeason)) {
      return this._extractAnime(torrent, oneSeason, type);
    }

    logger.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
  }

  /**
   * Puts all the found animes from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract anime information.
   * @param {String} type - Determine what kind of content it is.
   * @returns {Array} - A list of objects with anime information extracted from the torrents.
   */
  async _getAllAnimes(torrents, type) {
    try {
      const animes = [];
      await asyncq.mapSeries(torrents, torrent => {
        if (torrent) {
          const anime = this._getAnimeData(torrent, type);
          if (anime) {
            if (animes.length !== 0) {
              const { animeTitle, slug, season, episode, quality } = anime;
              const matching = animes
                .filter(a => a.animeTitle === animeTitle)
                .filter(a => a.slug === slug);

              if (matching.length !== 0) {
                const index = animes.indexOf(matching[0]);
                if (!matching[0].episodes[season]) matching[0].episodes[season] = {};
                if (!matching[0].episodes[season][episode]) matching[0].episodes[season][episode] = {};
                if (!matching[0].episodes[season][episode][quality] || (matching[0].episodes[season][episode][quality] && matching[0].episodes[season][episode][quality].seeds < anime.episodes[season][episode][quality].seeds))
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
      return onError(err);
    }
  }

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query the content provider.
   * @returns {Anime[]} - A list of scraped anime shows.
   */
  async search(provider) {
    try {
      provider.query.type = provider.query.type ? provider.query.type : Provider.ItemType.TVSHOW;

      const getTotalPages = await this._contentProvider.search(provider.query);
      const totalPages = getTotalPages.total_pages; // Change to 'const' for production.
      if (!totalPages) return onError(`${this.name}: total_pages returned: '${totalPages}'`);
      // totalPages = 3; // For testing purposes only.
      logger.info(`${this.name}: Total pages ${totalPages}`);

      const torrents = await this._getAllTorrents(totalPages, provider);
      const animes = await this._getAllAnimes(torrents, provider.query.type);
      return await asyncq.mapLimit(animes, maxWebRequest, anime => this.getAnime(anime));
    } catch (err) {
      return onError(err);
    }
  }

}
