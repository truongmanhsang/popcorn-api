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
   _extraTorrentApi: ExtraTorrent

  /**
   * A configured Eztv API.
   * @type {Eztv}
   * @see https://github.com/ChrisAlderson/eztv-api-pt
   */
  _eztvApi: Eztv

  /**
   * A configured Fanart API.
   * @type {Fanart}
   * @see https://github.com/ChrisAlderson/fanart.tv-api
   */
  _fanartApi: Fanart

  /**
   * A configured HorribleSubs API.
   * @type {HorribleSubs}
   * @see https://github.com/ChrisAlderson/horriblesubs-api
   */
  _horribleSubsApi: HorribleSubs

  /**
   * A configured Kat API.
   * @type {Kat}
   * @see https://github.com/ChrisAlderson/kat-api-pt
   */
  _katApi: Kat

  /**
   * A configured Nyaa API.
   * @type {Nyaa}
   * @see https://github.com/ChrisAlderson/nyaa-api-pt
   */
  _nyaaApi: Nyaa

  /**
   * A configured Omdb API.
   * @type {Omdb}
   * @see https://github.com/ChrisAlderson/omdb-api-pt
   */
  _omdbApi: Omdb

  /**
   * A configured Tmdb API.
   * @type {Tmdb}
   * @see https://github.com/vankasteelj/tmdbapi
   */
  _tmdbApi: Tmdb

  /**
   * A configured Trakt API.
   * @type {Trakt}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _traktApi: Trakt

  /**
   * A configured Tvdb API.
   * @type {Tvdb}
   * @see https://github.com/edwellbrook/node-tvdb
   */
   _tvdbApi: Tvdb

  /**
   * A configured Yts API.
   * @type {Yts}
   * @see https://github.com/ChrisAlderson/yts-api-pt
   */
  _ytsApi: Yts

  /** Create an ApiFactory class. */
  constructor(): void {
    super()

    /**
     * A configured Eztv API.
     * @type {Eztv}
     * @see https://github.com/ChrisAlderson/eztv-api-pt
     */
    this._eztvApi = new Eztv()
    /**
     * A configured Fanart API.
     * @type {Fanart}
     * @see https://github.com/ChrisAlderson/fanart.tv-api
     */
    this._fanartApi = new Fanart({
      apiKey: process.env.FANART_KEY
    })
    /**
   * A configured HorribleSubs API.
   * @type {HorribleSubs}
   * @see https://github.com/ChrisAlderson/horriblesubs-api
   */
    this._horribleSubsApi = new HorribleSubs()
    /**
     * A configured Kat API.
     * @type {Kat}
     * @see https://github.com/ChrisAlderson/kat-api-pt
     */
    this._katApi = new Kat()
    /**
     * A configured Nyaa API.
     * @type {Nyaa}
     * @see https://github.com/ChrisAlderson/nyaa-api-pt
     */
    this._nyaaApi = new Nyaa({
      apiToken: process.env.NYAA_KEY
    })
    /**
     * A configured Omdb API.
     * @type {Omdb}
     * @see https://github.com/ChrisAlderson/omdb-api-pt
     */
    this._omdbApi = new Omdb({
      apiKey: process.env.OMDB_KEY
    })
    /**
     * A configured Tmdb API.
     * @type {Tmdb}
     * @see https://github.com/vankasteelj/tmdbapi
     */
    this._tmdbApi = new Tmdb({
      apiv3: process.env.TMDB_KEY
    })
    /**
     * A configured Trakt API.
     * @type {Trakt}
     * @see https://github.com/vankasteelj/trakt.tv
     */
    this._traktApi = new Trakt({
      client_id: process.env.TRAKT_KEY
    })
    /**
     * A configured Tvdb API.
     * @type {Tvdb}
     * @see https://github.com/edwellbrook/node-tvdb
     */
    this._tvdbApi = new Tvdb(process.env.TVDB_KEY)
    /**
     * A configured Yts API.
     * @type {Yts}
     * @see https://github.com/ChrisAlderson/yts-api-pt
     */
    this._ytsApi = new Yts()

    // XXX: Fix this hack.
    this._eztvApi.getAll = this._eztvApi.getAllShows
    this._eztvApi.getData = this._eztvApi.getShowData
    this._horribleSubsApi.getAll = this._horribleSubsApi.getAllAnime
    this._horribleSubsApi.getData = this._horribleSubsApi.getAnimeData
    this._ytsApi.search = this._ytsApi.getMovies
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
      case 'EZTV':
        return this._eztvApi
      case 'FANART':
        return this._fanartApi
      case 'HORRIBLESUBS':
        return this._horribleSubsApi
      case 'KAT':
        return this._katApi
      case 'NYAA':
        return this._nyaaApi
      case 'OMDB':
        return this._omdbApi
      case 'TMDB':
        return this._tmdbApi
      case 'TRAKT':
        return this._traktApi
      case 'TVDB':
        return this._tvdbApi
      case 'YTS':
        return this._ytsApi
      default:
        return undefined
    }
  }

}
