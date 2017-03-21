// Import the neccesary modules.
import Provider from './providers/Provider';

export default class Context {

  constructor() {
    this._provider = new Provider();
  }

  execute() {
    return this._provider.search();
  }

  set provider(provider) {
    this._provider = provider;
  }

}
