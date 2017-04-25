/**
 * Interface for the abstract factory pattern.
 * @interface
 */
export default class IAbstractFactory {

  /**
   * Default method to get an API.
   * @abstract
   * @throws {Error} - Using default method: 'getApi'.
   * @returns {undefined}
   */
  getApi() {
    throw new Error('Using default method: \'getApi\'');
  }

  /**
   * Default method to get a helper.
   * @abstract
   * @throws {Error} - Using default method: 'getHelper'.
   * @returns {undefined}
   */
  getHelper() {
    throw new Error('Using default method: \'getHelper\'');
  }

  /**
   * Default method to get a model.
   * @abstract
   * @throws {Error} - Using default method: 'getModel'.
   * @returns {undefined}
   */
  getModel() {
    throw new Error('Using default method: \'getModel\'');
  }

}
