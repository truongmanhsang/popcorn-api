// Import the neccesary modules.
import asyncq from "async-q";
import { animeProviders, movieProviders, showProviders } from "./config/constants";
import EZTV from "./providers/show/eztv";
import HorribleSubs from "./providers/anime/horriblesubs";
import katAnime from "./providers/anime/kat";
import katMovie from "./providers/movie/kat";
import katShow from "./providers/show/kat";
import Util from "./util";
import YTS from "./providers/movie/yts";

/** Class for scraping movies and shows. */
export default class Scraper {

  /**
   * Create a scraper object.
   * @param {Boolean} debug - Debug mode for extra output.
   */
  constructor(debug) {
    /**
     * The util object with general functions.
     * @property {Object}
     */
    Scraper.util = new Util();

    /**
     * Debug mode for extra output.
     * @type {Object}
     */
    Scraper.debug = debug;
  };

  /**
   * Start scraping from EZTV.
   * @returns {Array} A list of all the scraped shows.
   */
  async scrapeEZTVShows() {
    try {
      const eztv = new EZTV("EZTV", Scraper.debug);
      Scraper.util.setStatus(`Scraping ${eztv.name}`);
      const eztvShows = await eztv.search();
      console.log(`${eztv.name}: Done.`);
      return eztvShows;
    } catch (err) {
      return Scraper.util.onError(err);
    }
  };

  /**
   * Start movie scraping from KAT.
   * @returns {Array} A list of all the scraped movies.
   */
  scrapeKATMovies() {
    return asyncq.eachSeries(movieProviders, async provider => {
      try {
        Scraper.util.setStatus(`Scraping ${provider.name}`);
        const katProvider = new katMovie(provider.name, Scraper.debug);
        const katShows = await katProvider.search(provider);
        console.log(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return Scraper.util.onError(err);
      }
    });
  };

  /**
   * Start show scraping from KAT.
   * @returns {Array} A list of all the scraped shows.
   */
  scrapeKATShows() {
    return asyncq.eachSeries(showProviders, async provider => {
      try {
        Scraper.util.setStatus(`Scraping ${provider.name}`);
        const katProvider = new katShow(provider.name, Scraper.debug);
        const katShows = await katProvider.search(provider);
        console.log(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return Scraper.util.onError(err);
      }
    });
  };

  /**
   * Start scraping from YTS.
   * @returns {Array} A list of all the scraped movies.
   */
  async scrapeYTSMovies() {
    try {
      const yts = new YTS("YTS");
      Scraper.util.setStatus(`Scraping ${yts.name}`);
      const ytsMovies = await yts.search();
      console.log(`${yts.name}: Done.`);
      return ytsMovies;
    } catch (err) {
      return Scraper.util.onError(err);
    }
  };

  /**
   * Start scraping from HorribleSubs.
   * @returns {Array} A list of all the scraped anime.
   */
  async scrapeHorribelSubsAnime() {
    try {
      const horribleSubs = new HorribleSubs("HorribleSubs", Scraper.debug);
      Scraper.util.setStatus(`Scraping ${horribleSubs.name}`);
      const horribleSubsAnime = await horribleSubs.search();
      console.log(`${horribleSubs.name}: Done.`);
      return horribleSubsAnime;
    } catch (err) {
      return Scraper.util.onError(err);
    }
  };

  /**
   * Start scraping from KAT.
   * @returns {Array} A list of all the scraped anime.
   */
  async scrapeKATAnime() {
    return asyncq.eachSeries(animeProviders, async provider => {
      try {
        Scraper.util.setStatus(`Scraping ${provider.name}`);
        const katProvider = new katAnime(provider.name, Scraper.debug);
        const katAnimes = await katProvider.search(provider);
        console.log(`${provider.name}: Done.`);
        return katAnimes;
      } catch (err) {
        return Scraper.util.onError(err);
      }
    });
  }

  /** Initiate the scraping for EZTV and KAT. */
  scrape() {
    Scraper.util.setLastUpdated();

    asyncq.eachSeries([
      this.scrapeEZTVShows,
      // this.scrapeKATShows,
      this.scrapeYTSMovies,
      // this.scrapeKATMovies,
      this.scrapeHorribelSubsAnime,
      // this.scrapeKATAnime
    ], scraper => scraper()).then(value => Scraper.util.setStatus())
      .catch(err => Scraper.util.onError(`Error while scraping: ${err}`));
  };

};
