// Import the necessary modules.
// @flow
import pMap from 'p-map'
import bytes from 'bytes'

import BaseProvider from './BaseProvider'
import movieMap from './maps/movieMap'

/**
 * Class for scraping movie content from various sources.
 * @extends {BaseProvider}
 * @type {MovieProvider}
 */
export default class MovieProvider extends BaseProvider {

  /**
   * Extract content information based on a regex.
   * @override
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {!Object} options.regex - The regex object to extract the content
   * information.
   * @param {?string} [lang] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  extractContent({torrent, regex, lang}: Object): Object | void {
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
    slug = slug in movieMap ? movieMap[slug] : slug

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
   * Attach the torrent object to the content.
   * @overridd
   * @protected
   * @param {!Object} options - The options to attach a torrent to the content.
   * @param {!Object} options.movie - The content to attach a torrent to.
   * @param {!Object} options.torrent - The torrent object ot attach.
   * @param {!string} options.quality - The quality of the torrent.
   * @param {!string} [options.lang] - The language of the torrent.
   * @returns {Object} - The content with the newly attached torrent.
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
   * Put all the found content from the torrents in an array.
   * @override
   * @protected
   * @param {!Object} options - The options to get the content.
   * @param {!Array<Object>} options.torrents - A list of torrents to extract
   * content information from.
   * @param {!string} [options.lang=en] - The language of the torrents.
   * @returns {Promise<Array<Object>, Error>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({
    torrents,
    lang = 'en'
  }: Object): Promise<Array<Object>> {
    const movies = new Map()

    return pMap(torrents, t => {
      if (!t) {
        return
      }

      const movie = this.getContentData({
        lang,
        torrent: t
      })

      if (!movie) {
        return
      }

      const { slug, language, quality } = movie
      if (!movies.has(slug)) {
        return movies.set(slug, movie)
      }

      const torrent = movie.torrents[language][quality]
      const created = this.attachTorrent({
        torrent,
        quality,
        language,
        movie
      })

      return movies.set(slug, created)
    }, {
      concurrency: 1
    }).then(() => Array.from(movies.values()))
  }

}
