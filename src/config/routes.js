// Import the neccesary modules.
import Index from "../controllers/index";
import Movies from "../controllers/movies";
import Shows from "../controllers/shows";

/**
 * @class
 * @classdesc The factory function for setting up the routes for the API.
 * @memberof module:config/routes
 */
export default class Routes {

  constructor() {
    this.index = new Index();
    this.movies = new Movies();
    this.shows = new Shows();
  };

  /**
   * @description Setup ExpressJS routing.
   * @function Routes#routes
   * @memberof module:config/routes
   * @param {ExpressJS} app - The ExpresssJS application.
   */
  routes(app) {
    app.get("/", this.index.getIndex);
    app.get("/logs/error", this.index.getErrorLog);

    app.get("/movie/:id", this.movies.getMovie);
    app.get("/movies", this.movies.getMovies);
    app.get("/movies/:page", this.movies.getPage);

    app.get("/random/movie", this.movies.getRandomMovie);

    app.get("/show/:id", this.shows.getShow);
    app.get("/shows", this.shows.getShows);
    app.get("/shows/:page", this.shows.getPage);
  };

};
