// Import the neccesary modules.
import asyncq from 'async-q';

import BaseHelper from './BaseHelper';

/**
 * Class for saving shows.
 * @extends {BaseHelper}
 */
export default class ShowHelper extends BaseHelper {

  /**
   * A configured TVDB API.
   * @type {TVDB}
   * @see https://github.com/edwellbrook/node-tvdb
   */
  _tvdb = this._apiFactory.getApi('tvdb');

  /**
   * Create a helper class for show content.
   * @param {!String} name - The name of the content provider.
   * @param {!AnimeShow|Show} model - The model to help fill.
   */
  constructor(name, model) {
    super(name, model);
  }

  /**
   * Update the number of seasons of a given show.
   * @param {!AnimeShow|Show} show - The show to update the number of seasons.
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateNumSeasons(show) {
    const saved = await this._model.findOneAndUpdate({
      _id: show._id
    }, show, {
      new: true,
      upsert: true
    }).exec();

    const distinct = await this._model.distinct('episodes.season', {
      _id: saved._id
    }).exec();
    saved.num_seasons = distinct.length;

    return await this._model.findOneAndUpdate({
      _id: saved._id
    }, saved, {
      new: true,
      upsert: true
    }).exec();
  }

  /**
   * Update the torrents for an existing show.
   * @param {!Object} matching - The matching episode of new the show.
   * @param {!Object} found - The matching episode existing show.
   * @param {!AnimeShow|Show} show - The show to merge the episodes to.
   * @param {!String} quality - The quality of the torrent.
   * @returns {Show} - A show with merged torrents.
   */
  _updateEpisode(matching, found, show, quality) {
    const index = show.episodes.indexOf(matching);

    const foundTorrents = found.torrents[quality];
    let matchingTorrents = matching.torrents[quality];

    if (foundTorrents && matchingTorrents) {
      let update = false;

      if (foundTorrents.seeds > matchingTorrents.seeds
          || foundTorrents.url === matchingTorrents.url)
        update = true;

      if (update) {
        if (quality === '480p') matching.torrents['0'] = foundTorrents;
        matchingTorrents = foundTorrents;
      }
    } else if (foundTorrents && !matchingTorrents) {
      if (quality === '480p') matching.torrents['0'] = foundTorrents;
      matchingTorrents = foundTorrents;
    }

    show.episodes.splice(index, 1, matching);
    return show;
  }

