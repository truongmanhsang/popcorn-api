// Import the neccesary modules.
import {
  apiFactory,
  defaultKatMovie
} from '../common';
import Provider from '../../providers/MovieProvider';

const API = apiFactory.getApi('kat');

const katMega = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'Megaradon',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: 'x264 720p | 1080p',
    uploader: 'megaradon',
    language: 'en'
  })
});

const katZoner = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'Z0n321',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: 'x264 720p | 1080p',
    uploader: 'z0n321',
    language: 'en'
  })
});

const katFrench = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'French',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: '720p | 1080p',
    language: 'fr'
  })
});

const katGerman = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'German',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: '720p | 1080p',
    language: 'de'
  })
});

const katSpanish = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'Spanish',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: '720p | 1080p',
    language: 'es'
  })
});

const katDutch = new Provider({
  API,
  modelType: Provider.ModelTypes.Movie,
  name: 'Dutch',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultKatMovie, {
    query: '720p | 1080p',
    language: 'nl'
  })
});

export default [
  katMega,
  katZoner,
  katFrench,
  katGerman,
  katSpanish,
  katDutch
];
