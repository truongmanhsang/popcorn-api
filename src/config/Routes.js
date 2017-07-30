// Import the necessary modules.
import IndexController from '../controllers/IndexController'
import ExportController from '../controllers/ExportController'
import AnimeController from '../controllers/contentcontrollers/AnimeController'
import MovieController from '../controllers/contentcontrollers/MovieController'
import ShowController from '../controllers/contentcontrollers/ShowController'

/**
 * Class for setting up the routes.
 * @type {Routes}
 * @flow
 */
export default class Routes {

  /**
   * The index controller.
   * @type {IndexController}
   */
  static _IndexController: IndexController = new IndexController()

  /**
   * The export controller.
   * @type {ExportController}
   */
  static _ExportController: ExportController = new ExportController()

  /**
   * The anime controller.
   * @type {AnimeController}
   */
  static _AnimeController: AnimeController = new AnimeController()

  /**
   * The movie controller.
   * @type {MovieController}
   */
  static _MovieController: MovieController = new MovieController()

  /**
   * The show controller.
   * @type {ShowController}
   */
  static _ShowController: ShowController = new ShowController()

  /**
   * Setup ExpressJS routing.
   * @param {!Express} app - The ExpresssJS application.
   * @returns {undefined}
   */
  static setupRoutes(app: Express): void {
    app.get('/status',
      (req, res) => Routes._IndexController.getIndex(req, res))
    app.get('/logs/error',
      (req, res) => Routes._IndexController.getErrorLog(req, res))

    app.get('/animes',
      (req, res) => Routes._AnimeController.getContents(req, res))
    app.get('/animes/:page',
      (req, res) => Routes._AnimeController.getPage(req, res))
    app.get('/anime/:id',
      (req, res) => Routes._AnimeController.getContent(req, res))
    app.get('/random/anime',
      (req, res) => Routes._AnimeController.getRandomContent(req, res))

    app.get('/movies',
      (req, res) => Routes._MovieController.getContents(req, res))
    app.get('/movies/:page',
      (req, res) => Routes._MovieController.getPage(req, res))
    app.get('/movie/:id',
      (req, res) => Routes._MovieController.getContent(req, res))
    app.get('/random/movie',
      (req, res) => Routes._MovieController.getRandomContent(req, res))

    app.get('/shows',
      (req, res) => Routes._ShowController.getContents(req, res))
    app.get('/shows/:page',
      (req, res) => Routes._ShowController.getPage(req, res))
    app.get('/show/:id',
      (req, res) => Routes._ShowController.getContent(req, res))
    app.get('/random/show',
      (req, res) => Routes._ShowController.getRandomContent(req, res))

    app.get('/exports/:collection',
      (req, res) => Routes._ExportController.getExport(req, res))
  }

}
