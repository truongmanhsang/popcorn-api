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
   * @returns {undefined}
   */
  getContent(): void {
    throw new Error('Using default method: \'getContent\'')
  }

  /**
   * Default method to extract content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_extractContent'.
   * @returns {undefined}
   */
  _extractContent(): void {
    throw new Error('Using default method: \'_extractContent\'')
  }

  /**
   * Default method to get content data.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getContentData'.
   * @returns {undefined}
   */
  _getContentData(): void {
    throw new Error('Using default method: \'_getContentData\'')
  }

  /**
   * Default method to attach a torrent.
   * @abstract
   * @throws {Error} - Using default method: 'attachTorrent'.
   * @returns {undefined}
   */
  attachTorrent(): void {
    throw new Error('Using default method: \'attachTorrent\'')
  }

  /**
   * Default method to get all content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllContent'.
   * @returns {undefined}
   */
  _getAllContent(): void {
    throw new Error('Using default method: \'_getAllContent\'')
  }

  /**
   * Default method to get all torrents.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllTorrents'.
   * @returns {undefined}
   */
  _getAllTorrents(): void {
    throw new Error('Using default method: \'_getAllTorrents\'')
  }

  /**
   * Default method to search for torrents.
   * @abstract
   * @throws {Error} - Using default method: 'search'.
   * @returns {undefined}
   */
  search(): void {
    throw new Error('Using default method: \'search\'')
  }

}
