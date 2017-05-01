// Import the neccesary modules.
import asyncq from 'async-q';

import BaseHelper from './BaseHelper';

/**
 * Class for saving movies.
 * @extends {BaseHelper}
 */
export default class MovieHelper extends BaseHelper {

  /**
   * A configured OMDB API.
   * @type {OMDB}
   * @see https://github.com/ChrisAlderson/omdb-api-pt
   */
  _omdb = this._apiFactory.getApi('omdb');

  /**
   * Create a helper class for movie content.
   * @param {!String} name - The name of the content provider.
   * @param {!AnimeMovie|Movie} model - The model to help fill.
   */
  constructor(name, model) {
    super(name, model);
  }

  /**
   * Update the torrents for an existing movie.
   * @param {!AnimeMovie|Movie} movie - The new movie.
   * @param {!AnimeMovie|Movie} found - The existing movie.
   * @param {!String} language - The language of the torrent.
   * @param {!String} quality - The quality of the torrent.
   * @returns {AnimeMovie|Movie} - A movie with merged torrents.
   */
  _updateTorrent(movie, found, language, quality) {
    let update = false,
      movieTorrent = movie.torrents[language];

    const foundTorrent = found.torrents[language];

    if (foundTorrent && movieTorrent) {
      const foundQuality = foundTorrent[quality];
      const movieQuality = movieTorrent[quality];

      if (foundQuality && movieQuality) {
        if (foundQuality.seeds > movieQuality.seeds
            || foundQuality.url === movieQuality.url)
          update = true;
      } else if (foundQuality && !movieQuality) {
        update = true;
      }
    } else if (foundTorrent && !movieTorrent) {
      if (foundTorrent[quality]) {
        movieTorrent = {};
        update = true;
      }
    }

    if (update) movieTorrent[quality] = foundTorrent[quality];
    return movie;
  }

  /**
   * Update a given movie.
   * @param {!AnimeMovie|Movie} movie - The movie to update its torrent.
   * @returns {AnimeMovie|Movie} - A newly updated movie.
   */
  async _updateMovie(movie) {
    try {
      const found = await this._model.findOne({
        _id: movie._id
      }).exec();

      if (found) {
        logger.info(`${this._name}: '${found.title}' is an existing movie.`);

        if (found.torrents) {
          Object.keys(found.torrents).map(language => {
            movie = this._updateTorrent(movie, found, language, '720p');
            movie = this._updateTorrent(movie, found, language, '1080p');
          });
        }

        return await this._model.findOneAndUpdate({
          _id: movie._id
        }, movie).exec();
      }

      logger.info(`${this._name}: '${movie.title}' is a new movie!`);
      return await new this._model(movie).save();
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * Adds torrents to a movie.
   * @param {!AnimeMovie|Movie} movie - The movie to add the torrents to.
   * @param {!Object} torrents - The torrents to add to the movie.
   * @returns {AnimeMovie|Movie} - A movie with torrents attached.
   */
  addTorrents(movie, torrents) {
    return asyncq.each(
      Object.keys(torrents),
      torrent => movie.torrents[torrent] = torrents[torrent]
    ).then(() => this._updateMovie(movie));
  }

  /**
   * Get movie images from TMDB.
   * @param {!Number} tmdb - The tmdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTmdbImages(tmdb) {
    return this._tmdb.movie.images({
      movie_id: tmdb
    }).then(i => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500';

      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0].file_path;
      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0].file_path;

      const images = {
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper._Holder,
        fanart: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : BaseHelper._Holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper._Holder
      };

      return this._checkImages(images);
    });
  }

  /**
   * Get movie images from OMDB.
   * @param {!String} imdb - The imdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getOmdbImages(imdb) {
    return this._omdb.byID({
      imdb,
      type: 'movie'
    }).then(i => {
      const images = {
        banner: i.Poster ? i.Poster : BaseHelper._Holder,
        fanart: i.Poster ? i.Poster : BaseHelper._Holder,
        poster: i.Poster ? i.Poster : BaseHelper._Holder
      };

      return this._checkImages(images);
    });
  }

  /**
   * Get movie images from Fanart.
   * @param {!Number} tmdb - The tvdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tmdb) {
    return this._fanart.getMovieImages(tmdb).then(i => {
      const images = {
        banner: i.moviebanner ? i.moviebanner[0].url : BaseHelper._Holder,
        fanart: i.moviebackground
                          ? i.moviebackground[0].url
                          : i.hdmovieclearart
                          ? i.hdmovieclearart[0].url
                          : BaseHelper._Holder,
        poster: i.movieposter ? i.movieposter[0].url : BaseHelper._Holder
      };

      return this._checkImages(images);
    });
  }

  /**
   * Get movie images.
   * @override
   * @protected
   * @param {!Number} tmdb - The tmdb id of the movie you want the images from.
   * @param {!String} imdb - The imdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getImages(tmdb, imdb) {
    return this._getTmdbImages(imdb)
      .catch(() => this._getOmdbImages(tmdb))
      .catch(() => this._getFanartImages(tmdb))
      .catch(() => this._defaultImages);
  }

  /**
   * Get info from Trakt and make a new movie object.
   * @override
   * @param {!String} slug - The slug to query trakt.tv.
   * @returns {AnimeMovie|Movie} - A new movie.
   */
  async getTraktInfo(slug) {
    try {
      const traktMovie = await this._trakt.movies.summary({
        id: slug,
        extended: 'full'
      });
      const traktWatchers = await this._trakt.movies.watching({ id: slug });

      if (traktMovie && traktMovie.ids.imdb && traktMovie.ids.tmdb) {
        const { imdb, slug, tmdb } = traktMovie.ids;

        return {
          _id: imdb,
          title: traktMovie.title,
          year: traktMovie.year,
          slug: slug,
          synopsis: traktMovie.overview,
          runtime: traktMovie.runtime,
          rating: {
            votes: traktMovie.votes,
            watching: traktWatchers ? traktWatchers.length : 0,
            percentage: Math.round(traktMovie.rating * 10)
          },
          images: await this._getImages(tmdb, imdb),
          genres: traktMovie.genres !== null ? traktMovie.genres : ['unknown'],
          language: traktMovie.language,
          released: new Date(traktMovie.released).getTime() / 1000.0,
          trailer: traktMovie.trailer,
          certification: traktMovie.certification,
          torrents: {}
        };
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

}
