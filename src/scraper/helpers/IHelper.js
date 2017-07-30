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
   * @returns {undefined}
   */
  _checkImages(): void {
    throw new Error('Using default method: \'_checkImages\'')
  }

  /**
   * Default method to get images.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getImages'.
   * @returns {undefined}
   */
  _getImages(): void {
    throw new Error('Using default method: \'_getImages\'')
  }

  /**
   * Default method to get images.
   * @abstract
   * @throws {Error} - Using default method: 'getTraktInfo'.
   * @returns {undefined}
   */
  getTraktInfo(): void {
    throw new Error('Using default method: \'getTraktInfo\'')
  }

}
