/**
 * Interface for scraping content from various sources.
 * @interface
 */
export default class IProvider {

  /**
   * Default method to get content.
   * @abstract
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {undefined}
   */
  getContent() {
    throw new Error('Using default method: \'getContent\'')
  }

  /**
   * Default method to extract content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_extractContent'.
   * @returns {undefined}
   */
  _extractContent() {
    throw new Error('Using default method: \'_extractContent\'')
  }

  /**
   * Default method to get content data.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getContentData'.
   * @returns {undefined}
   */
  _getContentData() {
    throw new Error('Using default method: \'_getContentData\'')
  }

  /**
   * Default method to attach a torrent.
   * @abstract
   * @throws {Error} - Using default method: 'attachTorrent'.
   * @returns {undefined}
   */
  attachTorrent() {
    throw new Error('Using default method: \'attachTorrent\'')
  }

  /**
   * Default method to get all content.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllContent'.
   * @returns {undefined}
   */
  _getAllContent() {
    throw new Error('Using default method: \'_getAllContent\'')
  }

  /**
   * Default method to get all torrents.
   * @abstract
   * @protected
   * @throws {Error} - Using default method: '_getAllTorrents'.
   * @returns {undefined}
   */
  _getAllTorrents() {
    throw new Error('Using default method: \'_getAllTorrents\'')
  }

  /**
   * Default method to search for torrents.
   * @abstract
   * @throws {Error} - Using default method: 'search'.
   * @returns {undefined}
   */
  search() {
    throw new Error('Using default method: \'search\'')
  }

}
