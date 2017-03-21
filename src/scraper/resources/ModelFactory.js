// Import the neccesary modules.
import AbstractFactory from './AbstractFactory';
import { AnimeMovie, AnimeShow } from '../../models/Anime';
import Movie from '../../models/Movie';
import Show from '../../models/Show';

export default class ModelFactory extends AbstractFactory {

  getModel(modelType) {
    if (!modelType) return null;

    const mt = modelType.toUpperCase();

    switch (mt) {
    case 'ANIMEMOVIE':
      return AnimeMovie;
    case 'ANIMESHOW':
      return AnimeShow;
    case 'MOVIE':
      return Movie;
    case 'SHOW':
      return Show;
    default:
      return null;
    }
  }

}
