// Import the neccesary modules.
import asyncq from 'async-q';
import bytes from 'bytes';

import BaseProvider from './BaseProvider';
import moviemap from './maps/moviemap.json';

const defaultRegexps = [{
  regex: /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i
}, {
  regex: /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i
}, {
  regex: /(.*).(\d{4})\D+(\d{3,4}p)/i
}];

/**
 * Class for scraping movie content from various sources.
 * @extends {BaseProvider}
 */
export default class MovieProvider extends BaseProvider {

  /**
   * Create a MovieProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {!Object} config.api - The name of api for the torrent provider.
   * @param {!String} config.name - The name of the torrent provider.
   * @param {!String} config.modelType - The model type for the helper.
   * @param {!Object} config.query - The query object for the api.
   * @param {?Array<RegExp>} [config.regexps=defaultRegexps] - The regular
   * expressions used to extract information about movies.
   * @param {!String} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, query, regexps = defaultRegexps, type}) {
    super({api, name, modelType, query, regexps, type});
  }

  /**
   * Extract movie information based on a regex.
   * @override
   * @param {!Object} torrent - The torrent to extract the movie information
   * from.
   * @param {!RegExp} r - The regex to extract the movie information.
   * @param {!String} [lang=en] - The language of the torrent.
   *
   * @returns {Object} - Information about a movie from the torrent.
   */
  _extractContent(torrent, r, lang = 'en') {
    let movieTitle, slug;

    const {
      title, size, seeds, peers, magnet, torrent_link, fileSize
    } = torrent;

    movieTitle = title.match(r.regex)[1];
    if (movieTitle.endsWith(' '))
      movieTitle = movieTitle.substring(0, movieTitle.length - 1);
    movieTitle = movieTitle.replace(/\./g, ' ');

    slug = movieTitle.replace(/[^a-zA-Z0-9 ]/gi, '')
                      .replace(/\s+/g, '-')
                      .toLowerCase();
    if (slug.endsWith('-')) slug = slug.substring(0, slug.length - 1);
    slug = slug in moviemap ? moviemap[slug] : slug;

    const year = title.match(r.regex)[2];
    const quality = title.match(r.regex)[3];

    const torrentObj = {
      url: magnet ? magnet : torrent_link,
      seeds: seeds ? seeds : 0,
      peers: peers ? peers : 0,
      size: bytes(size.replace(/\s/g, '')),
      filesize: size ? size : fileSize,
      provider: this._name
    };

    const movie = {
      movieTitle,
      slug,
      slugYear: `${slug}-${year}`,
      year,
      quality,
      language: lang,
      type: this._type,
      torrents: {}
    };

    return this.attachTorrent(...[movie, torrentObj, quality, lang]);
  }

  /**
   * Create a new movie object with a torrent attached.
   * @override
   * @param {!Object} movie - The movie to attach a torrent to.
   * @param {!Object} torrent - The torrent object.
   * @param {!String} quality - The quality of the torrent.
   * @param {!String} [lang=en] - The language of the torrent
   * @returns {Object} - The movie with the newly attached torrent.
   */
  attachTorrent(movie, torrent, quality, lang = 'en') {
    if (!movie.torrents[lang]) movie.torrents[lang] = {};
    if (!movie.torrents[lang][quality]) movie.torrents[lang][quality] = torrent;

    return movie;
  }

  /**
   * Puts all the found movies from the torrents in an array.
   * @override
   * @param {!Array<Object>} torrents - A list of torrents to extract movie
   * information.
   * @param {!String} [lang=en] - The language of the torrent.
   * @returns {Promise<Array<Object>, undefined>} - A list of objects with
   * movie information extracted from the torrents.
   */
  _getAllContent(torrents, lang = 'en') {
    const movies = [];

    return asyncq.mapSeries(torrents, torrent => {
      if (!torrent) return null;

      const movie = this._getContentData(torrent, lang);

      if (!movie) return null;

      const { movieTitle, slug, language, quality } = movie;

      const matching = movies.find(
        m => m.movieTitle.toLowerCase() === movieTitle.toLowerCase()
              && m.slug.toLowerCase() === slug.toLowerCase()
              && m.type.toLowerCase() === this._type.toLowerCase()
      );
      if (!matching) return movies.push(movie);

      const index = movies.indexOf(matching);

      const torrentObj = movie.torrents[language][quality];
      const args = [matching, torrentObj, quality, language];
      const created = this.attachTorrent(...args);

      movies.splice(index, 1, created);
    }).then(() => movies);
  }

}
