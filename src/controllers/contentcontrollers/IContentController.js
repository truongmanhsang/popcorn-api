/**
 * Interface for handling the content endpoints.
 * @interface
 */
export default class IContentController {

  /**
   * Default method to get content pages.
   * @abstract
   * @throws {Error} - Using default method: 'getContents'.
   * @returns {undefined}
   */
  getContents() {
    throw new Error('Using default method: \'getContents\'');
  }

  /**
   * Default method to get a page of content.
   * @abstract
   * @throws {Error} - Using default method: 'getPage'.
   * @returns {undefined}
   */
  getPage() {
    throw new Error('Using default method: \'getPage\'');
  }

  /**
   * Default method to get a single content item.
   * @abstract
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {undefined}
   */
  getContent() {
    throw new Error('Using default method: \'getContent\'');
  }

  /**
   * Default method to get a random conent item.
   * @abstract
   * @throws {Error} - Using default method: 'getRandomContent'.
   * @returns {undefined}
   */
  getRandomContent() {
    throw new Error('Using default method: \'getRandomContent\'');
  }

}
