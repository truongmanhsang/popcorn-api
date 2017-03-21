// Import the neccesary modules.
import { apiFactory } from '../common';
import Provider from '../../providers/BulkProvider';

const horribleSubs = new Provider({
  API: apiFactory.getApi('horriblesubs'),
  name: 'HorribleSubs',
  modelType: Provider.ModelTypes.AnimeShow,
  type: Provider.Types.Show
});

export default [
  horribleSubs
];
