/**
 * Interface for handling the content endpoints.
 * @interface
 * @type {IContentController}
 * @flow
 */
export default class IContentController {

  /**
   * Default method to get content pages.
   * @abstract
   * @throws {Error} - Using default method: 'getContents'.
   * @returns {undefined}
   */
  getContents(): void {
    throw new Error('Using default method: \'getContents\'')
  }

  /**
   * Default method to get a page of content.
   * @abstract
   * @throws {Error} - Using default method: 'getPage'.
   * @returns {undefined}
   */
  getPage(): void {
    throw new Error('Using default method: \'getPage\'')
  }

  /**
   * Default method to get a single content item.
   * @abstract
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {undefined}
   */
  getContent(): void {
    throw new Error('Using default method: \'getContent\'')
  }

  /**
   * Default method to get a random conent item.
   * @abstract
   * @throws {Error} - Using default method: 'getRandomContent'.
   * @returns {undefined}
   */
  getRandomContent(): void {
    throw new Error('Using default method: \'getRandomContent\'')
  }

}
