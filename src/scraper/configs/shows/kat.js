// Import the neccesary modules.
import {
  apiFactory,
  defaultKatShow
} from '../common';
import Provider from '../../providers/ShowProvider';

const API = apiFactory.getApi('kat');

const katZoner720p = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'Zoner720p',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264 720p',
    uploader: 'z0n321'
  })
});

const katZoner1080p = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'Zoner1080p',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264 1080p',
    uploader: 'z0n321'
  })
});

const katBrasse0 = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'Brasse0',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'brasse0'
  })
});

const katETHD = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETHD',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'ethd'
  })
});

const katETTV = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'ettv'
  })
});

const katEZTV = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'KAT_EZTV',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'eztv'
  })
});

const katVTV = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'VTV',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'vtv'
  })
});

const katSrigga = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'SRIGGA',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264',
    uploader: 'ethd'
  })
});

const katZonerDS = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ZonerSD',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultKatShow, {
    query: 'x264 LOL | FLEET | KILLERS | W4F',
    uploader: 'z0n321'
  })
});

export default [
  katZoner720p,
  katZoner1080p,
  katBrasse0,
  katETHD,
  katETTV,
  katEZTV,
  katVTV,
  katSrigga,
  katZonerDS
];
