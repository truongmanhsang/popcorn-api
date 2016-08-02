// Import the neccesary modules.
import Index from "../controllers/index";
import Animes from "../controllers/animes";
import Movies from "../controllers/movies";
import Shows from "../controllers/shows";

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
    Routes.animes = new Animes();

    /**
     * The movies controller.
     * @type {Movies}
     */
    Routes.movies = new Movies();

    /**
     * The shows controller.
     * @type {Shows}
     */
    Routes.shows = new Shows();

    Routes.setupRoutes(app);
  };

  /**
   * Setup ExpressJS routing.
   * @param {ExpressJS} app - The ExpresssJS application.
   */
  static setupRoutes(app) {
    app.get("/", Routes.index.getIndex);
    app.get("/logs/error", Routes.index.getErrorLog);

    app.get("/animes", Routes.animes.getAnimes);
    app.get("/animes/:page", Routes.animes.getPage);
    app.get("/anime/:id", Routes.animes.getAnime);
    app.get("/random/anime", Routes.animes.getRandomAnime);

    app.get("/movies", Routes.movies.getMovies);
    app.get("/movies/:page", Routes.movies.getPage);
    app.get("/movie/:id", Routes.movies.getMovie);
    app.get("/random/movie", Routes.movies.getRandomMovie);

    app.get("/shows", Routes.shows.getShows);
    app.get("/shows/:page", Routes.shows.getPage);
    app.get("/show/:id", Routes.shows.getShow);
    app.get("/random/show", Routes.shows.getRandomShow);
  };

};
