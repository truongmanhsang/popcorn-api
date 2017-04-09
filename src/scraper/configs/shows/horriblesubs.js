// Import the neccesary modules.
import Provider from '../../providers/BulkProvider';

const horribleSubs = new Provider({
  api: 'horriblesubs',
  name: 'HorribleSubs',
  modelType: Provider.ModelTypes.AnimeShow,
  type: Provider.Types.Show
});

export default [
  horribleSubs
];
