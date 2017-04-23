// Import the neccesary modules.
import IndexController from '../controllers/IndexController';
import ExportController from '../controllers/ExportController';
import AnimeController from '../controllers/contentcontrollers/AnimeController';
import MovieController from '../controllers/contentcontrollers/MovieController';
import ShowController from '../controllers/contentcontrollers/ShowController';

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

    app.get('/animes', this._animeController.getContents);
    app.get('/animes/:page', this._animeController.getPage);
    app.get('/anime/:id', this._animeController.getContent);
    app.get('/random/anime', this._animeController.getRandomContent);

    app.get('/movies', this._movieController.getContents);
    app.get('/movies/:page', this._movieController.getPage);
    app.get('/movie/:id', this._movieController.getContent);
    app.get('/random/movie', this._movieController.getRandomContent);

    app.get('/shows', this._showController.getContents);
    app.get('/shows/:page', this._showController.getPage);
    app.get('/show/:id', this._showController.getContent);
    app.get('/random/show', this._showController.getRandomContent);

    app.get('/exports/:collection', this._exportController.getExport);
  }

}
