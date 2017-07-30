// Import the neccesary modules.
import IAbstractFactory from './IAbstractFactory'
import MovieHelper from '../helpers/MovieHelper'
import Provider from '../providers/BaseProvider'
import ShowHelper from '../helpers/ShowHelper'

/**
 * Class for getting a helper class.
 * @implements {IAbstractFactory}
 */
export default class HelperFactory extends IAbstractFactory {

  /**
   * Get a helper based on the content type.
   * @override
   * @param {!String} name - The name for the helper.
   * @param {!AnimeMovie|AnimeShow|Movie|Show} model - The model object for
   * the helper.
   * @param {!String} type - The type of helper to get.
   * @returns {MovieHelper|ShowHelper|undefined} - A helper class.
   */
  getHelper(name, model, type) {
    if (!type || !model || !type) {
      return undefined
    }

    switch (type) {
      case Provider.Types.Movie:
        return new MovieHelper(name, model)
      case Provider.Types.Show:
        return new ShowHelper(name, model)
      default:
        return undefined
    }
  }

}
