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
    app.get('/status', (req, res) => this._indexController.getIndex(req, res));
    app.get('/logs/error', (req, res) => this._indexController.getErrorLog(req, res));

    app.get('/animes', (req, res) => this._animeController.getContents(req, res));
    app.get('/animes/:page', (req, res) => this._animeController.getPage(req, res));
    app.get('/anime/:id', (req, res) => this._animeController.getContent(req, res));
    app.get('/random/anime', (req, res) => this._animeController.getRandomContent(req, res));

    app.get('/movies', (req, res) => this._movieController.getContents(req, res));
    app.get('/movies/:page', (req, res) => this._movieController.getPage(req, res));
    app.get('/movie/:id', (req, res) => this._movieController.getContent(req, res));
    app.get('/random/movie', (req, res) => this._movieController.getRandomContent(req, res));

    app.get('/shows', (req, res) => this._showController.getContents(req, res));
    app.get('/shows/:page', (req, res) => this._showController.getPage(req, res));
    app.get('/show/:id', (req, res) => this._showController.getContent(req, res));
    app.get('/random/show', (req, res) => this._showController.getRandomContent(req, res));

    app.get('/exports/:collection', (req, res) => this._exportController.getExport(req, res));
  }

}
