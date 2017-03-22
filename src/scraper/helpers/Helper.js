/**
 * Interface for saving content.
 * @interface
 */
export default class Helper {

  /**
   * Default method to check for images.
   * @abstract
   * @throws {Error} - 'Using default method: 'checkImages'.
   * @returns {void}
   */
  _checkImages() {
    throw new Error('Using default method: \'checkImages\'');
  }

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - 'Using default method: 'getImages'.
   * @returns {void}
   */
  _getImages() {
    throw new Error('Using default method: \'getImages\'');
  }

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - 'Using default method: 'getTraktInfo'.
   * @returns {void}
   */
  getTraktInfo() {
    throw new Error('Using default method: \'getTraktInfo\'');
  }

}
