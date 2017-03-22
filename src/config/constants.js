// Import the neccesary modules.
import path from 'path';

/**
 * An array of the supported collections for mongodb.
 * @type {Array}
 */
export const collections = ['anime', 'movie', 'show'];

/**
 * The cron time for scraping torrents. Default is `0 0 *\/6 * * *`.
 * @type {String}
 */
export const cronTime = '0 0 */6 * * *';

/**
 * The host of the server of the database. Default is `['localhost']`.
 * @type {Array}
 */
export const dbHosts = ['localhost'];

/**
 * The name of the database. Default is `popcorn`.
 * @type {String}
 */
export const dbName = 'popcorn';

/**
 * Check if this instance of the API is the master. Default is `true`.
 * @type {Boolean}
 */
export const master = true;

/**
 * The maximum web requests can take place at the same time. Default is `2`.
 * @type {Number}
 */
export const maxWebRequest = 2;

/**
 * The amount of objects show per page. Default is `50`.
 * @type {Number}
 */
export const pageSize = 50;

/**
 * The port on which the API will run on. Default is `5000`.
 * @type {Number}
 */
export const port = 5000;

/**
 * The name of the server. Default is `serv01`.
 * @type {String}
 */
export const server = 'serv01';

/**
 * The name of the status file holding the `status` value for the index page.
 * Default is `status.json`.
 * @type {String}
 */
export const statusFile = 'status.json';

/**
 * The path to the temprary directory.. Default is `./tmp`.
 * @type {String}
 */
export const tempDir = path.join(process.cwd(), 'tmp');

/**
 * The timezone the conjob will hold. Default is `America/Los_Angeles`.
 * @type {String}
 */
export const timeZone = 'America/Los_Angeles';

/**
 * The name of the updated file holding the `updated` value for the index page.
 * Default is `lastUpdated.json`.
 * @type {String}
 */
export const updatedFile = 'lastUpdated.json';

/**
 * The amount of workers on the cluster. Default is `2`.
 * @type {Number}
 */
export const workers = 2;
