// Import the neccesary modules.
import asyncq from "async-q";
import req from "request";
import Movie from "../../models/Movie";
import { global } from "../../config/global";
import Helper from "./helper";
import Util from "../../util";

/**
 * @class
 * @classdesc The factory function for scraping movies from {@link https://yts.ag/}.
 * @memberof module:providers/movie/yts
 * @param {String} name - The name of the YTS provider.
 * @property {Object} helper - The helper object for adding shows.
 * @property {Object} util - The util object with general functions.
 * @property {Object} request - The request object with added defaults.
 */
const YTS = name => {

  const helper = Helper(name);
  const util = Util();

  const request = req.defaults({
    "headers": {
      "Content-Type": "application/json"
    },
    "baseUrl": "https://yts.ag/api/v2/list_movies.json",
    "timeout": global.webRequestTimeout * 1000
  });

  /**
   * @description Get the total pages to go through.
   * @function YTS#getTotalPages
   * @memberof module:lib/yts
   * @param {Boolean} [retry=true] - Retry the request.
   * @returns {Promise} - The maximum pages to go through.
   */
  const getTotalPages = (retry = true) => {
    const url = "list_movies.json";
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (err && retry) {
          return resolve(getTotalPages(false));
        } else if (err) {
          return reject(`YTS: ${err} with link: 'list_movies.json'`);
        } else if (!body || res.statusCode >= 400) {
          return reject(`YTS: Could not find data on '${url}'.`);
        } else {
          body = JSON.parse(body);
          const totalPages = Math.ceil(body.data.movie_count / 50); // Change to 'const' for production.
          // totalPages = 3; // For testing purposes only.
          return resolve(totalPages);
        }
      });
    });
  };

  /**
   * @description Format data from movies.
   * @function YTS#formatPage
   * @memberof module:lib/yts
   * @param {Object} data - Data about the movies.
   * @returns {Object} - An object with the imdb id and the torrents.
   */
  const formatPage = data => {
    return asyncq.each(data, movie => {
      if (movie && movie.torrents && movie.imdb_code && movie.language.match(/english/i)) {
        const torrents = {};
        torrents["en"] = {};
        movie.torrents.forEach(torrent => {
          if (torrent.quality !== "3D") {
            torrents["en"][torrent.quality] = {
              url: `magnet:?xt=urn:btih:${torrent.hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
              seed: torrent.seeds,
              peer: torrent.peers,
              size: torrent.size_bytes,
              filesize: torrent.size,
              provider: "YTS"
            };
          }
        });

        return {
          imdb_id: movie.imdb_code,
          torrents
        };
      }
    });
  };

  /**
   * @description Get formatted data from one page.
   * @function YTS#getOnePage
   * @memberof module:lib/yts
   * @param {Integer} page - The page to get the data from.
   * @param {Boolean} [retry=true] - Retry the function.
   * @returns {Promise} - Formatted data from one page.
   */
  const getOnePage = (page, retry = true) => {
    const url = `?limit=50&page=${page + 1}`;
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (err && retry) {
          return resolve(getOnePage(page, false));
        } else if (err) {
          return reject(`YTS: ${err} with link: '?limit=50&page=${page + 1}'`);
        } else if (!body || res.statusCode >= 400) {
          return reject(`YTS: Could not find data on '${url}'.`);
        } else {
          body = JSON.parse(body);
          return resolve(formatPage(body.data.movies));
        }
      });
    });
  };

  /**
   * @description All the found movies.
   * @function YTS#getMovies
   * @memberof module:lib/yts
   * @returns {Array} - A list of all the found movies.
   */
  const getMovies = async() => {
    try {
      const totalPages = await getTotalPages(); // Change to 'const' for production.
      if (!totalPages) return util.onError(`${name}: totalPages returned; '${totalPages}'`);
      // totalPages = 3; // For testing purposes only.
      let movies = [];
      return await asyncq.timesSeries(totalPages, async page => {
        try {
          console.log(`YTS: Starting searching kat on page ${page + 1} out of ${totalPages}`);
          const onePage = await getOnePage(page);
          movies = movies.concat(onePage);
        } catch (err) {
          return util.onError(err);
        }
      }).then(value => movies);
    } catch (err) {
      return util.onError(err);
    }
  };

  /**
   * @description Returns a list of all the inserted torrents.
   * @function YTS#search
   * @memberof module:providers/movie/yts
   * @returns {Array} - A list of scraped movies.
   */
  const search = async() => {
    try {
      console.log(`${name}: Starting scraping...`);
      const movies = await getMovies();
      return await asyncq.eachLimit(movies, global.maxWebRequest, async ytsMovie => {
        if (ytsMovie && ytsMovie.imdb_id) {
          const newMovie = await helper.getTraktInfo(ytsMovie.imdb_id);
          if (newMovie && newMovie._id) {
            delete ytsMovie.imdb_id;
            return await helper.addTorrents(newMovie, ytsMovie.torrents);
          }
        }
      });
    } catch (err) {
      return util.onError(err);
    }
  };

  // Return the public functions.
  return { name, search };

};

// Export the YTS factory function.
export default YTS;
