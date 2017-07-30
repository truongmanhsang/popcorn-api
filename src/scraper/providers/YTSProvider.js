// Import the neccesary modules.
import MovieProvider from './MovieProvider'

/**
 * Class for scraping content from YTS.ag.
 * @extends {MovieProvider}
 */
export default class YTSProvider extends MovieProvider {

  /**
   * Create a YTSProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {!Object} config.api - The name of api for the torrent provider.
   * @param {!String} config.name - The name of the torrent provider.
   * @param {!String} config.modelType - The model type for the helper.
   * @param {!Object} config.query - The query object for the api.
   * @param {!String} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, query, type}) {
    super({api, name, modelType, query, type})
  }

  /**
   * Extract movie information based from a YTS object.
   * @override
   * @protected
   * @param {!Object} torrent - The torrent to extract the movie information
   * from.
   * @param {!String} [lang=en] - The language of the torrent.
   * @returns {Object} - Information about a movie from the torrent.
   */
  _extractContent(torrent, lang = 'en') {
    const movie = {
      movieTitle: torrent.title,
      slug: torrent.imdb_code,
      slugYear: torrent.imdb_code,
      year: torrent.year,
      language: lang,
      torrents: {}
    }

    torrent.torrents.map(t => {
      const { hash, peers, quality, seeds, size, size_bytes } = t

      const torrentObj = {
        url: `magnet:?xt=urn:btih:${hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
        seeds: seeds || 0,
        peers: peers || 0,
        size: size_bytes,
        filesize: size,
        provider: this._name
      }

      return this.attachTorrent(...[movie, torrentObj, quality, lang])
    })

    return movie
  }

  /**
   * Get movie info from a given torrent.
   * @override
   * @protected
   * @param {!Object} torrent - A torrent object to extract movie information
   * from.
   * @param {!String} [lang=en] - The language of the torrent.
   * @returns {Object|undefined} - Information about a movie from the torrent.
   */
  _getContentData(torrent, lang = 'en') {
    if (
      torrent && torrent.torrents &&
      torrent.imdb_code &&
      torrent.language.match(/english/i)
    ) {
      return this._extractContent(torrent, lang)
    }

    logger.warn(`${this._name}: Could not find data from torrent: '${torrent.title}'`)
  }

}
