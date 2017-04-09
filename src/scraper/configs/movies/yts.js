// Import the neccesary modules.
import { defaultYTSMovie } from '../common';
import Provider from '../../providers/YTSProvider';

const yts = new Provider({
  api: 'yts',
  name: 'YTS',
  modelType: Provider.ModelTypes.Movie,
  type: Provider.Types.Movie,
  query: defaultYTSMovie
});

export default [
  yts
];
