/**
 * Interface for scraping content from various sources.
 * @interface
 */
export default class Provider {

  /**
   * Default method to get content.
   * @abstract
   * @throws {Error} - 'Using default method: 'getContent'.
   * @returns {void}
   */
  getContent() {
    throw new Error('Using default method: \'getContent\'');
  }

  /**
   * Default method to extract content.
   * @abstract
   * @throws {Error} - 'Using default method: '_extractContent'.
   * @returns {void}
   */
  _extractContent() {
    throw new Error('Using default method: \'_extractContent\'');
  }

  /**
   * Default method to get content data.
   * @abstract
   * @throws {Error} - 'Using default method: '_getContentData'.
   * @returns {void}
   */
  _getContentData() {
    throw new Error('Using default method: \'_getContentData\'');
  }

  /**
   * Default method to attach a torrent.
   * @abstract
   * @throws {Error} - 'Using default method: '_attachTorrent'.
   * @returns {void}
   */
  attachTorrent() {
    throw new Error('Using default method: \'_attachTorrent\'');
  }

  /**
   * Default method to get all content.
   * @abstract
   * @throws {Error} - 'Using default method: '_getAllContent'.
   * @returns {void}
   */
  _getAllContent() {
    throw new Error('Using default method: \'_getAllContent\'');
  }

  /**
   * Default method to get all torrents.
   * @abstract
   * @throws {Error} - 'Using default method: '_getAllTorrents'.
   * @returns {void}
   */
  _getAllTorrents() {
    throw new Error('Using default method: \'_getAllTorrents\'');
  }

  /**
   * Default method to search for torrents.
   * @abstract
   * @throws {Error} - 'Using default method: 'search'.
   * @returns {void}
   */
  search() {
    throw new Error('Using default method: \'search\'');
  }

}
