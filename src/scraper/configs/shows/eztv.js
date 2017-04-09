// Import the neccesary modules.
import Provider from '../../providers/BulkProvider';

const eztv = new Provider({
  api: 'eztv',
  name: 'EZTV',
  modelType: Provider.ModelTypes.Show,
  type: Provider.Types.Show
});

export default [
  eztv
];
