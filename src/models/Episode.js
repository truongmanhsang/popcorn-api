/* eslint-disable camelcase */
// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'

/**
 * The episode schema used by mongoose.
 * @type {Object}
 * @flow
 * @ignore
 * @see http://mongoosejs.com/docs/guide.html
 */
export const episodeSchema = new Schema({
  tvdb_id: Number,
  season: Number,
  episode: Number,
  title: String,
  overview: String,
  date_based: Boolean,
  first_aired: Number,
  torrents: {}
}, {
  _id: false
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
  }: Object = {}
  ): void {
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
     * Whenever the episode is date based.
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

// Attatch the fuctions from the Episode class to the episodeSchema.
episodeSchema.loadClass(Episode)

// Create the episode model.
const EpisodeModel = mongoose.model(Episode, episodeSchema)

/**
 * A model object for episodes.
 * @ignore
 * @type {EpisodeModel}
 */
export default EpisodeModel
