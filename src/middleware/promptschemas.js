// @flow

/**
 * The available qualities for movies.
 * @type {Array<string>}
 */
const _movieQualities: Array<string> = ['720p', '1080p']

/**
 * The available qualities for shows.
 * @type {Array<string>}
 */
const _showQualities: Array<string> = ['480p', ..._movieQualities]

/**
 * The quality property.
 * @type {Object}
 */
const _baseQuality: Object = {
  type: 'list',
  name: 'quality'
}

/**
 * The imdb property.
 * @type {Object}
 */
const imdb: Object = {
  type: 'input',
  name: 'imdb',
  message: 'The imdb id of the show/movie to add (tt1234567)',
  validate(value: string): boolean | string {
    const pass = /^(tt\d{7})/i.test(value)
    if (pass) {
      return true
    }

    return 'Not a valid imdb id.'
  }
}

/**
 * The torrent property.
 * @type {Object}
 */
const torrent: Object = {
  type: 'input',
  name: 'torrent',
  message: 'The link to the torrent to add',
  validate(value: string): boolean | string {
    if (value && typeof value === 'string') {
      return true
    }

    return 'Not a valid torrent.'
  }
}

/**
 * The movie quality property
 * @type {Object}
 */
const movieQuality: Object = {
  ..._baseQuality,
  choices: _movieQualities,
  message: 'The quality of the torrent (720p | 1080p)'
}

/**
 * The show quality property.
 * @type {Object}
 */
const showQuality: Object = {
  ..._baseQuality,
  choices: _showQualities,
  message: 'The quality of the torrent (480p | 720p | 1080p)'
}

/**
 * The language property.
 * @type {Object}
 */
const language: Object = {
  type: 'input',
  name: 'language',
  message: 'The language of the torrent to add (en, fr, jp)',
  validate(value: string): boolean | string {
    const pass = /^([a-zA-Z]{2})/i.test(value)
    if (pass) {
      return true
    }

    return 'Not a valid language'
  }
}

/**
 * The season property.
 * @type {Object}
 */
const season: Object = {
  type: 'input',
  name: 'season',
  message: 'The season number of the torrent',
  validate(value: string): boolean | string {
    const pass = /^(\d+)/i.test(value)
    if (pass) {
      return true
    }

    return 'Not a valid season.'
  }
}

/**
 * The episode property.
 * @type {Object}
 */
const episode: Object = {
  type: 'input',
  name: 'episode',
  message: 'The episode number of the torrent',
  validate(value: string): boolean | string {
    const pass = /^(\d+)/i.test(value)
    if (pass) {
      return true
    }

    return 'Not a valid episode.'
  }
}

/**
 * The dateBased property.
 * @type {Object}
 */
const dateBased: Object = {
  type: 'confirm',
  name: 'confirm',
  message: 'Is the show date based?',
  default: false
}

/**
 * The confirm property.
 * @type {Object}
 */
const confirm: Object = {
  type: 'confirm',
  name: 'confirm',
  message: 'Do you really want to import a collection? This can override the current data!',
  default: false
}

/**
 * Bundle the schemas into one object.
 * @type {Object}
 */
const promptSchemas = {
  imdb,
  torrent,
  movieQuality,
  showQuality,
  language,
  season,
  episode,
  dateBased,
  confirm
}

/**
 * Export the schemas.
 * @type {Object}
 */
export default promptSchemas