  /**
   * Update a given show with it's associated episodes.
   * @param {!AnimeShow|Show} show - The show to update its episodes.
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateEpisodes(show) {
    try {
      const found = await this._model.findOne({
        _id: show._id
      }).exec();
      if (!found) {
        logger.info(`${this._name}: '${show.title}' is a new show!`);
        const newShow = await new this._model(show).save();
        return await this._updateNumSeasons(newShow);
      }

      logger.info(`${this._name}: '${found.title}' is an existing show.`);

      found.episodes.map(e => {
        const matching = show.episodes.find(
          s => s.season === e.season && s.episode === e.episode
        );

        if (e.first_aired > show.latest_episode)
          show.latest_episode = e.first_aired;

        if (!matching) return show.episodes.push(e);

        show = this._updateEpisode(matching, e, show, '480p');
        show = this._updateEpisode(matching, e, show, '720p');
        show = this._updateEpisode(matching, e, show, '1080p');
      });

      return await this._updateNumSeasons(show);
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * Adds one seasonal season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!Number} season - The season number.
   * @param {!String} slug - The slug of the show.
   * @returns {undefined}
   */
  _addSeasonalSeason(show, episodes, season, slug) {
    return this._trakt.seasons.season({
      id: slug,
      season,
      extended: 'full'
    }).then(traktEpisodes => {
      traktEpisodes.map(e => {
        if (!episodes[season][e.number]) return;

        const episode = {
          tvdb_id: e.ids['tvdb'],
          season: parseInt(e.season, 10),
          episode: parseInt(e.number, 10),
          title: e.title,
          overview: e.overview,
          date_based: false,
          first_aired: new Date(e.first_aired).getTime() / 1000.0,
          torrents: episodes[season][e.number]
        };

        if (episode.first_aired > show.latest_episode)
          show.latest_episode = episode.first_aired;

        episode.torrents[0] = episodes[season][e.number]['480p']
                              ? episodes[season][e.number]['480p']
                              : episodes[season][e.number]['720p'];

        show.episodes.push(episode);
      });
    }).catch(err =>
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`)
    );
  }

  /**
   * Adds one datebased season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!Number} season - The season number.
   * @returns {undefined}
   */
  _addDateBasedSeason(show, episodes, season) {
    if (!show.tvdb_id) return;

    return this._tvdb.getSeriesAllById(show.tvdb_id).then(tvdbShow => {
      tvdbShow.episodes.map(tvdbEpisode => {
        if (!episodes[season]) return;

        Object.keys(episodes[season]).map(e => {
          if (`${season}-${e}` !== tvdbEpisode.firstAired) return;

          const { episodeNumber, seasonNumber } = tvdbEpisode;

          const episode = {
            tvdb_id: tvdbEpisode.id,
            season: seasonNumber,
            episode: episodeNumber,
            title: tvdbEpisode.episodeName,
            overview: tvdbEpisode.overview,
            date_based: true,
            first_aired: new Date(tvdbEpisode.firstAired).getTime() / 1000.0,
            torrents: episodes[seasonNumber][episodeNumber]
          };

          if (episode.first_aired > show.latest_episode)
            show.latest_episode = episode.first_aired;

          if (episode.season === 0) return;

          episode.torrents[0] = episodes[seasonNumber][episodeNumber]['480p']
                                ? episodes[seasonNumber][episodeNumber]['480p']
                                : episodes[seasonNumber][episodeNumber]['720p'];

          show.episodes.push(episode);
        });
      });
    }).catch(err =>
      logger.error(`TVDB: Could not find any data on: ${err.path || err} with tvdb_id: '${show.tvdb_id}'`)
    );
  }

  /**
   * Adds episodes to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!String} slug - The slug of the show.
   * @returns {Show} - A show with updated torrents.
   */
  addEpisodes(show, episodes, slug) {
    const { dateBased } = episodes;
    delete episodes.dateBased;

    asyncq.each(Object.keys(episodes), season => {
      if (dateBased)
        return this._addDateBasedSeason(show, episodes, season, slug);

      return this._addSeasonalSeason(show, episodes, season, slug);
    }).then(() => this._updateEpisodes(show))
      .catch(err => logger.error(err));
  }

  /**
   * Get TV show images from TMDB.
   * @param {!Number} tmdb - The tmdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTmdbImages(tmdb) {
    return this._tmdb.tv.images({
      tv_id: tmdb
    }).then(images => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500/';

      const tmdbPoster = images.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0];
      const tmdbBackdrop = images.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0];

      return {
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.Holder,
        fanart: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : BaseHelper.Holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.Holder
      };
    });
  }

  /**
   * Get TV show images from TVDB.
   * @param {!Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTvdbImages(tvdb) {
    return this._tvdb.getSeriesById(tvdb).then(images => {
      const baseUrl = 'http://thetvdb.com/banners/';

      return {
        banner: images.banner ? `${baseUrl}${images.banner}` : BaseHelper.Holder,
        fanart: images.fanart ? `${baseUrl}${images.fanart}` : BaseHelper.Holder,
        poster: images.poster ? `${baseUrl}${images.poster}` : BaseHelper.Holder
      };
    });
  }

  /**
   * Get TV show images from Fanart.
   * @param {!Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tvdb) {
    return this._fanart.getShowImages(tvdb).then(images => {
      return {
        banner: images.tvbanner ? images.tvbanner[0].url : BaseHelper.Holder,
        fanart: images.showbackground
                        ? images.showbackground[0].url
                        : images.clearart
                        ? images.clearart[0].url
                        : BaseHelper.Holder,
        poster: images.tvposter ? images.tvposter[0].url : BaseHelper.Holder
      };
    });
  }

  /**
   * Get TV show images.
   * @override
   * @param {!Number} tmdb - The tmdb id of the show you want the images from.
   * @param {!Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getImages(tmdb, tvdb) {
    return Promise.race([
      this._getTmdbImages(tmdb),
      this._getTvdbImages(tvdb),
      this._getFanartImages(tvdb)
    ]).catch(err =>
      logger.error(`Images: Could not find images on: ${err.path || err} with id: '${tmdb || tvdb}'`)
    );
  }

  /**
   * Get info from Trakt and make a new show object.
   * @override
   * @param {!String} slug - The slug to query https://trakt.tv/.
   * @returns {Show} - A new show without the episodes attached.
   */
  async getTraktInfo(slug) {
    try {
      const traktShow = await this._trakt.shows.summary({
        id: slug,
        extended: 'full'
      });
      const traktWatchers = await this._trakt.shows.watching({
        id: slug
      });

      if (traktShow && traktShow.ids.imdb
          && traktShow.ids.tmdb && traktShow.ids.tvdb) {
        const { imdb, slug, tvdb } = traktShow.ids;

        return {
          _id: imdb,
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
        };
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

}
