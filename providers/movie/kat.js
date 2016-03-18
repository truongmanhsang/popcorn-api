const async = require("async-q"),
  config = require("../../config"),
  kat = require("../../lib/kat"),
  util = require("../../util");
let helper, name;


/* Get all the movies competable with Popcorn Time. */
const getMovie = function*(matMovie) {
  const newMovie = yield util.spawn(helper.getTraktInfo(katMovie.slug));
  if (typeof(newMovie) != "undefined" && newMovie._id) {
    const slug = katMovie.slug;

    delete katMovie.movieTitle;
    delete katMovie.slug;
    delete katMovie.torrentLink;
    delete katMovie.quality;
    return yield helper.updateMovie(newMovie, katMovie, slug);
  }
};

/* Extract movie information based on a regex. */
const extraktMovie = (torrent, regex) => {
  const movieTitle = torrent.title.match(regex)[1].replace(/\./g, " ");
  let slug = showTitle.replace(/\s+/g, "-").toLowerCase();
  slug = slug in config.katMap ? config.katMap[slug] : slug;
  const quality = torrent.title.match(/(\d{3,4})p/) != null ? torrent.title.match(/(\d{3,4})p/)[0] : "480p";

  const movie = {
    showTitle: movieTitle,
    slug: slug,
    torrentLink: torrent.link,
    quality: quality
  };

  if (!movie[quality]) = {
    url: torrent.magnet,
    seeds: torrent.seeds,
    peers: torrent.peers,
    provider: name
  };

  return movie;
};

/* Get mocie info from a given torrent. */
const getMovieData = (torrent) => {
  const seasonBased = /(.*).[sS](\d{2})[eE](\d{2})/;
  // const vtv = /(.*).(\d{1,2})[x](\d{2})/;
  // const dateBased = /(.*).(\d{4}).(\d{2}.\d{2})/;
  // TODO: switch case maybe?
  if (torrent.title.match(seasonBased)) {
    return extractShow(torrent, seasonBased);
  }
};

/* Puts all the found shows from the torrents in an array. */
const getAllKATMovies = (torrents) => {
  const movies = [];
  return async.mapSeries(torrents, (torrent) => {
    if (torrent) {
      const movie = getMovieData(torrent);
      if (show) {
        if (movies.length != 0) {
          const matching = movies.filter((m) => {
            return m.movieTitle === movie.movieTitle && m.slug === movie.slug;
          });

          if (matching.length != 0) {
            const index = movies.indexOf(matching[0]);
            if (!matching[0][movie.quality])
              matching[0][movie.quality] = movie[movie.quality];

            movies.splice(index, 1, matching[0]);
          } else {
            movies.push(movie);
          }
        } else {
          movies.push(movie);
        }
      }
    }
  }).then((value) => {
    return movies;
  });
};

/* Get all the torrents of a given provider. */
const getAllTorrents = (totalPages, provider) => {
  let katTorrents = [];
  return async.timesSeries(totalPages, (page) => {
    provider.query.page = page + 1;
    console.log(name + ": Starting searching kat on page " + provider.query.page + " needs more " + (provider.query.page < totalPages));
    return kat.search(provider.query).then((result) => {
      katTorrents = katTorrents.concat(result.results);
    }).catch((err) => {
      util.onError(err);
      return err;
    });
  }).then((value) => {
    console.log(name + ": Found " + katTorrents.length + " torrents.");
    return katTorrents;
  });
};

const KAT = (_name) => {

  name = _name;
  helper = require("./helper")(name);

  return {

    /* Returns a list of all the inserted torrents. */
    search: function*(provider) {
      console.log(name + ": Starting scraping...");
      provider.query.page = 1;
      provider.query.category = "movie";
      provider.query.verified = 1;
      provider.query.adult_filter = 1;

      const getTotalPages = yield kat.search(provider.query);
      const totalPages = getTotalPages.totalPages; // Change to 'const' for production.
      //totalPages = 3; // For testing purposes only.
      console.log(name + ": Total pages " + totalPages);

      const katTorrents = yield getAllTorrents(totalPages, provider);
      // const katShows = yield getAllKATShows(katTorrents);
      // return yield async.mapLimit(katShows, config.maxWebRequest, (katShow) => {
      //   return util.spawn(getShow(katShow)).catch((err) => {
      //     util.onError(err);
      //     return err;
      //   });
      // });
    }

  };

};

module.exports = KAT;
