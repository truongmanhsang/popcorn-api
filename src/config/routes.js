// Import the neccesary modules.
import Index from "../controllers/index";
import Animes from "../controllers/animes";
import Movies from "../controllers/movies";
import Shows from "../controllers/shows";
import Exports from "../controllers/exports";

/** Class for setting up the routes for the API. */
export default class Routes {

  /**
   * Create a routes object.
   * @param {Express} app - The ExpresssJS instance.
   */
  constructor(app) {
    /**
     * The index controller.
     * @type {Index}
     */
    Routes.index = new Index();

    /**
     * The animes controller.
     * @type {Animes}
     */
    Routes._animes = new Animes();

    /**
     * The movies controller.
     * @type {Movies}
     */
    Routes._movies = new Movies();

    /**
     * The shows controller.
     * @type {Shows}
     */
    Routes._shows = new Shows();

    /**
     * The exports controller.
     * @type {Exports}
     */
    Routes._exports = new Exports();

    Routes._setupRoutes(app);
  };

  /**
   * Setup ExpressJS routing.
   * @param {ExpressJS} app - The ExpresssJS application.
   */
  static _setupRoutes(app) {
    app.get("/", Routes.index.getIndex);
    app.get("/logs/error", Routes.index.getErrorLog);

    app.get("/animes", Routes._animes.getAnimes);
    app.get("/animes/:page", Routes._animes.getPage);
    app.get("/anime/:id", Routes._animes.getAnime);
    app.get("/random/anime", Routes._animes.getRandomAnime);

    app.get("/movies", Routes._movies.getMovies);
    app.get("/movies/:page", Routes._movies.getPage);
    app.get("/movie/:id", Routes._movies.getMovie);
    app.get("/random/movie", Routes._movies.getRandomMovie);

    app.get("/shows", Routes._shows.getShows);
    app.get("/shows/:page", Routes._shows.getPage);
    app.get("/show/:id", Routes._shows.getShow);
    app.get("/random/show", Routes._shows.getRandomShow);

    app.get("/exports/:collection", Routes._exports.getExport);
  };

};
