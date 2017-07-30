// Import the necessary modules.
import IProvider from './providers/IProvider'

/**
 * Class for the scraper context.
 * @type {Context}
 * @flow
 */
export default class Context {

  /**
   * The provider strategy.
   * @type {IProvider}
   */
  _provider: IProvider

  /** Create a Context class. */
  constructor(): void {
    /**
     * Set the default provider strategy.
     * @type {IProvider}
     */
    this._provider = new IProvider()
  }

  /**
   * Execute the current provider strategy.
   * @returns {Promise<Array<Object>, undefined>} - The result of the provider.
   */
  execute(): Promise<Array<Object>, undefined> {
    return this._provider.search()
  }

  /**
   * Set the current provider.
   * @param {!IProvider} provider - The provider to set.
   * @returns {undefined}
   */
  set provider(provider: IProvider): void {
    this._provider = provider
  }

}
