// Import the neccesary modules.
import asyncq from "async-q";
import { movieProviders, showProviders } from "./config/providers";
import EZTV from "./providers/show/eztv";
import katMovie from "./providers/movie/kat";
import katShow from "./providers/show/kat";
import Util from "./util";
import YTS from "./providers/movie/yts";

/**
 * @class
 * @classdesc The factory function for scraping movies and shows.
 * @memberof module:global/scraper
 * @property {Object} util - The util object with general functions.
 */
const Scraper = () => {

  const util = Util();

  /**
   * @description Start scraping from EZTV.
   * @function Scraper#scrapeEZTVShows
   * @memberof module:global/scraper
   * @returns {Array} A list of all the scraped shows.
   */
  const scrapeEZTVShows = async() => {
    try {
      const eztv = EZTV("EZTV");
      util.setStatus(`Scraping ${eztv.name}`);
      const eztvShows = await eztv.search();
      console.log(`EZTV: Done.`);
      return eztvShows;
    } catch (err) {
      return util.onError(err);
    }
  };

  /**
   * @description Start movie scraping from KAT.
   * @function Scraper#scrapeKATMovies
   * @memberof module:global/scraper
   * @returns {Array} A list of all the scraped movies.
   */
  const scrapeKATMovies = () => {
    return asyncq.eachSeries(movieProviders, async provider => {
      try {
        util.setStatus(`Scraping ${provider.name}`);
        const katProvider = katMovie(provider.name);
        const katShows = await katProvider.search(provider);
        console.log(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return util.onError(err);
      }
    });
  };

  /**
   * @description Start show scraping from KAT.
   * @function Scraper#scrapeKATShows
   * @memberof module:global/scraper
   * @returns {Array} A list of all the scraped shows.
   */
  const scrapeKATShows = () => {
    return asyncq.eachSeries(showProviders, async provider => {
      try {
        util.setStatus(`Scraping ${provider.name}`);
        const katProvider = katShow(provider.name);
        const katShows = await katProvider.search(provider);
        console.log(`${provider.name}: Done.`);
        return katShows;
      } catch (err) {
        return util.onError(err);
      }
    });
  };

  /**
   * @description Start scraping from YTS.
   * @function Scraper#scrapeYTSMovies
   * @memberof module:global/scraper
   * @returns {Array} A list of all the scraped movies.
   */
  const scrapeYTSMovies = async() => {
    try {
      const yts = YTS("YTS");
      util.setStatus(`Scraping ${yts.name}`);
      const ytsMovies = await yts.search();
      console.log("YTS Done.");
      return ytsMovies;
    } catch (err) {
      return util.onError(err);
    }
  };

  /**
   * @description Initiate the scraping for EZTV and KAT.
   * @function Scraper#scrape
   * @memberof module:global/scraper
   */
  const scrape = () => {
    util.setLastUpdated();

    asyncq.eachSeries([scrapeEZTVShows, scrapeKATShows, scrapeYTSMovies, scrapeKATMovies],
        scraper => scraper())
      .then(value => util.setStatus())
      .catch(err => util.onError(`Error while scraping: ${err}`));
  };

  // Return the public functions.
  return { scrape };

};

// Export the scraper factory function.
export default Scraper;
