// Import the neccesary modules.
import Index from "../controllers/index";
import Animes from "../controllers/animes";
import Movies from "../controllers/movies";
import Shows from "../controllers/shows";

/**
 * @class
 * @classdesc The factory function for setting up the routes for the API.
 * @memberof module:config/routes
 */
export default class Routes {

  constructor(app) {
    Routes.index = new Index();
    Routes.animes = new Animes();
    Routes.movies = new Movies();
    Routes.shows = new Shows();

    Routes.setupRoutes(app);
  };

  /**
   * @description Setup ExpressJS routing.
   * @function Routes#routes
   * @memberof module:config/routes
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
