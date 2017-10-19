// @flow

/**
 * The imdb property.
 * @type {Object}
 */
const _imdb = {
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
const _torrent = {
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
 * The available qualities for movies
 * @type {Array<string>}
 */
const _movieQualities = ['720p', '1080p']

/**
 * The quality property.
 * @type {Object}
 */
const _quality = {
  type: 'list',
  name: 'quality',
  validate(value: string): boolean | string {
    const pass = /^(480p|720p|1080p)/i.test(value)
    if (pass) {
      return pass
    }

    return 'Not a valid quality.'
  }
}

/**
 * The language property.
 * @type {Object}
 */
const _language = {
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
 * The schema used by `prompt` insert a movie.
 * @ignore
 * @type {Object}
 */
export const movieSchema = [
  _imdb,
  _torrent, {
    ..._quality,
    choices: _movieQualities,
    message: 'The quality of the torrent (720p | 1080p)'
  },
  _language
]

/**
 * The season property.
 * @type {Object}
 */
const _season = {
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
const _episode = {
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
const _dateBased = {
  type: 'confirm',
  name: 'confirm',
  message: 'Is the show date based?',
  default: false
}

/**
 * The schema used by `prompt` insert a show.
 * @ignore
 * @type {Object}
 */
export const showSchema = [
  _imdb,
  _torrent, {
    ..._quality,
    choices: ['480p', ..._movieQualities],
    message: 'The quality of the torrent (480p | 720p | 1080p)'
  },
  _quality,
  _season,
  _episode,
  _dateBased
]

/**
 * The schema used by `prompt` to confirm an import.
 * @ignore
 * @type {Object}
 */
export const importSchema = [{
  type: 'confirm',
  name: 'confirm',
  message: 'Do you really want to import a collection? This can override the current data!',
  default: false
}]
