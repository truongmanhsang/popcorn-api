/**
 * Interface for saving content.
 * @interface
 * @type {IHelper}
 * @flow
 */
export default class IHelper {

  /**
   * Default method to check images.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_checkImages'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _checkImages(): Error {
    throw new Error('Using default method: \'_checkImages\'')
  }

  /**
   * Default method to get images.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getImages'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _getImages(): Error {
    throw new Error('Using default method: \'_getImages\'')
  }

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - Using default method: 'getTraktInfo'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getTraktInfo(): Error {
    throw new Error('Using default method: \'getTraktInfo\'')
  }

}
