// Import the neccesary modules.
import IndexController from '../controllers/IndexController';
import ExportController from '../controllers/ExportController';
import AnimeController from '../controllers/AnimeController';
import MovieController from '../controllers/MovieController';
import ShowController from '../controllers/ShowController';

/** Class for setting up the routes. */
export default class Routes {

  /**
   * The index controller.
   * @type {IndexController}
   */
  _indexController = new IndexController();

  /**
   * The export controller.
   * @type {ExportController}
   */
  _exportController = new ExportController();

  /**
   * The anime controller.
   * @type {AnimeController}
   */
  _animeController = new AnimeController();

  /**
   * The movie controller.
   * @type {MovieController}
   */
  _movieController = new MovieController();

  /**
   * The show controller.
   * @type {ShowController}
   */
  _showController = new ShowController();


  /**
   * Setup ExpressJS routing.
   * @param {Object} app - The ExpresssJS application.
   * @returns {void}
   */
  constructor(app) {
    app.get('/status', this._indexController.getIndex);
    app.get('/logs/error', this._indexController.getErrorLog);

    app.get('/animes', this._animeController.getAnimes);
    app.get('/animes/:page', this._animeController.getPage);
    app.get('/anime/:id', this._animeController.getAnime);
    app.get('/random/anime', this._animeController.getRandomAnime);

    app.get('/movies', this._movieController.getMovies);
    app.get('/movies/:page', this._movieController.getPage);
    app.get('/movie/:id', this._movieController.getMovie);
    app.get('/random/movie', this._movieController.getRandomMovie);

    app.get('/shows', this._showController.getShows);
    app.get('/shows/:page', this._showController.getPage);
    app.get('/show/:id', this._showController.getShow);
    app.get('/random/show', this._showController.getRandomShow);

    app.get('/exports/:collection', this._exportController.getExport);
  }


}
