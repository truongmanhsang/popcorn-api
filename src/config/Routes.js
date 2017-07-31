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
    app.get(
      '/status',
      Routes._IndexController.getIndex.bind(Routes._IndexController)
    )
    app.get(
      '/logs/error',
      Routes._IndexController.getErrorLog.bind(Routes._IndexController)
    )

    app.get(
      '/animes',
      Routes._AnimeController.getContents.bind(Routes._AnimeController)
    )
    app.get(
      '/animes/:page',
      Routes._AnimeController.getPage.bind(Routes._AnimeController)
    )
    app.get(
      '/anime/:id',
      Routes._AnimeController.getContent.bind(Routes._AnimeController)
    )
    app.get(
      '/random/anime',
      Routes._AnimeController.getRandomContent.bind(Routes._AnimeController)
    )

    app.get
      ('/movies',
      Routes._MovieController.getContents.bind(Routes._MovieController)
    )
    app.get
      ('/movies/:page',
      Routes._MovieController.getPage.bind(Routes._MovieController)
     )
    app.get(
      '/movie/:id',
      Routes._MovieController.getContent.bind(Routes._MovieController)
    )
    app.get(
      '/random/movie',
      Routes._MovieController.getRandomContent.bind(Routes._MovieController)
    )

    app.get
      ('/shows',
      Routes._ShowController.getContents.bind(Routes._ShowController)
    )
    app.get(
      '/shows/:page',
      Routes._ShowController.getPage.bind(Routes._ShowController)
    )
    app.get(
      '/show/:id',
      Routes._ShowController.getContent.bind(Routes._ShowController)
    )
    app.get(
      '/random/show',
      Routes._ShowController.getRandomContent.bind(Routes._ShowController)
    )

    app.get(
      '/exports/:collection',
      Routes._ExportController.getExport.bind(Routes._ExportController)
    )
  }

}
