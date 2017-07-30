// Import the necessary modules.
import asyncq from 'async-q'

import BaseHelper from './BaseHelper'

/**
 * Class for saving shows.
 * @extends {BaseHelper}
 * @type {ShowHelper}
 * @flow
 */
export default class ShowHelper extends BaseHelper {

  /**
   * A configured Tvdb API.
   * @type {Tvdb}
   * @see https://github.com/edwellbrook/node-tvdb
   */
  _tvdb: Tvdb

  /**
   * Create a show helper class for content.
   * @param {!string} name - The name of the content provider.
   * @param {!AnimeShow|Show} model - The model to help fill.
   */
  constructor(name, model): void {
    super(name, model)

    /**
     * A configured Tvdb API.
     * @type {Tvdb}
     * @see https://github.com/edwellbrook/node-tvdb
     */
    this._tvdb = this._apiFactory.getApi('tvdb')
  }

  /**
   * Update the number of seasons of a given show.
   * @param {!AnimeShow|Show} show - The show to update the number of seasons.
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateNumSeasons(show: AnimeShow | Show): AnimeShow | Show {
    const saved = await this._model.findOneAndUpdate({
      _id: show._id
    }, show, {
      new: true,
      upsert: true
    }).exec()

    const distinct = await this._model.distinct('episodes.season', {
      _id: saved._id
    }).exec()
    saved.num_seasons = distinct.length

    return this._model.findOneAndUpdate({
      _id: saved._id
    }, saved, {
      new: true,
      upsert: true
    }).exec()
  }

  /**
   * Update the torrents for an existing show.
   * @param {!Object} matching - The matching episode of new the show.
   * @param {!Object} found - The matching episode existing show.
   * @param {!AnimeShow|Show} show - The show to merge the episodes to.
   * @param {!string} quality - The quality of the torrent.
   * @returns {AnimeShow|Show} - A show with merged torrents.
   */
  _updateEpisode(
    matching: Object,
    found: Object,
    show: AnimeShow | Show,
    quality: string
  ): AnimeShow | Show {
    const index = show.episodes.indexOf(matching)

    const foundTorrents = found.torrents[quality]
    let matchingTorrents = matching.torrents[quality]

    if (foundTorrents && matchingTorrents) {
      let update = false

      if (
        foundTorrents.seeds > matchingTorrents.seeds ||
        foundTorrents.url === matchingTorrents.url
      ) {
        update = true
      }

      if (update) {
        if (quality === '480p') {
          matching.torrents['0'] = foundTorrents
        }

        matchingTorrents = foundTorrents
      }
    } else if (foundTorrents && !matchingTorrents) {
      if (quality === '480p') {
        matching.torrents['0'] = foundTorrents
      }

      matchingTorrents = foundTorrents
    }

    show.episodes.splice(index, 1, matching)
    return show
  }

