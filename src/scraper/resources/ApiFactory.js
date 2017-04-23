// Import the neccesary modules.
/** @external {EztvAPI} https://github.com/ChrisAlderson/eztv-api-pt */
import EztvAPI from 'eztv-api-pt';
/** @external {Fanart} https://github.com/ChrisAlderson/fanart.tv-api */
import Fanart from 'fanart.tv-api';
/** @external {HorribleSubsAPI} https://github.com/ChrisAlderson/horriblesubs-api */
import HorribleSubsAPI from 'horriblesubs-api';
/** @external {KatAPI} https://github.com/ChrisAlderson/kat-api-pt */
import KatAPI from 'kat-api-pt';
/** @external {NyaaAPI} https://github.com/ChrisAlderson/nyaa-api-pt */
import NyaaAPI from 'nyaa-api-pt';
/** @external {OMDB} https://github.com/ChrisAlderson/omdb-api-pt */
import OMDB from 'omdb-api-pt';
/** @external {TMDB} https://github.com/vankasteelj/tmdbapi */
import TMDB from 'tmdbapi';
/** @external {Trakt} https://github.com/vankasteelj/trakt.tv */
import Trakt from 'trakt.tv';
/** @external {TVDB} https://github.com/edwellbrook/node-tvdb */
import TVDB from 'node-tvdb';
/** @external {YtsAPI} https://github.com/ChrisAlderson/yts-api-pt */
import YtsAPI from 'yts-api-pt';
/** @external {ExtraTorrentAPI} https://github.com/ChrisAlderson/extratorrent-api */
import { Website as ExtraTorrentAPI } from 'extratorrent-api';

import IAbstractFactory from './IAbstractFactory';

/**
 * Class for getting an external API wrapper.
 * @implements {IAbstractFactory}
 */
export default class ApiFactory extends IAbstractFactory {

  /**
   * A configured ExtraTorrentAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/extratorrent-api
   */
  _extraTorrentAPI = new ExtraTorrentAPI();

  /**
   * A configured EztvAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/eztv-api-pt
   */
  _eztvAPI = new EztvAPI();

  /**
   * A configured Fanart API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/fanart.tv-api
   */
  _fanartAPI = new Fanart({
    api_key: 'bd2753f04538b01479e39e695308b921'
  });

  /**
   * A configured HorribleSubsAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/horriblesubs-api
   */
  _horribleSubsAPI = new HorribleSubsAPI();

  /**
   * A configured KatAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/kat-api-pt
   */
  _katAPI = new KatAPI();

  /**
   * A configured NyaaAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/nyaa-api-pt
   */
  _nyaaAPI = new NyaaAPI();

  /**
   * A configured OMDB API.
   * @type {Object}
   * @external {OMDB} https://github.com/ChrisAlderson/omdb-api-pt
   */
  _omdbAPI = new OMDB();

  /**
   * A configured TMDB API.
   * @type {Object}
   * @see https://github.com/sarathkcm/TheMovieDBClient
   */
  _tmdbAPI = new TMDB({
    apiv3: '2592f66235042e3e31705e3d56da0a69'
  });

  /**
   * A configured TVDB API.
   * @type {Object}
   * @see https://github.com/edwellbrook/node-tvdb
   */
  _tvdbAPI = new TVDB('B17D23818D6E884D');

  /**
   * A configured Trakt API.
   * @type {Object}
   * @see https://github.com/vankasteelj/trakt.tv
   */
  _traktAPI = new Trakt({
    client_id: '70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907'
  });

  /**
   * A configured YtsAPI API.
   * @type {Object}
   * @see https://github.com/ChrisAlderson/yts-api-pt
   */
  _ytsAPI = new YtsAPI();

  /** Create an ApiFactory class. */
  constructor() {
    super();

    // TODO: fix this hack.
    this._eztvAPI.getAll = this._eztvAPI.getAllShows;
    this._eztvAPI.getData = this._eztvAPI.getShowData;
    this._horribleSubsAPI.getAll = this._horribleSubsAPI.getAllAnime;
    this._horribleSubsAPI.getData = this._horribleSubsAPI.getAnimeData;
    this._ytsAPI.search = this._ytsAPI.getMovies;
  }

  /**
   * Get an external API wrapper based on the name.
   * @override
   * @param {String} api - The name of the external API wrapper.
   * @returns {Object|undefined} - An external API wrapper.
   */
  getApi(api) {
    if (!api) return undefined;

    const a = api.toUpperCase();

    switch (a) {
    case 'EXTRATORRENT':
      return this._extraTorrentAPI;
    case 'EZTV':
      return this._eztvAPI;
    case 'FANART':
      return this._fanartAPI;
    case 'HORRIBLESUBS':
      return this._horribleSubsAPI;
    case 'KAT':
      return this._katAPI;
    case 'NYAA':
      return this._nyaaAPI;
    case 'OMDB':
      return this._omdbAPI;
    case 'TMDB':
      return this._tmdbAPI;
    case 'TRAKT':
      return this._traktAPI;
    case 'TVDB':
      return this._tvdbAPI;
    case 'YTS':
      return this._ytsAPI;
    default:
      return undefined;
    }
  }

}
