/**
 * Interface for the abstract factory pattern.
 * @interface
 * @type {IAbstractFactory}
 * @flow
 */
export default class IAbstractFactory {

  /**
   * Default method to get an API.
   * @abstract
   * @throws {Error} - Using default method: 'getApi'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getApi(): Error {
    throw new Error('Using default method: \'getApi\'')
  }

  /**
   * Default method to get a helper.
   * @abstract
   * @throws {Error} - Using default method: 'getHelper'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getHelper(): Error {
    throw new Error('Using default method: \'getHelper\'')
  }

  /**
   * Default method to get a model.
   * @abstract
   * @throws {Error} - Using default method: 'getModel'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getModel(): Error {
    throw new Error('Using default method: \'getModel\'')
  }

}
