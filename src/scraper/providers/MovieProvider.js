// Import the necessary modules.
import asyncq from 'async-q'
import bytes from 'bytes'

import BaseProvider from './BaseProvider'
import moviemap from './maps/moviemap.json'

/**
 * Class for scraping movie content from various sources.
 * @extends {BaseProvider}
 * @type {MovieProvider}
 * @flow
 */
export default class MovieProvider extends BaseProvider {

  /**
   * The regular expressions used to extract information about movies.
   * @type {Array<Object>}
   */
  _regexps: Array<Object>

  /**
   * Create a MovieProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {?Object} config.api - The name of api for the torrent provider.
   * @param {!string} config.name - The name of the torrent provider.
   * @param {!string} config.modelType - The model type for the helper.
   * @param {?Object} config.query - The query object for the api.
   * @param {!string} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, query, type}: Object): void {
    super({api, name, modelType, query, type})

    /**
     * The regular expressions used to extract information about movies.
     * @type {Array<Object>}
     */
    this._regexps = [{
      regex: /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i
    }, {
      regex: /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i
    }, {
      regex: /(.*).(\d{4})\D+(\d{3,4}p)/i
    }]
  }

  /**
   * Extract movie information based on a regex.
   * @override
   * @protected
   * @param {!Object} torrent - The torrent to extract the movie information
   * from.
   * @param {!RegExp} r - The regex to extract the movie information.
   * @param {!string} [lang=en] - The language of the torrent.
   *
   * @returns {Object} - Information about a movie from the torrent.
   */
  _extractContent(torrent: Object, r: RegExp, lang: string = 'en'): Object {
    let movieTitle
    let slug

    const {
      title, size, seeds, peers, magnet, torrentLink, fileSize
    } = torrent

    movieTitle = title.match(r.regex)[1]
    if (movieTitle.endsWith(' ')) {
      movieTitle = movieTitle.substring(0, movieTitle.length - 1)
    }
    movieTitle = movieTitle.replace(/\./g, ' ')

    slug = movieTitle.replace(/[^a-zA-Z0-9 ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
    if (slug.endsWith('-')) {
      slug = slug.substring(0, slug.length - 1)
    }
    slug = slug in moviemap ? moviemap[slug] : slug

    const year = title.match(r.regex)[2]
    const quality = title.match(r.regex)[3]

    const torrentObj = {
      url: magnet || torrentLink,
      seeds: seeds || 0,
      peers: peers || 0,
      size: bytes(size.replace(/\s/g, '')),
      filesize: size || fileSize,
      provider: this._name
    }

    const movie = {
      movieTitle,
      slug,
      slugYear: `${slug}-${year}`,
      year,
      quality,
      language: lang,
      type: this._type,
      torrents: {}
    }

    return this.attachTorrent(...[movie, torrentObj, quality, lang])
  }

  /**
   * Create a new movie object with a torrent attached.
   * @override
   * @param {!Object} movie - The movie to attach a torrent to.
   * @param {!Object} torrent - The torrent object.
   * @param {!string} quality - The quality of the torrent.
   * @param {!string} [lang=en] - The language of the torrent
   * @returns {Object} - The movie with the newly attached torrent.
   */
  attachTorrent(
    movie: Object,
    torrent: Object,
    quality: string,
    lang: string = 'en'
  ): Object {
    if (!movie.torrents[lang]) {
      movie.torrents[lang] = {}
    }
    if (!movie.torrents[lang][quality]) {
      movie.torrents[lang][quality] = torrent
    }

    return movie
  }

  /**
   * Puts all the found movies from the torrents in an array.
   * @override
   * @protected
   * @param {!Array<Object>} torrents - A list of torrents to extract movie
   * information.
   * @param {!string} [lang=en] - The language of the torrent.
   * @returns {Promise<Array<Object>, undefined>} - A list of objects with
   * movie information extracted from the torrents.
   */
  _getAllContent(
    torrents: Array<Object>,
    lang: string = 'en'
  ): Promise<Array<Object>, void> {
    const movies = []

    return asyncq.mapSeries(torrents, torrent => {
      if (!torrent) {
        return
      }

      const movie = this._getContentData(torrent, lang)

      if (!movie) {
        return
      }

      const { movieTitle, slug, language, quality } = movie

      const matching = movies.find(
        m => m.movieTitle.toLowerCase() === movieTitle.toLowerCase() &&
          m.slug.toLowerCase() === slug.toLowerCase() &&
          m.type.toLowerCase() === this._type.toLowerCase()
      )
      if (!matching) {
        return movies.push(movie)
      }

      const index = movies.indexOf(matching)

      const torrentObj = movie.torrents[language][quality]
      const args = [matching, torrentObj, quality, language]
      const created = this.attachTorrent(...args)

      movies.splice(index, 1, created)
    }).then(() => movies)
  }

}
