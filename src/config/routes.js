// Import the neccesary modules.
import Index from "../controllers/index";
import Movies from "../controllers/movies";
import Shows from "../controllers/shows";

/**
 * @class
 * @classdesc The factory function for setting up the routes for the API.
 * @memberof module:config/routes
 */
const Routes = () => {

  const index = Index();
  const movies = Movies();
  const shows = Shows();

  /**
   * @description Setup ExpressJS routing.
   * @function Routes#routes
   * @memberof module:config/routes
   * @param {ExpressJS} app - The ExpresssJS application.
   */
  const routes = app => {
    app.get("/", index.getIndex);
    app.get("/logs/error", index.getErrorLog);

    app.get("/movie/:id", movies.getMovie);
    app.get("/movies", movies.getMovies);
    app.get("/movies/:page", movies.getPage);

    app.get("/random/movie", movies.getRandomMovie);

    app.get("/show/:id", shows.getShow);
    app.get("/shows", shows.getShows);
    app.get("/shows/:page", shows.getPage);
  };

  // Return the public functions.
  return { routes };

};

// Export the Routes factory function.
export default Routes;
