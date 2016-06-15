const movieProviders = [
  // English providers
  {name: "Megaradon", query: {query: "x264 720p | 1080p", uploader: "megaradon", language: "en"}},
  {name: "Z0n321", query: {query: "x264 720p | 1080p", uploader: "z0n321", language: "en"}},

  // French providers
  {name: "French", query: {query: "720p | 1080p", language: "fr"}},
  // German providers
  {name: "German", query: {query: "720p | 1080p", language: "de"}},
  // Spanish providers
  {name: "Spanish", query: {query: "720p | 1080p", language: "es"}},
  // Ductch providers
  {name: "Dutch", query: {query: "720p | 1080p", language: "nl"}}
];

const showProviders = [
  // 720p and 1080p providers
  {name: "Zoner720p", query: {query: "x264 720p", uploader: "z0n321"}},
  {name: "Zoner1080p", query: {query: "x264 1080p", uploader: "z0n321"}},
  {name: "Brasse0", query: {query: "x264", uploader: "brasse0"}},
  {name: "ETHD", query: {query: "x264", uploader: "ethd"}},

  // Uploader providers
  {name: "ETTV", query: {query: "x264", uploader: "ettv"}},
  {name: "KAT_EZTV", query: {query: "x264", uploader: "eztv"}},
  {name: "VTV", query: {query: "x264", uploader: "vtv"}},
  {name: "SRIGGA", query: {query: "x264", uploader: "ethd"}},

  // Zoner providers
  {name: "ZonerSD", query: {query: "x264 LOL | FLEET | KILLERS | W4F", uploader: "z0n321"}}

  // Test providers
  // {name: "480p", query: {query: "x264 rartv LOL The Big Bang Theory", uploader: "z0n321"}},
  // {name: "720p", query: {query: "x264 rartv 720p DIMENSION The Big Bang Theory", uploader: "z0n321"}},
  // {name: "1080p", query: {query: "x264 rartv 1080p DIMENSION The Big Bang Theory", uploader: "z0n321"}}
];

/**
 * @class Providers
 * @classdesc Holder to export all the provider objects.
 * @memberof module:config/provides
 * @property {Object} movieProviders - Providers used for scraping shows
 * from {@link https://kat.cr/}.
 * @property {Object} showProviders - // Providers used for scraping
 * movies from {@link https://kat.cr/}.
 */
export { movieProviders, showProviders };