  /**
   * Update a given show with it's associated episodes.
   * @param {!AnimeShow|Show} show - The show to update its episodes.
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateEpisodes(show: AnimeShow | Show): AnimeShow | Show {
    try {
      const found = await this._model.findOne({
        _id: show._id
      }).exec()
      if (!found) {
        logger.info(`${this._name}: '${show.title}' is a new show!`)
        const newShow = await new this._model(show).save()
        return await this._updateNumSeasons(newShow)
      }

      logger.info(`${this._name}: '${found.title}' is an existing show.`)

      found.episodes.map(e => {
        const matching = show.episodes.find(
          s => s.season === e.season && s.episode === e.episode
        )

        if (e.first_aired > show.latest_episode) {
          show.latest_episode = e.first_aired
        }

        if (!matching) {
          return show.episodes.push(e)
        }

        show = this._updateEpisode(matching, e, show, '480p')
        show = this._updateEpisode(matching, e, show, '720p')
        show = this._updateEpisode(matching, e, show, '1080p')
      })

      return await this._updateNumSeasons(show)
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * Adds one seasonal season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @param {!string} slug - The slug of the show.
   * @returns {undefined}
   */
  _addSeasonalSeason(
    show: AnimeShow | Show,
    episodes: Object,
    season: number,
    slug: string
  ): void {
    return this._trakt.seasons.season({
      id: slug,
      season,
      extended: 'full'
    }).then(traktEpisodes => {
      traktEpisodes.map(e => {
        if (!episodes[season][e.number]) {
          return
        }

        const episode = {
          tvdb_id: e.ids['tvdb'],
          season: parseInt(e.season, 10),
          episode: parseInt(e.number, 10),
          title: e.title,
          overview: e.overview,
          date_based: false,
          first_aired: new Date(e.first_aired).getTime() / 1000.0,
          torrents: episodes[season][e.number]
        }

        if (episode.first_aired > show.latest_episode) {
          show.latest_episode = episode.first_aired
        }

        episode.torrents[0] = episodes[season][e.number]['480p']
          ? episodes[season][e.number]['480p']
          : episodes[season][e.number]['720p']

        show.episodes.push(episode)
      })
    }).catch(err =>
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`)
    )
  }

  /**
   * Adds one datebased season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @returns {undefined}
   */
  _addDateBasedSeason(
    show: AnimeShow | Show,
    episodes: Object,
    season: number
  ): void {
    if (!show.tvdb_id) return

    return this._tvdb.getSeriesAllById(show.tvdb_id).then(tvdbShow => {
      tvdbShow.episodes.map(tvdbEpisode => {
        if (!episodes[season]) {
          return
        }

        Object.keys(episodes[season]).map(e => {
          const d = new Date(tvdbEpisode.firstAired)
            .toISOString()
            .substring(0, 10)
          if (`${season}-${e.replace(/\./, '-')}` !== d) return

          const episode = {
            tvdb_id: tvdbEpisode.id,
            season: parseInt(tvdbEpisode.seasonNumber, 10),
            episode: parseInt(tvdbEpisode.episodeNumber, 10),
            title: tvdbEpisode.episodeName,
            overview: tvdbEpisode.overview,
            date_based: true,
            first_aired: new Date(tvdbEpisode.firstAired).getTime() / 1000.0,
            torrents: episodes[season][e]
          }

          if (episode.first_aired > show.latest_episode) {
            show.latest_episode = episode.first_aired
          }

          if (episode.season === 0) {
            return
          }

          episode.torrents[0] = episodes[season][e]['480p']
            ? episodes[season][e]['480p']
            : episodes[season][e]['720p']

          show.episodes.push(episode)
        })
      })
    }).catch(err =>
      logger.error(`TVDB: Could not find any data on: ${err.path || err} with tvdb_id: '${show.tvdb_id}'`)
    )
  }

  /**
   * Adds episodes to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!string} slug - The slug of the show.
   * @returns {Show} - A show with updated torrents.
   */
  addEpisodes(show: AnimeShow | Show, episodes: Object, slug: string): Show {
    let { dateBased } = episodes
    delete episodes.dateBased
    dateBased = dateBased || show.dateBased

    return asyncq.each(Object.keys(episodes), season => {
      if (dateBased) {
        return this._addDateBasedSeason(show, episodes, season, slug)
      }

      return this._addSeasonalSeason(show, episodes, season, slug)
    }).then(() => this._updateEpisodes(show))
      .catch(err => logger.error(err))
  }

  /**
   * Get TV show images from TMDB.
   * @param {!number} tmdb - The tmdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTmdbImages(tmdb: number): Object {
    return this._tmdb.tv.images({
      tv_id: tmdb
    }).then(i => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500'

      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0].file_path
      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0].file_path

      const images = {
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper._Holder,
        fanart: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : BaseHelper._Holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper._Holder
      }

      return this._checkImages(images)
    })
  }

  /**
   * Get TV show images from TVDB.
   * @param {!number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTvdbImages(tvdb: number): Object {
    return this._tvdb.getSeriesById(tvdb).then(i => {
      const baseUrl = 'http://thetvdb.com/banners/'

      const images = {
        banner: i.banner ? `${baseUrl}${i.banner}` : BaseHelper._Holder,
        fanart: i.fanart ? `${baseUrl}${i.fanart}` : BaseHelper._Holder,
        poster: i.poster ? `${baseUrl}${i.poster}` : BaseHelper._Holder
      }

      return this._checkImages(images)
    })
  }

  /**
   * Get TV show images from Fanart.
   * @param {!number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tvdb: number): Object {
    return this._fanart.getShowImages(tvdb).then(i => {
      const images = {
        banner: i.tvbanner ? i.tvbanner[0].url : BaseHelper._Holder,
        fanart: i.showbackground
          ? i.showbackground[0].url
          : i.clearart
            ? i.clearart[0].url
            : BaseHelper._Holder,
        poster: i.tvposter ? i.tvposter[0].url : BaseHelper._Holder
      }

      return this._checkImages(images)
    })
  }

  /**
   * Get TV show images.
   * @override
   * @protected
   * @param {!number} tmdb - The tmdb id of the show you want the images from.
   * @param {!number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getImages(tmdb: number, tvdb: number): Object {
    return this._getTmdbImages(tmdb)
      .catch(() => this._getTvdbImages(tvdb))
      .catch(() => this._getFanartImages(tmdb))
      .catch(() => this._defaultImages)
  }

  /**
   * Get info from Trakt and make a new show object.
   * @override
   * @param {!string} slug - The slug to query https://trakt.tv/.
   * @returns {Show} - A new show without the episodes attached.
   */
  async getTraktInfo(slug: string): Show {
    try {
      const traktShow = await this._trakt.shows.summary({
        id: slug,
        extended: 'full'
      })
      const traktWatchers = await this._trakt.shows.watching({
        id: slug
      })

      if (
        traktShow && traktShow.ids.imdb &&
        traktShow.ids.tmdb && traktShow.ids.tvdb
      ) {
        const { imdb, slug, tvdb } = traktShow.ids

        return {
          imdb_id: imdb,
          title: traktShow.title,
          year: traktShow.year,
          slug: slug,
          synopsis: traktShow.overview,
          runtime: traktShow.runtime,
          rating: {
            votes: traktShow.votes,
            watching: traktWatchers ? traktWatchers.length : 0,
            percentage: Math.round(traktShow.rating * 10)
          },
          images: await this._getImages(tvdb, tvdb),
          genres: traktShow.genres !== null ? traktShow.genres : ['unknown'],
          tvdb_id: tvdb,
          country: traktShow.country,
          network: traktShow.network,
          air_day: traktShow.airs.day,
          air_time: traktShow.airs.time,
          status: traktShow.status,
          num_seasons: 0,
          last_updated: Number(new Date()),
          latest_episode: 0,
          episodes: []
        }
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`)
    }
  }

}
