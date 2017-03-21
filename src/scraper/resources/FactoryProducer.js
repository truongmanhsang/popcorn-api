// Import the neccesary modules.
import ApiFactory from './ApiFactory';
import HelperFactory from './HelperFactory';
import ModelFactory from './ModelFactory';

export default class FactoryProducer {

  static getFactory(choice) {
    if (!choice) return null;

    const c = choice.toUpperCase();

    switch (c) {
    case 'API':
      return new ApiFactory();
    case 'HELPER':
      return new HelperFactory();
    case 'MODEL':
      return new ModelFactory();
    default:
      return null;
    }
  }

}
