/**
 * Interface for saving content.
 * @interface
 */
export default class IHelper {

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - Using default method: 'getImages'.
   * @returns {undefined}
   */
  _getImages() {
    throw new Error('Using default method: \'getImages\'');
  }

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - Using default method: 'getTraktInfo'.
   * @returns {undefined}
   */
  getTraktInfo() {
    throw new Error('Using default method: \'getTraktInfo\'');
  }

}
