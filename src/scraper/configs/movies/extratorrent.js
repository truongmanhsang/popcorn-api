// Import the neccesary modules.
import { defaultExtraTorrentMovie } from '../common';
import Provider from '../../providers/MovieProvider';

const ertgBrRip = new Provider({
  api: 'extratorrent',
  modelType: Provider.ModelTypes.Show,
  name: 'ETRG BRRip',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultExtraTorrentMovie, {
    with_words: 'etrg x264 brrip'
  })
});

const etrgBlueRay = new Provider({
  api: 'extratorrent',
  modelType: Provider.ModelTypes.Show,
  name: 'ETRG BluRay',
  type: Provider.Types.Movie,
  query: Object.assign({}, defaultExtraTorrentMovie, {
    with_words: 'etrg x264 bluray'
  })
});

const extratorrentYIFY = new Provider({
  api: 'extratorrent',
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
