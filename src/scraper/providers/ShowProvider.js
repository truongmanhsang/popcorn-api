// Import the necessary modules.
import pMap from 'p-map'

import BaseProvider from './BaseProvider'
import showmap from './maps/showmap.json'

/**
 * Class for scraping show content from various sources.
 * @extends {BaseProvider}
 * @type {ShowProvider}
 * @flow
 */
export default class ShowProvider extends BaseProvider {

  /**
   * The regular expressions used to extract information about shows.
   * @type {Array<Object>}
   */
  _regexps: Array<Object>

  /**
   * Create a ShowProvider class.
   * @param {!Object} config - The configuration object for the torrent
   * provider.
   * @param {?Object} config.api - The name of api for the torrent provider.
   * @param {!String} config.name - The name of the torrent provider.
   * @param {!String} config.modelType - The model type for the helper.
   * @param {?Object} config.query - The query object for the api.
   * @param {!String} config.type - The type of content to scrape.
   */
  constructor({api, name, modelType, query, type}) {
    super({api, name, modelType, query, type})

    /**
     * The regular expressions used to extract information about shows.
     * @type {Array<Object>}
     */
    this._regexps = [{
      regex: /(.*).[sS](\d{2})[eE](\d{2})/i,
      dateBased: false
    }, {
      regex: /(.*).(\d{1,2})[x](\d{2})/i,
      dateBased: false
    }, {
      regex: /(.*).(\d{4}).(\d{2}.\d{2})/i,
      dateBased: true
    }, {
      regex: /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i,
      dateBased: false
    }, {
      regex: /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i,
      dateBased: false
    }]
  }

  /**
   * Extract show information based on a regex.
   * @override
   * @protected
   * @param {!Object} torrent - The torrent to extract the show information
   * from.
   * @param {!RegExp} r - The regex to extract the show information.
   * @returns {Object} - Information about a show from the torrent.
   */
  _extractContent(torrent: Object, r: RegExp): Object {
    let episode
    let season
    let slug

    const { title, name } = torrent
    const t = r.regex.test(title) ? title : r.regex.test(name) ? name : null
    if (!t) {
      return
    }
    const match = t.match(r.regex)

    const showTitle = match[1].replace(/\./g, ' ')
    slug = showTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
    slug = slug in showmap ? showmap[slug] : slug

    season = 1
    season = r.dateBased ? parseInt(match[2], 10) : match[2]

    episode = match.length >= 4
      ? parseInt(match[3], 10)
      : parseInt(match[2], 10)
    episode = r.dateBased ? parseInt(match[3], 10) : match[3]

    const quality = t.match(/(\d{3,4})p/) !== null
      ? t.match(/(\d{3,4})p/)[0]
      : '480p'

    const torrentObj = {
      url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
      seeds: torrent.seeds ? torrent.seeds : 0,
      peers: torrent.peers ? torrent.peers : 0,
      provider: this._name
    }

    const show = {
      showTitle,
      slug,
      season,
      episode,
      quality,
      dateBased: r.dateBased,
      episodes: {},
      type: this._type
    }

    return this.attachTorrent(...[show, torrentObj, season, episode, quality])
  }

  /**
   * Create a new show object with a torrent attached.
   * @override
   * @param {!Object} show - The show to attach a torrent to.
   * @param {!Object} torrent - The torrent object.
   * @param {!number} season - The season number for the torrent.
   * @param {!number} episode - The episode number for the torrent.
   * @param {!string} quality - The quality of the episode.
   * @returns {Object} - The show with the newly attached torrent.
   */
  attachTorrent(
    show: Object,
    torrent: Object,
    season: number,
    episode: number,
    quality: string
  ): Object {
    if (!show.episodes[season]) {
      show.episodes[season] = {}
    }
    if (!show.episodes[season][episode]) {
      show.episodes[season][episode] = {}
    }

    const qualityObj = show.episodes[season][episode][quality]
    if (
      (!qualityObj || show.showTitle.toLowerCase().indexOf('repack') > -1) ||
      (qualityObj && qualityObj.seeds < torrent.seeds)
    ) {
      show.episodes[season][episode][quality] = torrent
    }

    return show
  }

  /**
   * Puts all the found shows from the torrents in an array.
   * @override
   * @protected
   * @param {!Array<Object>} torrents - A list of torrents to extract show
   * information.
   * @returns {Promise<Array<Object>, undefined>} - A list of objects with show
   * information extracted from the torrents.
   */
  _getAllContent(torrents: Array<Object>): Promise<Array<Object>, void> {
    const shows = []

    return pMap(torrents, torrent => {
      if (!torrent) {
        return
      }

      const show = this._getContentData(torrent)
      if (!show) {
        return
      }

      const { showTitle, slug, season, episode, quality } = show

      const matching = shows.find(
        s => s.showTitle.toLowerCase() === showTitle.toLowerCase() &&
          s.slug.toLowerCase() === slug.toLowerCase() &&
          s.type.toLowerCase() === this._type.toLowerCase()
      )
      if (!matching) {
        return shows.push(show)
      }

      const index = shows.indexOf(matching)

      const torrentObj = show.episodes[season][episode][quality]
      const args = [matching, torrentObj, season, episode, quality]
      const created = this.attachTorrent(...args)

      shows.splice(index, 1, created)
    }, {
      concurrency: 1
    }).then(() => shows)
  }

}
