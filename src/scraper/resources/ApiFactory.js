// Import the necessary modules.
/**
 * An EZTV API wrapper to get data from eztv.ag.
 * @external {Eztv} https://github.com/ChrisAlderson/eztv-api-pt
 */
import Eztv from 'eztv-api-pt'
/**
 * A Fanart.tv API wrapper for NodeJS.
 * @external {Fanart} https://github.com/ChrisAlderson/fanart.tv-api
 */
import Fanart from 'fanart.tv-api'
/**
 * A HorribleSubs API wrapper to get data from horriblesubs.info
 * @external {HorribleSubs} https://github.com/ChrisAlderson/horriblesubs-api
 */
import HorribleSubs from 'horriblesubs-api'
/**
 * A KickassTorrents API wrapper for NodeJs.
 * @external {Kat} https://github.com/ChrisAlderson/kat-api-pt
 */
import Kat from 'kat-api-pt'
/**
 * A nyaa.se API wrapper for NodeJS.
 * @external {Nyaa} https://github.com/ChrisAlderson/nyaa-api-pt
 */
import Nyaa from 'nyaa-api-pt'
/**
 * An OMDB API wrapper for NodeJS.
 * @external {Omdb} https://github.com/ChrisAlderson/omdb-api-pt
 */
import Omdb from 'omdb-api-pt'
/**
 * TheMovieDB API wrapper, written in node.js
 * @external {Tmdb} https://github.com/vankasteelj/tmdbapi
 */
import Tmdb from 'tmdbapi'
/**
 * A Trakt.tv API wrapper for Node.js
 * @external {Trakt} https://github.com/vankasteelj/trakt.tv
 */
import Trakt from 'trakt.tv'
/**
 * Node.js library for accessing TheTVDB API
 * @external {Tvdb} https://github.com/edwellbrook/node-tvdb
 */
import Tvdb from 'node-tvdb'
/**
 * A NodeJS wrapper for yts.ag
 * @external {Yts} https://github.com/ChrisAlderson/yts-api-pt
 */
import Yts from 'yts-api-pt'
/**
 * An ExtraTorrent wrapper for NodeJS.
 * @external {ExtraTorrentAPI} https://github.com/ChrisAlderson/extratorrent-api
 */
import { Website as ExtraTorrent } from 'extratorrent-api'

import IAbstractFactory from './IAbstractFactory'

/**
 * Class for getting an external API wrapper.
 * @implements {IAbstractFactory}
 * @type {ApiFactory}
 * @flow
 */
export default class ApiFactory extends IAbstractFactory {

  /**
   * A configured ExtraTorrent API.
   * @type {ExtraTorrent}
   * @see https://github.com/ChrisAlderson/extratorrent-api
   */
  _extraTorrentAPI = new ExtraTorrent()

  /**
   * A configured Eztv API.
   * @type {Eztv}
   * @see https://github.com/ChrisAlderson/eztv-api-pt
   */
  _eztvAPI = new Eztv()

  /**
   * A configured Fanart API.
   * @type {Fanart}
   * @see https://github.com/ChrisAlderson/fanart.tv-api
   */
  _fanartAPI = new Fanart({
    apiKey: process.env.FANART_KEY
  })

  /**
   * A configured HorribleSubs API.
   * @type {HorribleSubs}
   * @see https://github.com/ChrisAlderson/horriblesubs-api
   */
  _horribleSubsAPI = new HorribleSubs()

  /**
   * A configured Kat API.
   * @type {Kat}
   * @see https://github.com/ChrisAlderson/kat-api-pt
   */
  _katAPI = new Kat()

  /**
   * A configured Nyaa API.
   * @type {Nyaa}
   * @see https://github.com/ChrisAlderson/nyaa-api-pt
   */
  _nyaaAPI = new Nyaa()

  /**
   * A configured Omdb API.
   * @type {Omdb}
   * @see https://github.com/ChrisAlderson/omdb-api-pt
   */
  _omdbAPI = new Omdb({
    apiKey: process.env.OMDB_KEY
  })

  /**
   * A configured Tmdb API.
   * @type {Tmdb}
   * @see https://github.com/vankasteelj/tmdbapi
   */
  _tmdbAPI = new Tmdb({
    apiv3: process.env.TMDB_KEY
  })

  /**
   * A configured Trakt API.
   * @type {Trakt}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _traktAPI = new Trakt({
    client_id: process.env.TRAKT_KEY
  })

  /**
   * A configured Tvdb API.
   * @type {Tvdb}
   * @see https://github.com/edwellbrook/node-tvdb
   */
  _tvdbAPI = new Tvdb(process.env.TVDB_KEY)

  /**
   * A configured Yts API.
   * @type {Yts}
   * @see https://github.com/ChrisAlderson/yts-api-pt
   */
  _ytsAPI = new Yts()

  /** Create an ApiFactory class. */
  constructor(): void {
    super()

    // XXX: Fix this hack.
    this._eztvAPI.getAll = this._eztvAPI.getAllShows
    this._eztvAPI.getData = this._eztvAPI.getShowData
    this._horribleSubsAPI.getAll = this._horribleSubsAPI.getAllAnime
    this._horribleSubsAPI.getData = this._horribleSubsAPI.getAnimeData
    this._ytsAPI.search = this._ytsAPI.getMovies
  }

  /**
   * Get an external API wrapper based on the name.
   * @override
   * @param {!string} api - The name of the external API wrapper.
   * @returns {Object|undefined} - An external API wrapper.
   */
  getApi(api: string): Object | undefined {
    if (!api) {
      return undefined
    }

    const a = api.toUpperCase()

    switch (a) {
      case 'EXTRATORRENT':
        return this._extraTorrentAPI
      case 'EZTV':
        return this._eztvAPI
      case 'FANART':
        return this._fanartAPI
      case 'HORRIBLESUBS':
        return this._horribleSubsAPI
      case 'KAT':
        return this._katAPI
      case 'NYAA':
        return this._nyaaAPI
      case 'OMDB':
        return this._omdbAPI
      case 'TMDB':
        return this._tmdbAPI
      case 'TRAKT':
        return this._traktAPI
      case 'TVDB':
        return this._tvdbAPI
      case 'YTS':
        return this._ytsAPI
      default:
        return undefined
    }
  }

}
