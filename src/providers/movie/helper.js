// Import the neccesary modules.
import asyncq from "async-q";
import Movie from "../../models/Movie";
import Util from "../../util";

/**
 * @class
 * @classdesc The factory function for saving movies.
 * @memberof module:providers/movie/helper
 * @param {String} name - The name of the helper;
 * @property {Object} util - The util object with general functions.
 * @property {Object} trakt - A configured trakt api.
 */
const Helper = name => {

  const util = Util();
  const trakt = util.trakt;

  /**
   * @description Update the torrents for an existing movie.
   * @function Helper#updateTorrent
   * @memberof module:providers/movie/helper
   * @param {Movie} movie - The new movie.
   * @param {Movie} found - The existing movie.
   * @param {String} language - The language of the torrent.
   * @param {String} quality - The quality of the torrent.
   */
   const updateTorrent = (movie, found, language, quality) => {
     let update = false;

     if (found.torrents[language] && movie.torrents[language]) {
       if (found.torrents[language][quality] && movie.torrents[language][quality]) {
         if (found.torrents[language][quality].seed > movie.torrents[language][quality].seed) {
           update = true;
         } else if (movie.torrents[language][quality].seed > found.torrents[language][quality].seed) {
           update = false;
         } else if (found.torrents[language][quality].url === movie.torrents[language][quality].url) {
           update = true;
         }
       } else if (found.torrents[language][quality] && !movie.torrents[language][quality]) {
         update = true;
       }
     } else if (found.torrents[language] && !movie.torrents[language]) {
       if (found.torrents[language][quality]) {
         movie.torrents[language] = {};
         update = true;
       }
     }

     if (update) movie.torrents[language][quality] = found.torrents[language][quality];
     return movie;
   };

  /**
   * @description Update a given movie.
   * @function Helper#updateMovie
   * @memberof module:providers/movie/helper
   * @param {Movie} movie - The movie to update its torrent.
   * @returns {Movie} - A newly updated movie.
   */
  const updateMovie = async movie => {
    try {
      const found = await Movie.findOne({
        _id: movie._id
      }).exec();
      if (found) {
        console.log(`${name}: '${found.title}' is an existing movie.`);

        Object.keys(found.torrents).forEach(language => {
          movie = updateTorrent(movie, found, language, "720p");
          movie = updateTorrent(movie, found, language, "1080p");
        });

        return await Movie.findOneAndUpdate({
          _id: movie._id
        }, movie).exec();
      } else {
        console.log(`${name}: '${movie.title}' is a new movie!`);
        return await new Movie(movie).save();
      }
    } catch (err) {
      return util.onError(err);
    }
  };

  /**
   * @description Adds torrents to a movie.
   * @function Helper#addTorrents
   * @memberof module:providers/movie/helper
   * @param {Movie} movie - The movie to add the torrents to.
   * @param {Object} torrents - The torrents to add to the movie.
   */
  const addTorrents = (movie, torrents) => {
    return asyncq.each(Object.keys(torrents),
        torrent => movie.torrents[torrent] = torrents[torrent])
      .then(value => updateMovie(movie));
  };

  /**
   * @description Get info from Trakt and make a new movie object.
   * @function Helper#getTraktInfo
   * @memberof module:providers/movie/helper
   * @param {String} slug - The slug to query trakt.tv.
   * @returns {Movie} - A new movie.
   */
  const getTraktInfo = async slug => {
    try {
      const traktMovie = await trakt.movies.summary({id: slug, extended: "full,images"});
      const traktWatchers = await trakt.movies.watching({id: slug});

      let watching = 0;
      if (traktWatchers !== null) watching = traktWatchers.length;

      if (traktMovie && traktMovie.ids["imdb"]) {
        return {
          _id: traktMovie.ids["imdb"],
          imdb_id: traktMovie.ids["imdb"],
          title: traktMovie.title,
          year: traktMovie.year,
          slug: traktMovie.ids["slug"],
          synopsis: traktMovie.overview,
          runtime: traktMovie.runtime,
          rating: {
            hated: 100,
            loved: 100,
            votes: traktMovie.votes,
            watching: watching,
            percentage: Math.round(traktMovie.rating * 10)
          },
          country: traktMovie.language,
          last_updated: Number(new Date()),
          images: {
            banner: traktMovie.images.banner.full !== null ? traktMovie.images.banner.full : "images/posterholder.png",
            fanart: traktMovie.images.fanart.full !== null ? traktMovie.images.fanart.full : "images/posterholder.png",
            poster: traktMovie.images.poster.full !== null ? traktMovie.images.poster.full : "images/posterholder.png"
          },
          genres: traktMovie.genres !== null ? traktMovie.genres : ["unknown"],
          released: new Date(traktMovie.released).getTime() / 1000.0,
          trailer: traktMovie.trailer || false,
          certification: traktMovie.certification,
          torrents: {}
        };
      }
    } catch (err) {
      return util.onError(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  };

  // Return the public functions.
  return { addTorrents, getTraktInfo };

};

// Export the helper factory function.
export default Helper;
