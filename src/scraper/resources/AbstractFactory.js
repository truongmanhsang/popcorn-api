/**
 * Interface for the abstract factory pattern.
 * @interface
 */
export default class AbstractFactory {

  /**
   * Default method to get an API.
   * @abstract
   * @throws {Error} - 'Using default method: 'getApi'.
   * @returns {void}
   */
  getApi() {
    throw new Error('Using default method: \'getApi\'');
  }

  /**
   * Default method to get a helper.
   * @abstract
   * @throws {Error} - 'Using default method: 'getHelper'.
   * @returns {void}
   */
  getHelper() {
    throw new Error('Using default method: \'getHelper\'');
  }

  /**
   * Default method to get a model.
   * @abstract
   * @throws {Error} - 'Using default method: 'getModel'.
   * @returns {void}
   */
  getModel() {
    throw new Error('Using default method: \'getModel\'');
  }

}
