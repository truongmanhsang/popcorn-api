// Import the neccesary modules.
import asyncq from 'async-q';
import bytes from 'bytes';

import BaseExtractor from './BaseExtractor';
import Movie from '../../models/Movie';
import MovieHelper from '../helpers/MovieHelper';
import { movieMap } from '../../config/constants';

/** Class for extracting movies from torrents. */
export default class MovieExtractor extends BaseExtractor {

  /**
   * Create an extractor object for movie content.
   * @param {String} config.name - The name of the content provider.
   * @param {Object} config.torrentProvider - The content provider to extract
   * content from.
   * @param {String} config.type - The content type to extract.
   * @param {Object} [config.model=Movie] - The model for the movie helper.
   */
  constructor({name, torrentProvider, type, model = Movie} = {}) {
    super({name, torrentProvider, type});

    /**
     * The helper object for adding movies.
     * @type {MovieHelper}
     */
    this._helper = new MovieHelper(this._name, model);
  }

  /**
   * Extract movie information based on a regex.
   * @param {Object} torrent - The torrent to extract the movie information
   * from.
   * @param {String} lang - The language of the torrent.
   * @param {Regex} regex - The regex to extract the movie information.
   * @returns {Object} - Information about a movie from the torrent.
   */
  _extractContent(torrent, lang, regex) {
    let movieTitle, slug;

    movieTitle = torrent.title.match(regex)[1];
    if (movieTitle.endsWith(' ')) movieTitle = movieTitle.substring(0, movieTitle.length - 1);
    movieTitle = movieTitle.replace(/\./g, ' ');

    slug = movieTitle.replace(/[^a-zA-Z0-9 ]/gi, '')
                      .replace(/\s+/g, '-')
                      .toLowerCase();
    if (slug.endsWith('-')) slug = slug.substring(0, slug.length - 1);
    slug = slug in movieMap ? movieMap[slug] : slug;

    const year = torrent.title.match(regex)[2];
    const quality = torrent.title.match(regex)[3];

    const size = torrent.size ? torrent.size : torrent.fileSize;

    const movie = {
      movieTitle,
      slug,
      slugYear: `${slug}-${year}`,
      torrentLink: torrent.link,
      year,
      quality,
      language: lang
    };
    movie.torrents = {};

    movie.torrents[lang] = {};
    movie.torrents[lang][quality] = {
      url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
      seeds: torrent.seeds ? torrent.seeds : 0,
      peers: torrent.peers ? torrent.peers : 0,
      size: bytes(size.replace(/\s/g, '')),
      filesize: size,
      provider: this._name
    };

    return movie;
  }

  /**
   * Get movie info from a given torrent.
   * @param {Object} torrent - A torrent object to extract movie information
   * from.
   * @param {String} lang - The language of the torrent.
   * @returns {Object} - Information about a movie from the torrent.
   */
  _getContentData(torrent, lang) {
    const threeDimensions = /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i;
    const fourKay = /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i;
    const withYear = /(.*).(\d{4})\D+(\d{3,4}p)/i;

    if (torrent.title.match(threeDimensions)) {
      return this._extractContent(torrent, lang, threeDimensions);
    } else if (torrent.title.match(fourKay)) {
      return this._extractContent(torrent, lang, fourKay);
    } else if (torrent.title.match(withYear)) {
      return this._extractContent(torrent, lang, withYear);
    }

    logger.warn(`${this._name}: Could not find data from torrent: '${torrent.title}'`);
  }

  /**
   * Puts all the found movies from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract movie information.
   * @param {String} lang - The language of the torrent.
   * @returns {Array} - A list of objects with movie information extracted from
   * the torrents.
   */
  _getAllContent(torrents, lang) {
    const movies = [];

    return asyncq.mapSeries(torrents, torrent => {
      const movie = this._getContentData(torrent, lang);
      if (!movie) return null;

      const { movieTitle, slug, language, quality } = movie;
      const matching = movies.find(
        m => m.movieTitle === movieTitle && m.slug === slug
      );

      if (!matching) return movies.push(movie);

      const index = movies.indexOf(matching);

      if (!matching.torrents[language][quality])
        matching.torrents[language][quality] = movie.torrents[language][quality];

      movies.splice(index, 1, matching);
    }).then(() => movies);
  }

}
