/**
 * Interface for scraping content from various sources.
 * @interface
 * @type {IProvider}
 * @flow
 */
export default class IProvider {

  /**
   * Default method to get content.
   * @abstract
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  getContent(): Error {
    throw new Error('Using default method: \'getContent\'')
  }

  /**
   * Default method to extract content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_extractContent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _extractContent(): Error {
    throw new Error('Using default method: \'_extractContent\'')
  }

  /**
   * Default method to get content data.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getContentData'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _getContentData(): Error {
    throw new Error('Using default method: \'_getContentData\'')
  }

  /**
   * Default method to attach a torrent.
   * @abstract
   * @throws {Error} - Using default method: 'attachTorrent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  attachTorrent(): Error {
    throw new Error('Using default method: \'attachTorrent\'')
  }

  /**
   * Default method to get all content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllContent'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _getAllContent(): Error {
    throw new Error('Using default method: \'_getAllContent\'')
  }

  /**
   * Default method to get all torrents.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllTorrents'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  _getAllTorrents(): Error {
    throw new Error('Using default method: \'_getAllTorrents\'')
  }

  /**
   * Default method to search for torrents.
   * @abstract
   * @throws {Error} - Using default method: 'search'.
   * @returns {Error} - Error suggesting to implement this method.
   */
  search(): Error {
    throw new Error('Using default method: \'search\'')
  }

}
