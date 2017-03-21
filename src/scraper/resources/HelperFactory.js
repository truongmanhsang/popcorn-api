// Import the neccesary modules.
import Provider from '../providers/Provider';

import AbstractFactory from './AbstractFactory';
import MovieHelper from '../helpers/MovieHelper';
import ShowHelper from '../helpers/ShowHelper';

export default class HelperFactory extends AbstractFactory {

  getHelper(name, model, type) {
    if (!type) return null;

    switch (type) {
    case Provider.Types.Movie:
      return new MovieHelper(name, model);
    case Provider.Types.Show:
      return new ShowHelper(name, model);
    default:
      return null;
    }
  }

}
