// Import the necessary modules.
import IController from './IController'

/**
 * Interface for handling the content endpoints.
 * @interface
 * @type {IContentController}
 * @implements {IController}
 * @flow
 */
export default class IContentController extends IController {

  /**
   * Default method to get content pages.
   * @abstract
   * @throws {Error} - Using default method: 'getContents'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getContents(): Error {
    throw new Error('Using default method: \'getContents\'')
  }

  /**
   * Default method to sort the items.
   * @abstract
   * @throws {Error} - Using default method: 'sortItems'
   * @returns {Error} - Error suggesting to implement this method.
   */
  sortItems(): Error {
    throw new Error('Using default method: \'sortItems\'')
  }

  /**
   * Default method to get a page of content.
   * @abstract
   * @throws {Error} - Using default method: 'getPage'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getPage(): Error {
    throw new Error('Using default method: \'getPage\'')
  }

  /**
   * Default method to get a single content item.
   * @abstract
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getContent(): Error {
    throw new Error('Using default method: \'getContent\'')
  }

  /**
   * Default method to get a random content item.
   * @abstract
   * @throws {Error} - Using default method: 'getRandomContent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getRandomContent(): Error {
    throw new Error('Using default method: \'getRandomContent\'')
  }

}
