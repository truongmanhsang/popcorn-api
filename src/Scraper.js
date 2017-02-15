
// Import the neccesary modules.
import asyncq from 'async-q';

import EZTV from './providers/shows/EZTV';
import HorribleSubs from './providers/anime/HorribleSubs';
import ExtraTorrentAnime from './providers/anime/ExtraTorrent';
import ExtraTorrentMovie from './providers/movies/ExtraTorrent';
import ExtraTorrentShow from './providers/shows/ExtraTorrent';
import KatAnime from './providers/anime/KAT';
import KatMovie from './providers/movies/KAT';
import KatShow from './providers/shows/KAT';
import Nyaa from './providers/anime/Nyaa';
import YTS from './providers/movies/YTS';
import {
  exportCollection,
  onError,
  setLastUpdated,
  setStatus
} from './utils';
import {
  collections,
  extratorrentAnimeProviders,
  extratorrentMovieProviders,
  extratorrentShowProviders,
  katAnimeProviders,
  katMovieProviders,
  katShowProviders,
  nyaaAnimeProviders
} from './config/constants';

/** Class for scraping movies and shows. */
export default class Scraper {

  /**
   * Create a scraper object.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  constructor(debug) {
    /**
     * Debug mode for extra output.
     * @type {Boolean}
     */
    Scraper._debug = debug;
  }

  /**
   * Start show scraping from ExtraTorrent.
   * @returns {Show[]} A list of all the scraped shows.
   */
  _scrapeExtraTorrentShows() {
    return asyncq.concatSeries(extratorrentShowProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const extratorrentProvider = new ExtraTorrentShow(provider.name);
        const extratorrentShows = await extratorrentProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return extratorrentShows;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start scraping from EZTV.
   * @returns {Show[]} A list of all the scraped shows.
   */
  async _scrapeEZTVShows() {
    try {
      const eztv = new EZTV('EZTV', Scraper._debug);
      setStatus(`Scraping ${eztv.name}`);
      const eztvShows = await eztv.search();
      logger.info(`${eztv.name}: Done.`);
      return eztvShows;
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Start show scraping from KAT.
   * @returns {Show[]} A list of all the scraped shows.
   */
  _scrapeKATShows() {
    return asyncq.concatSeries(katShowProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const katProvider = new KatShow(provider.name, Scraper._debug);
        const katShows = await katProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start movie scraping from ExtraTorrent.
   * @returns {Movie[]} A list of all the scraped movies.
   */
  _scrapeExtraTorrentMovies() {
    return asyncq.concatSeries(extratorrentMovieProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const extratorrentProvider = new ExtraTorrentMovie(provider.name, Scraper._debug);
        const extratorrentMovies = await extratorrentProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return extratorrentMovies;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start movie scraping from KAT.
   * @returns {Movie[]} A list of all the scraped movies.
   */
  _scrapeKATMovies() {
    return asyncq.concatSeries(katMovieProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const katProvider = new KatMovie(provider.name, Scraper._debug);
        const katShows = await katProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start scraping from YTS.
   * @returns {Movie[]} A list of all the scraped movies.
   */
  async _scrapeYTSMovies() {
    try {
      const yts = new YTS('YTS');
      setStatus(`Scraping ${yts.name}`);
      const ytsMovies = await yts.search();
      logger.info(`${yts.name}: Done.`);
      return ytsMovies;
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Start anime scraping from ExtraTorrent.
   * @returns {Anime[]} A list of all the scraped movies.
   */
  _scrapeExtraTorrentAnime() {
    return asyncq.concatSeries(extratorrentAnimeProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const extratorrentProvider = new ExtraTorrentAnime(provider.name, Scraper._debug);
        const extratorrentAnimes = await extratorrentProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return extratorrentAnimes;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start scraping from HorribleSubs.
   * @returns {Anime[]} A list of all the scraped anime.
   */
  async _scrapeHorribleSubsAnime() {
    try {
      const horribleSubs = new HorribleSubs('HorribleSubs', Scraper._debug);
      setStatus(`Scraping ${horribleSubs.name}`);
      const horribleSubsAnime = await horribleSubs.search();
      logger.info(`${horribleSubs.name}: Done.`);
      return horribleSubsAnime;
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Start scraping from KAT.
   * @returns {Anime[]} A list of all the scraped anime.
   */
  _scrapeKATAnime() {
    return asyncq.concatSeries(katAnimeProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const katProvider = new KatAnime(provider.name, Scraper._debug);
        const katAnimes = await katProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return katAnimes;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Start scraping from Nyaa.
   * @returns {Anime[]} A list of all the scraped anime.
   */
  _scrapeNyaaAnime() {
    return asyncq.concatSeries(nyaaAnimeProviders, async provider => {
      try {
        setStatus(`Scraping ${provider.name}`);
        const nyaaProvider = new Nyaa(provider.name, Scraper._debug);
        const nyaaAnimes = await nyaaProvider.search(provider);
        logger.info(`${provider.name}: Done.`);
        return nyaaAnimes;
      } catch (err) {
        return onError(err);
      }
    });
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    setLastUpdated();

    asyncq.eachSeries([
      this._scrapeEZTVShows,
      this._scrapeExtraTorrentShows,
      // this._scrapeKATShows,

      this._scrapeExtraTorrentMovies,
      // this._scrapeKATMovies,
      this._scrapeYTSMovies,

      this._scrapeExtraTorrentAnime,
      this._scrapeHorribleSubsAnime,
      // this._scrapeKATAnime,
      this._scrapeNyaaAnime
    ], scraper => scraper())
      .then(() => setStatus())
      .then(() => asyncq.eachSeries(collections, collection => exportCollection(collection)))
      .catch(err => onError(`Error while scraping: ${err}`));
  }

}
