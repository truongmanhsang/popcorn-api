// Import the neccesary modules.
import IndexController from '../controllers/IndexController';
import ExportController from '../controllers/ExportController';
import AnimeController from '../controllers/AnimeController';
import MovieController from '../controllers/MovieController';
import ShowController from '../controllers/ShowController';

/**
 * The index controller.
 * @type {IndexController}
 */
const _indexController = new IndexController();

/**
 * The export controller.
 * @type {ExportController}
 */
const _exportController = new ExportController();

/**
 * The anime controller.
 * @type {AnimeController}
 */
const _animeController = new AnimeController();

/**
 * The movie controller.
 * @type {MovieController}
 */
const _movieController = new MovieController();

/**
 * The show controller.
 * @type {ShowController}
 */
const _showController = new ShowController();

/**
 * Setup ExpressJS routing.
 * @param {ExpressJS} app - The ExpresssJS application.
 * @returns {void}
 */
export default function setupRoutes(app) {
  app.get('/status', _indexController.getIndex);
  app.get('/logs/error', _indexController.getErrorLog);

  app.get('/animes', _animeController.getAnimes);
  app.get('/animes/:page', _animeController.getPage);
  app.get('/anime/:id', _animeController.getAnime);
  app.get('/random/anime', _animeController.getRandomAnime);

  app.get('/movies', _movieController.getMovies);
  app.get('/movies/:page', _movieController.getPage);
  app.get('/movie/:id', _movieController.getMovie);
  app.get('/random/movie', _movieController.getRandomMovie);

  app.get('/shows', _showController.getShows);
  app.get('/shows/:page', _showController.getPage);
  app.get('/show/:id', _showController.getShow);
  app.get('/random/show', _showController.getRandomShow);

  app.get('/exports/:collection', _exportController.getExport);
}
