/**
 * The imdb property.
 * @type {Object}
 */
const _imdb = {
  description: 'The imdb id of the show/movie to add (tt1234567)',
  type: 'string',
  pattern: /^(tt\d{7}|)|^(.*)/i,
  message: 'Not a valid imdb id.',
  required: true
}

/**
 * The torrent property.
 * @type {Object}
 */
const _torrent = {
  description: 'The link to the torrent to add',
  type: 'string',
  message: 'Not a valid torrent.',
  required: true
}

/**
 * The quality property.
 * @type {Object}
 */
const _quality = {
  description: 'The quality of the torrent (480p | 720p | 1080p)',
  type: 'string',
  pattern: /^(480p|720p|1080p)/i,
  message: 'Not a valid quality.',
  required: true
}

/**
 * The language property.
 * @type {Object}
 */
const _language = {
  description: 'The language of the torrent to add (en, fr, jp)',
  type: 'string',
  pattern: /^([a-zA-Z]{2})/i,
  message: 'Not a valid language',
  required: true
}

/**
 * The schema used by `prompt` insert a movie.
 * @type {Object}
 */
export const movieSchema = {
  properties: {
    imdb: _imdb,
    torrent: _torrent,
    quality: _quality,
    language: _language
  }
}

/**
 * The season property.
 * @type {Object}
 */
const _season = {
  description: 'The season number of the torrent',
  type: 'integer',
  pattern: /^(\d+)/i,
  message: 'Not a valid season.',
  required: true
}

/**
 * The episode property.
 * @type {Object}
 */
const _episode = {
  description: 'The episode number of the torrent',
  type: 'integer',
  pattern: /^(\d+)/i,
  message: 'Not a valid episode.',
  required: true
}

/**
 * The dateBased property.
 * @type {Object}
 */
const _dateBased = {
  description: 'If the show is date based (true | false)',
  type: 'boolean',
  pattern: /^(true|false)i/,
  message: 'Not a valid value for date based.',
  required: true
}

/**
 * The schema used by `prompt` insert a show.
 * @type {Object}
 */
export const showSchema = {
  properties: {
    imdb: _imdb,
    torrent: _torrent,
    quality: _quality,
    season: _season,
    episode: _episode,
    dateBased: _dateBased
  }
}

/**
 * The confirm property.
 * @type {Object}
 */
const _confirm = {
  description: 'Do you really want to import a collection? This can override the current data!',
  type: 'string',
  pattern: /^(yes|no|y|n)$/i,
  message: 'Type yes/no',
  required: true,
  default: 'no'
}

/**
 * The schema used by `prompt` to confirm an import.
 * @type {Object}
 */
export const importSchema = {
  properties: {
    confirm: _confirm
  }
}

/**
 * The api property.
 * @type {Object}
 */
const _api = {
  description: 'The name of the external API used to scrape (extratorrent | eztv | horriblesubs | kat | nyaa | yts)',
  type: 'string',
  pattern: /^(extratorrent|eztv|horriblesubs|kat|nyaa|yts)$/i,
  message: 'The api must be either extratorrent, eztv,horriblesubs, kat, nyaa or yts',
  required: true
}

/**
 * The modelType property.
 * @type {Object}
 */
const _modelType = {
  description: 'The name of the model to use (animemovie | animeshow | movie | show)',
  type: 'string',
  pattern: /^(animemovie|animeshow|movie|show)$/i,
  message: 'modelType must be either animemovie, animeshow, movie or show',
  required: true
}

/**
 * The name property.
 * @type {Object}
 */
const _name = {
  description: 'The name of the provider configuration (can be anything)',
  type: 'string',
  required: true
}

/**
 * The type property.
 * @type {Object}
 */
const _type = {
  description: 'The type of content to scrape (movie | tvshow)',
  type: 'string',
  pattern: /^(movie|tvshow)$/i,
  message: 'type must be either movie or tvshow.',
  required: true
}

/**
 * The class property.
 * @type {Object}
 */
const _class = {
  description: 'The name of the class which will be imported before scraping',
  type: 'string',
  required: true
}

/**
 * The query property.
 * @type {Object}
 */
const _query = {
  description: 'The query used by the api, should be JSON',
  type: 'string',
  minItems: 0
}

/**
 * The schema used by `prompt` to insert a provider configuration.
 * @type {Object}
 */
export const providerSchema = {
  properties: {
    api: _api,
    modelType: _modelType,
    name: _name,
    type: _type,
    class: _class,
    query: _query
  }
}
