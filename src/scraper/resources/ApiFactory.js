// Import the neccesary modules.
import EztvAPI from 'eztv-api-pt';
import Fanart from 'fanart.tv-api';
import HorribleSubsAPI from 'horriblesubs-api';
import KatAPI from 'kat-api-pt';
import NyaaAPI from 'nyaa-api-pt';
import OMDB from 'omdb-api-pt';
import TMDB from 'themoviedbclient';
import Trakt from 'trakt.tv';
import TVDB from 'node-tvdb';
import YtsAPI from 'yts-api-pt';
import { Website as ExtraTorrentAPI } from 'extratorrent-api';

import AbstractFactory from './AbstractFactory';

export default class ApiFactory extends AbstractFactory {

  constructor() {
    super();

    /**
     * A configured ExtraTorrentAPI API.
     * @type {ExtraTorrentAPI}
     * @see https://github.com/ChrisAlderson/extratorrent-api
     */
    this._extraTorrentAPI = new ExtraTorrentAPI();

    /**
     * A configured EztvAPI API.
     * @type {EztvAPI}
     * @see https://github.com/ChrisAlderson/eztv-api-pt
     */
    this._eztvAPI = new EztvAPI();

    /**
     * A configured Fanart API.
     * @type {Trakt}
     * @see https://github.com/vankasteelj/trakt.tv
     */
    this._fanartAPI = new Fanart({
      api_key: 'bd2753f04538b01479e39e695308b921'
    });

    /**
     * A configured HorribleSubsAPI API.
     * @type {HorribleSubsAPI}
     * @see https://github.com/ChrisAlderson/horriblesubs-api
     */
    this._horribleSubsAPI = new HorribleSubsAPI();

    /**
     * A configured KatAPI API.
     * @type {KatAPI}
     * @see https://github.com/ChrisAlderson/kat-api-pt
     */
    this._katAPI = new KatAPI();

    /**
     * A configured NyaaAPI API.
     * @type {NyaaAPI}
     * @see https://github.com/ChrisAlderson/nyaa-api-pt
     */
    this._nyaaAPI = new NyaaAPI();

    /**
     * A configured OMDB API.
     * @type {OMDB}
     * @see https://github.com/ChrisAlderson/omdb-api-pt
     */
    this._omdbAPI = new OMDB();

    /**
     * A configured TMDB API.
     * @type {TMDB}
     * @see https://github.com/sarathkcm/TheMovieDBClient
     */
    this._tmdbAPI = new TMDB('2592f66235042e3e31705e3d56da0a69');

    /**
     * A configured TVDB API.
     * @type {TVDB}
     * @see https://github.com/edwellbrook/node-tvdb
     */
    this._tvdb = new TVDB('B17D23818D6E884D');

    /**
     * A configured Trakt API.
     * @type {Trakt}
     * @see https://github.com/vankasteelj/trakt.tv
     */
    this._traktAPI = new Trakt({
      client_id: '70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907'
    });

    /**
     * A configured YtsAPI API.
     * @type {YtsAPI}
     * @see https://github.com/ChrisAlderson/yts-api-pt
     */
    this._ytsAPI = new YtsAPI();

    // TODO: fix this hack.
    this._eztvAPI.getAll = this._eztvAPI.getAllShows;
    this._eztvAPI.getData = this._eztvAPI.getShowData;
    this._horribleSubsAPI.getAll = this._horribleSubsAPI.getAllAnime;
    this._horribleSubsAPI.getData = this._horribleSubsAPI.getAnimeData;
    this._ytsAPI.search = this._ytsAPI.getMovies;
  }

  getApi(api) {
    if (!api) return null;

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
      return null;
    }
  }

}
