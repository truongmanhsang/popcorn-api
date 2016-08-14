// Import the neccesary modules.
import path from "path";
import Trakt from "trakt.tv";
import TVDB from "node-tvdb";

/**
 * Map object for correcting anime slugs.
 * @type {Object}
 */
export const animeMap = {
  "kabaneri-of-the-iron-fortress": "koutetsujou-no-kabaneri",
  "luck-&-logic": "luck-logic",
  "naruto-shippuuden": "naruto-shippuden",
  "norn9norn+nonet": "norn9-norn-nonet",
  "sailor-moon-crystal": "bishoujo-senshi-sailor-moon-crystal",
  "yuruyuri": "yuru-yuri"
};

/**
 * An array of the supported collections for mongodb.
 * @type {Array}
 */
export const collections = ["anime", "movie", "show"];

/**
 * The cron time for scraping torrents. Default is `0 0 *\/6 * * *`.
 * @type {String}
 */
export const cronTime = "0 0 */6 * * *";

/**
 * The host of the server of the database. Default is `["localhost"]`.
 * @type {Array}
 */
export const dbHosts = ["localhost"];

/**
 * The name of the database. Default is `popcorn`.
 * @type {String}
 */
export const dbName = "popcorn";

/**
 * The providers for scraping ExtraTorrent for anime.
 * @type {Array}
 */
export const extratorrentAnimeProviders = [];

/**
 * The providers for scraping ExtraTorrent for movies.
 * @type {Array}
 */
export const extratorrentMovieProviders = [
  {name: "ETRG BRRip", query: {with_words: "etrg x264 brrip"}},
  {name: "ETRG BluRay", query: {with_words: "etrg x264 bluray"}},
  {name: "YIFY", query: {with_words: "x264 yify brrip"}}
];

/**
 * The providers for scraping ExtraTorrent for shows.
 * @type {Array}
 */
export const extratorrentShowProviders = [
  // 480p
  {name: "ETTV LOL", query: {with_words: "ettv hdtv x264 lol", without: "720p 1080p"}},
  {name: "ETTV KILLERS", query: {with_words: "ettv hdtv x264 killers", without: "720p 1080p"}},
  {name: "ETTV 2HD", query: {with_words: "ettv hdtv x264 2hd", without: "720p 1080p"}},
  {name: "ETTV CROOKS", query: {with_words: "ettv hdtv x264 crooks", without: "720p 1080p"}},
  {name: "ETTV FUM", query: {with_words: "ettv hdtv x264 fum", without: "720p 1080p"}},
  {name: "ETTV BATV", query: {with_words: "ettv hdtv x264 batv", without: "720p 1080p"}},
  {name: "ETTV ASAP", query: {with_words: "ettv hdtv x264 asap", without: "720p 1080p"}},
  {name: "ETTV TLA", query: {with_words: "ettv hdtv x264 tla", without: "720p 1080p"}},
  {name: "ETTV W4F", query: {with_words: "ettv hdtv x264 w4f", without: "720p 1080p"}},
  {name: "ETTV EVOLVE", query: {with_words: "ettv hdtv x264 EVOLVE", without: "720p 1080p"}},
  {name: "ETTV ORGANiC", query: {with_words: "ettv hdtv x264 organic", without: "720p 1080p"}},
  {name: "ETTV BAJSKORV", query: {with_words: "ettv hdtv x264 bajskorv", without: "720p 1080p"}},
  {name: "ETTV RiVER", query: {with_words: "ettv hdtv x264 river", without: "720p 1080p"}},

  // 720p
  {name: "ETTV 720p", query: {with_words: "ettv hdtv x264 720p"}},
  {name: "ETHD 720p", query: {with_words: "ethd hdtv x264 720p"}},

  // 1080p
  {name: "1080p", query: {width_words: "hdtv x264 1080p"}}
];

/**
 * The providers for scraping KAT for anime.
 * @type {Array}
 */
export const katAnimeProviders = [];

/**
 * The providers for scraping KAT for movies.
 * @type {Array}
 */
export const katMovieProviders = [
  // English providers
  {name: "Megaradon", query: {query: "x264 720p | 1080p", uploader: "megaradon", language: "en"}},
  {name: "Z0n321", query: {query: "x264 720p | 1080p", uploader: "z0n321", language: "en"}},

  // French providers
  {name: "French", query: {query: "720p | 1080p", language: "fr"}},
  // German providers
  {name: "German", query: {query: "720p | 1080p", language: "de"}},
  // Spanish providers
  {name: "Spanish", query: {query: "720p | 1080p", language: "es"}},
  // Ductch providers
  {name: "Dutch", query: {query: "720p | 1080p", language: "nl"}}
];

/**
 * The providers for scraping KAT for shows.
 * @type {Array}
 */
export const katShowProviders = [
  // 720p and 1080p providers
  {name: "Zoner720p", query: {query: "x264 720p", uploader: "z0n321"}},
  {name: "Zoner1080p", query: {query: "x264 1080p", uploader: "z0n321"}},
  {name: "Brasse0", query: {query: "x264", uploader: "brasse0"}},
  {name: "ETHD", query: {query: "x264", uploader: "ethd"}},

  // Uploader providers
  {name: "ETTV", query: {query: "x264", uploader: "ettv"}},
  {name: "KAT_EZTV", query: {query: "x264", uploader: "eztv"}},
  {name: "VTV", query: {query: "x264", uploader: "vtv"}},
  {name: "SRIGGA", query: {query: "x264", uploader: "ethd"}},

  // Zoner providers
  {name: "ZonerSD", query: {query: "x264 LOL | FLEET | KILLERS | W4F", uploader: "z0n321"}}
];

