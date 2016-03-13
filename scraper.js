const async = require("async-q"),
  config = require("./config"),
  eztv = require("./providers/eztv")("EZTV"),
  util = require("./util");

/* Start scraping from KAT. */
const scrapeKAT = () => {
  return async.eachSeries(config.providers, (provider) => {
    util.setStatus("Scraping " + provider.name);
    const kat = require("./providers/kat")(provider.name);
    return util.spawn(kat.search(provider)).then((response) => {
      console.log(provider.name + ": Done.");
      return response;
    });
  });
};

/* Start scraping from EZTV. */
const scrapeEZTV = () => {
  util.setStatus("Scraping " + eztv.name);
  return util.spawn(eztv.search()).then((response) => {
    console.log(eztv.name + ": Done.");
    return response;
  });
};

module.exports = {

  /* Initiate the scraping. */
  scrape: () => {
    util.resetTemp();
    util.setlastUpdate();

    async.eachSeries([scrapeEZTV, scrapeKAT], (scraper) => {
      return scraper();
    }).catch((err) => {
      util.onError("Error while scraping: " + err);
      return err;
    }).done();
  }

};
