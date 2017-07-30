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
   * @returns {undefined}
   */
  getApi(): void {
    throw new Error('Using default method: \'getApi\'')
  }

  /**
   * Default method to get a helper.
   * @abstract
   * @throws {Error} - Using default method: 'getHelper'.
   * @returns {undefined}
   */
  getHelper(): void {
    throw new Error('Using default method: \'getHelper\'')
  }

  /**
   * Default method to get a model.
   * @abstract
   * @throws {Error} - Using default method: 'getModel'.
   * @returns {undefined}
   */
  getModel(): void {
    throw new Error('Using default method: \'getModel\'')
  }

}
