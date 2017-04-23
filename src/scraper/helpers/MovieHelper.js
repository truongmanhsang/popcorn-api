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
   * @type {Object}
   * @see https://github.com/ChrisAlderson/omdb-api-pt
   */
  _omdb = this._apiFactory.getApi('omdb');

  /**
   * Create a helper class for movie content.
   * @param {String} name - The name of the content provider.
   * @param {Object} model - The model to help fill.
   */
  constructor(name, model) {
    super(name, model);
  }

  /**
   * Update the torrents for an existing movie.
   * @param {Movie} movie - The new movie.
   * @param {Movie} found - The existing movie.
   * @param {String} language - The language of the torrent.
   * @param {String} quality - The quality of the torrent.
   * @return {Movie} - A movie with merged torrents.
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
   * @param {Movie} movie - The movie to update its torrent.
   * @returns {Movie} - A newly updated movie.
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
   * @param {Movie} movie - The movie to add the torrents to.
   * @param {Object} torrents - The torrents to add to the movie.
   * @returns {Movie} - A movie with torrents attached.
   */
  addTorrents(movie, torrents) {
    return asyncq.each(
      Object.keys(torrents),
      torrent => movie.torrents[torrent] = torrents[torrent]
    ).then(() => this._updateMovie(movie));
  }

  /**
   * Get movie images from TMDB.
   * @param {Number} tmdb - The tmdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTmdbImages(tmdb) {
    return this._tmdb.movie.images({
      movie_id: tmdb
    }).then(images => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500/';

      const tmdbPoster = images.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0];
      const tmdbBackdrop = images.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0];

      return {
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.holder,
        fanart: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : BaseHelper.holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.holder
      };
    });
  }

  /**
   * Get movie images from OMDB.
   * @param {String} imdb - The imdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getOmdbImages(imdb) {
    return this._omdb.byID({
      imdb,
      type: 'movie'
    }).then(images => {
      return {
        banner: images.Poster ? images.Poster : BaseHelper.holder,
        fanart: images.Poster ? images.Poster : BaseHelper.holder,
        poster: images.Poster ? images.Poster : BaseHelper.holder
      };
    });
  }

  /**
   * Get movie images from Fanart.
   * @param {Number} tmdb - The tvdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tmdb) {
    return this._fanart.getMovieImages(tmdb).then(images => {
      return {
        banner: images.moviebanner
                          ? images.moviebanner[0].url
                          : BaseHelper.holder,
        fanart: images.moviebackground
                          ? images.moviebackground[0].url
                          : images.hdmovieclearart
                          ? images.hdmovieclearart[0].url
                          : BaseHelper.holder,
        poster: images.movieposter
                          ? images.movieposter[0].url
                          : BaseHelper.holder
      };
    });
  }

  /**
   * Get movie images.
   * @override
   * @param {Number} tmdb - The tmdb id of the movie you want the images from.
   * @param {String} imdb - The imdb id of the movie you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getImages(tmdb, imdb) {
    return Promise.race([
      this._getTmdbImages(imdb),
      this._getOmdbImages(tmdb),
      this._getFanartImages(tmdb)
    ]).catch(err =>
      logger.error(`Images: Could not find images on: ${err.path || err} with id: '${tmdb || imdb}'`)
    );
  }

  /**
   * Get info from Trakt and make a new movie object.
   * @override
   * @param {String} slug - The slug to query trakt.tv.
   * @returns {Movie} - A new movie.
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
          imdb_id: imdb,
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
          country: traktMovie.language,
          last_updated: Number(new Date()),
          images: await this._getImages(tmdb, imdb),
          genres: traktMovie.genres !== null ? traktMovie.genres : ['unknown'],
          released: new Date(traktMovie.released).getTime() / 1000.0,
          trailer: traktMovie.trailer || null,
          certification: traktMovie.certification,
          torrents: {}
        };
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

}
