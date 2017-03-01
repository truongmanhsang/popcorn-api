// Import the neccesary modules.
import asyncq from 'async-q';
import EztvAPI from 'eztv-api-pt';
import HorribleSubsAPI from 'horriblesubs-api';
import KatAPI from 'kat-api-pt';
import NyaaAPI from 'nyaa-api-pt';
import YtsAPI from 'yts-api-pt';
import { Website as ExtraTorrentAPI } from 'extratorrent-api';

import BaseTorrentProvider from './providers/BaseTorrentProvider';
import TorrentProvider from './providers/TorrentProvider';

import { AnimeMovie, AnimeShow } from './models/Anime';
import Movie from './models/Movie';
import Show from './models/Show';

import MovieExtractor from './providers/extractors/MovieExtractor';
import ShowExtractor from './providers/extractors/ShowExtractor';

import {
  exportCollection,
  onError,
  setLastUpdated,
  setStatus
} from './utils';
import {
  collections,
  providerConfigs
} from './config/constants';

/** Class for scraping movies and shows. */
export default class Scraper {

  /** Create an scraper object. */
  constructor() {
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
     * A configured HorribleSubsAPI API.
     * @type {HorribleSubsAPI}
     * @see https://github.com/ChrisAlderson/horriblesubs-api
     */
    this._horribelSubsAPI = new HorribleSubsAPI();

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
     * A configured YtsAPI API.
     * @type {YtsAPI}
     * @see https://github.com/ChrisAlderson/yts-api-pt
     */
    this._ytsAPI = new YtsAPI();

    // TODO: fix this hack.
    this._eztvAPI.getAll = this._eztvAPI.getAllShows;
    this._eztvAPI.getData = this._eztvAPI.getShowData;
    this._horribelSubsAPI.getAll = this._horribelSubsAPI.getAllAnime;
    this._horribelSubsAPI.getData = this._horribelSubsAPI.getAnimeData;
    this._ytsAPI.search = this._ytsAPI.getMovies;
  }

  /**
   * Start show scraping from torrent providers.
   * @param {Object} Provider - The torrent provider class.
   * @param {Object} providerConfig - The configuration for the torrent
   * provider class.
   * @param {Object} extractor - The object to extract content information from
   * torrents.
   * @returns {Object[]} - A list of all the scraped content.
   */
  async _scrape(Provider, providerConfig, extractor) {
    try {
      const { name } = providerConfig;
      setStatus(`Scraping ${name}`);

      const provider = new Provider(name, extractor);
      const content = await provider.search(providerConfig);

      logger.info(`${name}: Done.`);

      return content;
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Get a torrent provider based on the name of the site.
   * @param {String} site - The name of the torrent site.
   * @returns {Object} - A torrent provider.
   */
  _getProvider(site) {
    if (site === 'eztv' || site === 'horriblesubs')
      return TorrentProvider;

    return BaseTorrentProvider;
  }

  /**
   * Get a model object based on the model string.
   * @param {String} model - The name of the model.
   * @returns {Object} - A model for the helper.
   */
  _getModel(model) {
    const models = {
      animemovie: AnimeMovie,
      animeshow: AnimeShow,
      movie: Movie,
      show: Show
    };

    return models[model];
  }

  /**
   * Get a torrent extractor based on the name of the site.
   * @param {Object} model - The model for the helper.
   * @param {String} name - The name of the provider.
   * @param {String} site - The name of the torrent site.
   * @param {String} type - The type of extractor.
   * @returns {Object} A torrent extractor.
   */
  _getExtractor(model, name, site, type) {
    const extractors = {
      movie: {
        extratorrent: new MovieExtractor({
          model,
          name,
          torrentProvider: this._extraTorrentAPI,
          type
        }),
        kat: new MovieExtractor({
          model,
          name,
          torrentProvider: this._katAPI,
          type
        }),
        nyaa: new MovieExtractor({
          model,
          name,
          torrentProvider: this._nyaaAPI,
          type
        }),
        yts: new MovieExtractor({
          model,
          name,
          torrentProvider: this._ytsAPI,
          type
        })
      },
      show: {
        extratorrent: new ShowExtractor({
          model,
          name,
          torrentProvider: this._extraTorrentAPI,
          type
        }),
        eztv: new ShowExtractor({
          model,
          name,
          torrentProvider: this._eztvAPI,
          type
        }),
        horriblesubs: new ShowExtractor({
          model,
          name,
          torrentProvider: this._horribelSubsAPI,
          type
        }),
        kat: new ShowExtractor({
          model,
          name,
          torrentProvider: this._katAPI,
          type
        })
      }
    };

    return extractors[type][site];
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    setLastUpdated();

    asyncq.eachSeries(providerConfigs, providerConfig => {
      const { name, site, type } = providerConfig;

      const provider = this._getProvider(site);
      const model = this._getModel();
      const extractor = this._getExtractor(model, name, site, type);

      return this._scrape(provider, providerConfig, extractor, type);
    }).then(() => setStatus())
      .then(() => asyncq.eachSeries(collections,
        collection => exportCollection(collection)))
      .catch(err => onError(`Error while scraping: ${err}`));
  }

}
