// Import the neccesary modules.
import AbstractFactory from './AbstractFactory';
import MovieHelper from '../helpers/MovieHelper';
import Provider from '../providers/BaseProvider';
import ShowHelper from '../helpers/ShowHelper';

/**
 * Class for getting a helper class.
 * @implements {AbstractFactory}
 */
export default class HelperFactory extends AbstractFactory {

  /**
   * Get a helper based on the a type.
   * @override
   * @param {String} name - The name for the helper.
   * @param {Object} model - The model object for the helper.
   * @param {String} type - The type of helper to get.
   * @returns {BaseHelper|undefined} - A helper class.
   */
  getHelper(name, model, type) {
    if (!type) return undefined;

    switch (type) {
    case Provider.Types.Movie:
      return new MovieHelper(name, model);
    case Provider.Types.Show:
      return new ShowHelper(name, model);
    default:
      return undefined;
    }
  }

}
