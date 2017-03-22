// Import the neccesary modules.
import asyncq from 'async-q';

import Context from './scraper/Context';
import providerConfigs from './scraper/configs';
import Util from './Util';
import { collections } from './config/constants';

/** Class for Initiating the scraping process. */
export default class Scraper {

  /** Initiate the scraping. */
  constructor() {
    Util.setLastUpdated();

    const context = new Context();
    asyncq.eachSeries(providerConfigs, async provider => {
      context.provider = provider;
      await context.execute();
    }).then(() => Util.setStatus())
      .then(() => asyncq.eachSeries(collections,
        collection => Util.exportCollection(collection)))
      .catch(err => Util.onError(`Error while scraping: ${err}`));
  }

}
