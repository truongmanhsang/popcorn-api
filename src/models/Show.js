/* eslint-disable camelcase */
// Import the necessary modules.
import mongoose, { Schema } from 'mongoose'
import { ItemType } from 'butter-provider'

import content, { Content } from './Content'
import Episode, { episodeSchema } from './Episode'

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
  episodes: {
    type: [episodeSchema],
    require: true,
    ref: 'Episode'
  },
  ...content
})

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
   * @param {!Object} config={} - The configuration object for the show.
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
    }: Object = {}
  ): void {
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
const ShowModel = mongoose.model(Show, showSchema)

/**
 * A model object for shows.
 * @ignore
 * @type {ShowModel}
 */
export default ShowModel
