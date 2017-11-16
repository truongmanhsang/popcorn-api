// Import the necessary modules.
// @flow
import pMap from 'p-map'
import bytes from 'bytes'

import BaseProvider from './BaseProvider'
import moviemap from './maps/moviemap'

// /**
//  * The regular expressions used to extract information about movies.
//  * @type {Array<Object>}
//  */
// this.regexps = [{
//   regex: /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i
// }, {
//   regex: /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i
// }, {
//   regex: /(.*).(\d{4})\D+(\d{3,4}p)/i
// }]

/**
 * Class for scraping movie content from various sources.
 * @extends {BaseProvider}
 * @type {MovieProvider}
 */
export default class MovieProvider extends BaseProvider {

  /**
   * Extract movie information based on a regex.
   * @override
   * @protected
   * @param {!Object} torrent - The torrent to extract the movie information
   * from.
   * @param {!RegExp} r - The regex to extract the movie information.
   * @param {!string} [lang] - The language of the torrent.
   * @returns {Object|undefined} - Information about a movie from the torrent.
   */
  _extractContent({torrent, regex, lang}): Object | void {
    let movieTitle
    let slug

    const {
      title, size, seeds, peers, magnet, torrentLink, fileSize
    } = torrent

    movieTitle = title.match(regex.regex)[1]
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

    const year = parseInt(title.match(regex.regex)[2], 10)
    const quality = title.match(regex.regex)[3]

    const torrentObj = {
      url: magnet || torrentLink,
      seeds: seeds || 0,
      peers: peers || 0,
      size: bytes(size),
      filesize: size || fileSize,
      provider: this.name
    }
    const movie = {
      movieTitle,
      slug,
      slugYear: `${slug}-${year}`,
      year,
      quality,
      language: lang,
      type: this.contentType,
      torrents: {}
    }

    return this.attachTorrent({
      movie,
      quality,
      lang,
      torrent: torrentObj
    })
  }

  /**
   * Create a new movie object with a torrent attached.
   * @override
   * @param {!Object} movie - The movie to attach a torrent to.
   * @param {!Object} torrent - The torrent object.
   * @param {!string} quality - The quality of the torrent.
   * @param {!string} [lang] - The language of the torrent
   * @returns {Object} - The movie with the newly attached torrent.
   */
  attachTorrent({movie, torrent, quality, lang}: Object): Object {
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
  _getAllContent({torrents, lang = 'en'}): Promise<Array<Object>, void> {
    const movies = []

    return pMap(torrents, t => {
      if (!t) {
        return
      }

      const movie = this.getContentData(t, lang)

      if (!movie) {
        return
      }

      const { movieTitle, slug, language, quality } = movie

      const matching = movies.find(
        m => m.movieTitle.toLowerCase() === movieTitle.toLowerCase() &&
          m.slug.toLowerCase() === slug.toLowerCase() &&
          m.type.toLowerCase() === this.contentType.toLowerCase()
      )
      if (!matching) {
        return movies.push(movie)
      }

      const index = movies.indexOf(matching)

      const torrent = movie.torrents[language][quality]
      const created = this.attachTorrent({
        matching,
        torrent,
        quality,
        language
      })

      movies.splice(index, 1, created)
    }, {
      concurrency: 1
    }).then(() => movies)
  }

}
