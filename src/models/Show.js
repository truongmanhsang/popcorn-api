/* eslint-disable camelcase */
// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'
import { ItemType } from 'butter-provider'

import content, { Content } from './Content'

/**
 * The show schema used by mongoose.
 * @type {Object}
 * @flow
 * @ignore
 * @see http://mongoosejs.com/docs/guide.html
 */
export const showSchema = new Schema({
  tvdb_id: Number,
  country: String,
  network: String,
  air_day: String,
  air_time: String,
  status: String,
  num_seasons: Number,
  last_updated: Number,
  latest_episode: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: ItemType.TVSHOW
  },
  episodes: [{
    tvdb_id: Number,
    season: Number,
    episode: Number,
    title: String,
    overview: String,
    date_based: Boolean,
    first_aired: Number,
    torrents: {}
  }],
  ...content
})

/**
 * Class for episode attributes and methods.
 * @extends {Model}
 * @type {Episode}
 */
export class Episode extends Model {

  /**
   * The tvdb id of the episode.
   * @type {number}
   */
  tvdb_id: number

  /**
   *The season of the episode..
   * @type {number}
   */
  season: number

  /**
   * The episode of the episode.
   * @type {number}
   */
  episode: number

  /**
   * The title of the episode.
   * @type {number}
   */
  title: string

  /**
   * The overview of the episode.
   * @type {number}
   */
  overview: string

  /**
   * Whenever the episode is date based..
   * @type {number}
   */
  date_based: boolean

  /**
   * The time the episode first aired.
   * @type {number}
   */
  first_aired: number

  /**
   * The torrents of the episode.
   * @type {number}
   */
  torrents: Object

  /**
   * Create a new Episode object.
   * @param {!Object} config - The configuration object for the episode.
   * @param {!number} tvdb_id - The tvdb id of the episode.
   * @param {!number} season - The season of the episode.
   * @param {!number} episode - The episode of the episode.
   * @param {!string} title - The title of the episode.
   * @param {!string} overview - The overview of the episode.
   * @param {!boolean} date_based - Whenever the episode is date based.
   * @param {!number} first_aired - The time the episode first aired.
   * @param {!Object} torrents - The torrents of the episode.
   */
  constructor({
    tvdb_id,
    season,
    episode,
    title,
    overview,
    date_based,
    first_aired,
    torrents
  }) {
    super()

    /**
     * The tvdb id of the episode.
     * @type {number}
     */
    this.tvdb_id = tvdb_id
    /**
     *The season of the episode..
     * @type {number}
     */
    this.season = season
    /**
     * The episode of the episode.
     * @type {number}
     */
    this.episode = episode
    /**
     * The title of the episode.
     * @type {number}
     */
    this.title = title
    /**
     * The overview of the episode.
     * @type {number}
     */
    this.overview = overview
    /**
     * Whenever the episode is date based..
     * @type {number}
     */
    this.date_based = date_based
    /**
     * The time the episode first aired.
     * @type {number}
     */
    this.first_aired = first_aired
    /**
     * The torrents of the episode.
     * @type {number}
     */
    this.torrents = torrents
  }

}

/**
 * Class for show attributes and methods.
 * @extends {Content}
 * @type {Show}
 */
export class Show extends Content {

  /**
   * The tvdb id of the show.
   * @type {number}
   */
  tvdb_id: number

  /**
   * The country of the show.
   * @type {string}
   */
  country: string

  /**
   * The network of the show.
   * @type {string}
   */
  network: string

  /**
   * The air day of the show.
   * @type {string}
   */
  air_day: string

  /**
   * The air time of the show.
   * @type {number}
   */
  air_time: string

  /**
   * The status of the show.
   * @type {string}
   */
  status: string

  /**
   * The number of seasons of the show.
   * @type {number}
   */
  num_seasons: number

  /**
   * The time the show was last updated.
   * @type {number}
   */
  last_updated: number

  /**
   * The lastest episode of the show.
   * @type {number}
   */
  latest_episode: number

  /**
   * The episodes of the show.
   * @type {Array<Episode>}
   */
  episodes: Array<Episode>

  /**
   * Create a new Show object.
   * @param {!Object} config - The configuration object for the show.
   * @param {!string} imdb_id - The imdb id of the show.
   * @param {!string} title - The title of the show.
   * @param {!number} year - The year of the show.
   * @param {!string} slug - The slug of the show.
   * @param {!string} synopsis - The synopsis of the show.
   * @param {!number} runtime - The runtime of the show.
   * @param {!Rating} rating - The rating of the show.
   * @param {!Images} images - The images of the show.
   * @param {!Array<string>} genres - The genres of the show.
   * @param {!string} [type=tvshow] - The type of the show.
   * @param {!number} tvdb_id - The tvdb id of the show.
   * @param {!string} country - The country of the show.
   * @param {!string} network - The network of the show.
   * @param {!string} air_day - The air day of the show.
   * @param {!number} air_time - The air time of the show.
   * @param {!string} status - The status of the show.
   * @param {!number} num_seasons - The number of seasons of the show.
   * @param {!number} last_updated - The time the show was last updated.
   * @param {!number} lastest_episode - The lastest episode of the show.
   * @param {!Array<Episode>} episodes - The episodes of the show.
   */
  constructor({
    imdb_id,
    title,
    year,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    type = ItemType.TVSHOW,
    tvdb_id,
    country,
    network,
    air_day,
    air_time,
    status,
    num_seasons,
    last_updated,
    lastest_episode,
    episodes
  }) {
    super({
      imdb_id,
      title,
      year,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres,
      type
    })

    /**
     * The tvdb id of the show.
     * @type {number}
     */
    this.tvdb_id = tvdb_id
    /**
     * The country of the show.
     * @type {string}
     */
    this.country = country
    /**
     * The network of the show.
     * @type {string}
     */
    this.network = network
    /**
     * The air day of the show.
     * @type {string}
     */
    this.air_day = air_day
    /**
     * The air time of the show.
     * @type {number}
     */
    this.air_time = air_time
    /**
     * The status of the show.
     * @type {string}
     */
    this.status = status
    /**
     * The number of seasons of the show.
     * @type {number}
     */
    this.num_seasons = num_seasons
    /**
     * The time the show was last updated.
     * @type {number}
     */
    this.last_updated = last_updated
    this.last_updated = last_updated
    /**
     * The lastest episode of the show.
     * @type {number}
     */
    this.lastest_episode = lastest_episode
    /**
     * The episodes of the show.
     * @type {Array<Episode>}
     */
    this.episodes = episodes ? episodes.map(e => new Episode(e)) : undefined
  }

}

// Attatch the fuctions from the Show class to the showSchema.
showSchema.loadClass(Show)

// Create the show model.
const ShowModel = mongoose.model('Show', showSchema)

/**
 * A model object for shows.
 * @ignore
 * @type {ShowModel}
 */
export default ShowModel
