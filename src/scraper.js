// Import the neccesary modules.
import asyncq from 'async-q';

import Context from './scraper/Context';
import providerConfigs from './scraper/configs';
import {
  exportCollection,
  onError,
  setLastUpdated,
  setStatus
} from './utils';
import { collections } from './config/constants';

/**
 * Initiate the scraping.
 * @returns {void}
 */
export default function executeScraper() {
  setLastUpdated();

  const context = new Context();
  asyncq.eachSeries(providerConfigs, async provider => {
    context.provider = provider;
    await context.execute();
  }).then(() => setStatus())
    .then(() => asyncq.eachSeries(collections,
      collection => exportCollection(collection)))
    .catch(err => onError(`Error while scraping: ${err}`));
}
