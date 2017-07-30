// Import the necessary modules.
import IAbstractFactory from './IAbstractFactory'
import MovieHelper from '../helpers/MovieHelper'
import Provider from '../providers/BaseProvider'
import ShowHelper from '../helpers/ShowHelper'

/**
 * Class for getting a helper class.
 * @implements {IAbstractFactory}
 * @type {HelperFactory}
 * @flow
 */
export default class HelperFactory extends IAbstractFactory {

  /**
   * Get a helper based on the content type.
   * @override
   * @param {!string} name - The name for the helper.
   * @param {!AnimeMovie|AnimeShow|Movie|Show} model - The model object for
   * the helper.
   * @param {!string} type - The type of helper to get.
   * @returns {MovieHelper|ShowHelper|undefined} - A helper class.
   */
  getHelper(
    name: string,
    model: AnimeMovie | AnimeShow | Movie | Show,
    type: string
  ): MovieHelper | ShowHelper | undefined {
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
