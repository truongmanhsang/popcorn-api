const global = {
  master: true,
  port: 5000,
  workers: 2,
  scrapeTime: "0 0 */6 * * *",
  pageSize: 50,
  serverName: "serv01",
  tempDir: `${process.cwd()}/tmp`,
  statusFile: "status.json",
  updatedFile: "lastUpdated.json",
  dbHosts: ["localhost"],
  maxWebRequest: 2,
  webRequestTimeout: 2,
  traktKey: "70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907",
  Promise
};

/**
 * @class Global
 * @classdesc Holder to export all the global configuration objects.
 * @memberof module:config/global
 * @property {Object} global - The configuration object with properties
 * used over the whole API.
 */
export { global };
