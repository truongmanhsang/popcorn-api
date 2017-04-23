// Import the neccesary modules.
import IProvider from './providers/IProvider';

/** Class for the scraper context. */
export default class Context {

  /**
   * Set the default provider strategy.
   * @type {IProvider}
   */
  _provider = new IProvider();

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
