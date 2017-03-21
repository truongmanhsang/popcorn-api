// Import the neccesary modules.
import {
  apiFactory,
  defaultExtraTorrentMovie
} from '../common';
import Provider from '../../providers/MovieProvider';

const API = apiFactory.getApi('extratorrent');

const ertgBrRip = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETRG BRRip',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultExtraTorrentMovie, {
    with_words: 'etrg x264 brrip'
  })
});

const etrgBlueRay = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETRG BluRay',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultExtraTorrentMovie, {
    with_words: 'etrg x264 bluray'
  })
});

const extratorrentYIFY = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'YIFY',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultExtraTorrentMovie, {
    with_words: 'x264 yify brrip'
  })
});

export default [
  ertgBrRip,
  etrgBlueRay,
  extratorrentYIFY
];
