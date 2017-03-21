export default class AbstractFactory {

  getApi() {
    throw new Error('This method must be overwritten!');
  }

  getHelper() {
    throw new Error('This method must be overwritten!');
  }

  getModel() {
    throw new Error('This method must be overwritten!');
  }

}
