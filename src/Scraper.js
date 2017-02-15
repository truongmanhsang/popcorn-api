// Import the neccesary modules.
import asyncq from 'async-q';
import ExtraTorrentAPI from 'extratorrent-api';
import EztvAPI from 'eztv-api-pt';
import HorribleSubsAPI from 'horriblesubs-api';
import KatAPI from 'kat-api-pt';
import NyaaAPI from 'nyaa-api-pt';
import YtsAPI from 'yts-api-pt';

import BaseTorrentProvider from './providers/BaseTorrentProvider';
import TorrentProvider from './providers/TorrentProvider';

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

  /**
   * Start show scraping from torrent providers.
   * @param {Object} Provider - The torrent provider class.
   * @param {Object} providerConfig - The configuration for
   * the torrent provider class.
   * @param {Object} extractor - The object to extract
   * content information from torrents.
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
   * Get a torrent extractor based on the name of the site.
   * @param {String} site - The name of the torrent site.
   * @returns {Object} A torrent extractor.
   */
  _getExtractor(site) {
    switch (site) {
    case 'eztv': {
      return new EztvAPI();
    }
    case 'extratorrent': {
      return new ExtraTorrentAPI();
    }
    case 'horriblesubs': {
      return new HorribleSubsAPI();
    }
    case 'kat': {
      return new KatAPI();
    }
    case 'nyaa': {
      return new NyaaAPI();
    }
    case 'yts': {
      return new YtsAPI();
    }
    default: {
      return new Error(`${site} is not a supported site!`);
    }
    }
  }

  /**
   * Initiate the scraping.
   * @returns {void}
   */
  scrape() {
    setLastUpdated();

    asyncq.eachSeries(providerConfigs, providerConfig => {
      const { site } = providerConfig;

      const provider = this._getProvider(site);
      const extractor = this._getExtractor(site);

      return this._scrape(provider, providerConfig, extractor);
    }).then(() => setStatus())
      .then(() => asyncq.eachSeries(collections, collection => exportCollection(collection)))
      .catch(err => onError(`Error while scraping: ${err}`));
  }

}