/**
 * Check if this instance of the API is the master. Default is `true`.
 * @type {Boolean}
 */
export const master = true;

/**
 * The maximum web requests can take place at the same time. Default is `2`.
 * @type {Integer}
 */
export const maxWebRequest = 2;

/**
 * Map object for correcting movie slugs.
 * @type {Object}
 */
export const movieMap = {};

/**
 * The amount of object show per page. Default is `50`.
 * @type {Integer}
 */
export const pageSize = 50;

/**
 * The port on which the API will run on. Default is `5000`.
 * @type {Integer}
 */
export const port = 5000;

/**
 * The promise object to override the mongoose promise object. Default is `global.Promise`.
 * @type {Promise}
 */
export const Promise = global.Promise;

/**
 * The name of the server. Default is `serv01`.
 * @type {String}
 */
export const server = "serv01";

/**
 * Map object for correcting show slugs.
 * @type {Object}
 */
export const showMap = {
  "60-minutes-us": "60-minutes",
  "american-crime": "american-crime-1969",
  "bachelor-live": "the-bachelor-live",
  "ballers-2015": "ballers",
  "big-brother-us": "big-brother-2000",
  "blackish": "black-ish",
  "bobs-burgers": "bob-s-burgers",
  "bordertown-2015": "bordertown-2016",
  "celebrity-big-brother": "celebrity-big-brother-2001",
  "chicago-pd": "chicago-p-d",
  "childrens-hospital-us": "childrens-hospital",
  "cooper-barretts-guide-to-surviving-life": "cooper-barrett-s-guide-to-surviving-life-2016",
  "cosmos-a-space-time-odyssey": "cosmos-a-spacetime-odyssey",
  "dcs-legends-of-tomorrow": "dc-s-legends-of-tomorrow",
  "doll-and-em": "doll-em",
  "gold-rush": "gold-rush-2010",
  "greys-anatomy": "grey-s-anatomy",
  "hawaii-five-0-2010": "hawaii-five-0",
  "heartland-ca": "heartland-2007-ca",
  "hells-kitchen-us": "hell-s-kitchen-2005",
  "house-of-cards-2013": "house-of-cards",
  "how-its-made-dream-cars": "how-it-s-made-dream-cars",
  "how-its-made": "how-it-s-made",
  "intelligence-us": "intelligence-2014",
  "its-always-sunny-in-philadelphia": "it-s-always-sunny-in-philadelphia",
  "james-mays-cars-of-the-people": "james-may-s-cars-of-the-people",
  "jericho-2016": "jericho-1969",
  "kitchen-nightmares-us": "kitchen-nightmares",
  "last-man-standing-us": "last-man-standing-2011",
  "law-and-order-svu": "law-order-special-victims-unit",
  "marvels-agent-carter": "marvel-s-agent-carter",
  "marvels-agents-of-s-h-i-e-l-d": "marvel-s-agents-of-s-h-i-e-l-d",
  "marvels-daredevil": "marvel-s-daredevil",
  "marvels-jessica-jones": "marvel-s-jessica-jones",
  "mike-and-molly": "mike-molly",
  "perception": "perception-2012",
  "power-2014": "power",
  "prey-uk": "prey-2014",
  "proof-us": "proof",
  "reckless": "reckless-2014",
  "resurrection-us": "resurrection-2014",
  "revolution-2012": "revolution",
  "rush-us": "rush-2014",
  "sanctuary-us": "sanctuary",
  "satisfaction-us": "satisfaction-2014",
  "scandal-us": "scandal",
  "schitts-creek": "schitt-s-creek",
  "second-chance": "second-chance-2016",
  "stan-lees-lucky-man": "stan-lee-s-lucky-man",
  "survivors-remorse": "survivor-s-remorse",
  "teen-wolf": "teen-wolf-2011",
  "the-bridge-us": "the-bridge-2013",
  "the-comedians-us": "the-comedians-2015",
  "the-kennedys-uk": "the-kennedys-2015",
  "the-league": "the-league-2009",
  "the-librarians-us": "the-librarians-2014",
  "the-magicians-us": "the-magicians",
  "this-is-england-90": "this-is-england-90-2015",
  "whose-line-is-it-anyway-us": "whose-line-is-it-anyway-1998",
  "young-and-hungry": "young-hungry",
  "youre-the-worst-2014": "you-re-the-worst",
  "youre-the-worst": "you-re-the-worst"
};

/**
 * The name of the status file holding the `status` value for the index page. Default is `status.json`.
 * @type {String}
 */
export const statusFile = "status.json";

/**
 * The path to the temprary directory.. Default is `./tmp`.
 * @type {String}
 */
export const tempDir = path.join(process.cwd(), "tmp");

/**
 * The timezone the conjob will hold. Default is `America/Los_Angeles`.
 * @type {String}
 */
export const timeZone = "America/Los_Angeles";

/**
 * A configured Trakt API.
 * @type {Trakt}
 */
export const trakt = new Trakt({client_id: "70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907"});

/**
 * A configured TVDB API.
 * @type {TVDB}
 */
export const tvdb = new TVDB("B17D23818D6E884D");

/**
 * The name of the updated file holding the `updated` value for the index page. Default is `lastUpdated.json`.
 * @type {String}
 */
export const updatedFile = "lastUpdated.json";

/**
 * The maximum time a web request may take. Default is `2` seconds.
 * @type {Integer}
 */
export const webRequestTimeout = 2;

/**
 * The amount of workers on the cluster. Default is `2`.
 * @type {Integer}
 */
export const workers = 2;
