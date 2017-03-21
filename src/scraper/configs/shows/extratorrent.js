// Import the neccesary modules.
import {
  apiFactory,
  defaultExtraTorrentShow
} from '../common';
import Provider from '../../providers/ShowProvider';

const API = apiFactory.getApi('extratorrent');

const ettvLOL = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV LOL',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 lol',
    without: '720p 1080p'
  })
});

const ettvKillers = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV KILLERS',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 killers',
    without: '720p 1080p'
  })
});

const ettv2HD = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV 2HD',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 2hd',
    without: '720p 1080p'
  })
});

const ettvCrooks = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV CROOKS',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 crooks',
    without: '720p 1080p'
  })
});

const ettvFUM = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV FUM',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 fum',
    without: '720p 1080p'
  })
});

const ettvBATV = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV BATV',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 batv',
    without: '720p 1080p'
  })
});

const ettvASAP = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV ASAP',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 asap',
    without: '720p 1080p'
  })
});

const ettvTLA = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV TLA',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 tla',
    without: '720p 1080p'
  })
});

const ettvW4F = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV W4F',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 w4f',
    without: '720p 1080p'
  })
});

const ettvEvolve = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV EVOLVE',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 EVOLVE',
    without: '720p 1080p'
  })
});

const ettvOrganic = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV ORGANiC',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 organic',
    without: '720p 1080p'
  })
});

const ettvBajskorv = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV BAJSKORV',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 bajskorv',
    without: '720p 1080p'
  })
});

const ettvRiver = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV RiVER',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 river',
    without: '720p 1080p'
  })
});

const ettv720p = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETTV 720p',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ettv hdtv x264 720p'
  })
});

const ethd720p = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: 'ETHD 720p',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'ethd hdtv x264 720p'
  })
});

const ettv1080p = new Provider({
  API,
  modelType: Provider.ModelTypes.Show,
  name: '1080p',
  type: Provider.Types.Show,
  query: Object.assign({}, defaultExtraTorrentShow, {
    with_words: 'hdtv x264 1080p'
  })
});

export default [
  ettvLOL,
  ettvKillers,
  ettv2HD,
  ettvCrooks,
  ettvFUM,
  ettvBATV,
  ettvASAP,
  ettvTLA,
  ettvW4F,
  ettvEvolve,
  ettvOrganic,
  ettvBajskorv,
  ettvRiver,
  ettv720p,
  ethd720p,
  ettv1080p
];
