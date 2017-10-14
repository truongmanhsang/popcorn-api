/**
 * Interface for the route controllers.
 * @interface
 * @type {IController}
 * @flow
 */
export default class IController {

  /**
   * Default method to register the routes.
   * @abstract
   * @throws {Error} - Using default method: 'registerRoutes'
   * @returns {Error} - Error suggesting to implement this method.
   */
  registerRoutes(): Error {
    throw new Error('Using default method: \'registerRoutes\'')
  }

}
