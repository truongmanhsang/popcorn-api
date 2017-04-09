// Import the neccesary modules.
import IProvider from './providers/IProvider';

/** Class for the scraper context. */
export default class Context {

  /** Create a new Context class. */
  constructor() {
    /**
     * Set the default provider strategy.
     * @type {IProvider}
     */
    this._provider = new IProvider();
  }

  /**
   * Execute the current provider strategy.
   * @returns {void}
   */
  execute() {
    return this._provider.search();
  }

  /**
   * Set the current provider.
   * @param {Provider} provider - The provider to set.
   * @returns {void}
   */
  set provider(provider) {
    this._provider = provider;
  }

}
