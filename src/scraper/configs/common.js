// Import the neccesary modules.
import FactoryProducer from '../resources/FactoryProducer';
// import BulkProvider from '../providers/BulkProvider';
// import MovieProvider from '../providers/MovieProvider';
// import ShowProvider from '../providers/ShowProvider';

/**
 * The default query object for pagination.
 * @type {Object}
 */
const _page = {
  page: 1
};

/**
 * The default query object for language.
 * @type {Object}
 */
const _language = {
  language: 'en'
};

/**
 * The default query object for KAT verification.
 * @type {Object}
 */
const _katVerified = {
  verified: 1,
  adult_filter:  1
};

/**
 * The default query object for ExtraTorrent shows.
 * @type {Object}
 */
export const defaultExtraTorrentShow = Object.assign({}, _page, {
  category: 'tv'
});

/**
 * The default query object for KAT shows.
 * @type {Object}
 */
export const defaultKatShow = Object.assign({}, _page, _language, _katVerified, {
  category: 'tv'
});

/**
 * The default query object for ExtraTorrent movies.
 * @type {Object}
 */
export const defaultExtraTorrentMovie = Object.assign({}, _page, _language, {
  category: 'movies'
});

/**
 * The default query object for KAT movies.
 * @type {Object}
 */
export const defaultKatMovie = Object.assign({}, _page, _language, _katVerified, {
  category: 'movies'
});

/**
 * The default query object for YTS movies.
 * @type {Object}
 */
export const defaultYTSMovie = Object.assign({}, _page, {
  limit: 50
});

/**
 * The default query object for ExtraTorrent anime.
 * @type {Object}
 */
export const defaultExtraTorrentAnime = Object.assign({}, _page, {
  category: 'anime'
});

/**
 * The default query object for KAT anime.
 * @type {Object}
 */
export const defaultKatAnime = Object.assign({}, _page, _katVerified, {
  category: 'english-translated'
});

/**
 *
 * @type {Object}
 */
export const defaultNyaaAnime = {
  category: 'anime',
  sub_category: 'english_translated',
  offset: 1
};

/**
 *
 * @type {Object}
 */
export const apiFactory = FactoryProducer.getFactory('api');
