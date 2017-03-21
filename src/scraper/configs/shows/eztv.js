// Import the neccesary modules.
import { apiFactory } from '../common';
import Provider from '../../providers/BulkProvider';

const eztv = new Provider({
  API: apiFactory.getApi('eztv'),
  name: 'EZTV',
  modelType: Provider.ModelTypes.Show,
  type: Provider.Types.Show
});

export default [
  eztv
];
