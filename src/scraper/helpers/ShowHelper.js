// Import the neccesary modules.
import asyncq from 'async-q';

import BaseHelper from './BaseHelper';
import FactoryProducer from '../resources/FactoryProducer';

/**
 * Class for saving shows.
 * @extends {BaseHelper}
 */
export default class ShowHelper extends BaseHelper {

  /**
   * Create a helper class for show content.
   * @param {String} name - The name of the content provider.
   * @param {Object} model - The model to help fill.
   */
  constructor(name, model) {
    super(name, model);

    const apiFactory = FactoryProducer.getFactory('api');

    /**
     * A configured TVDB API.
     * @type {TVDB}
     * @see https://github.com/edwellbrook/node-tvdb
     */
    this._tvdb = apiFactory.getApi('tvdb');
  }

  /**
   * Update the number of seasons of a given show.
   * @param {Show} show - The show to update the number of seasons.
   * @returns {Show} - A newly updated show.
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
   * @param {Object} matching - The matching episode of new the show.
   * @param {Object} found - The matching episode existing show.
   * @param {Show} show - The show to merge the episodes to.
   * @param {String} quality - The quality of the torrent.
   * @returns {Show} - A show with merged torrents.
   */
  _updateEpisode(matching, found, show, quality) {
    const index = show.episodes.indexOf(matching);

    if (found.torrents[quality] && matching.torrents[quality]) {
      let update = false;

      if (found.torrents[quality].seeds > matching.torrents[quality].seeds) {
        update = true;
      } else if (matching.torrents[quality].seeds > found.torrents[quality].seeds) {
        update = false;
      } else if (found.torrents[quality].url === matching.torrents[quality].url) {
        update = true;
      }

      if (update) {
        if (quality === '480p') matching.torrents['0'] = found.torrents[quality];
        matching.torrents[quality] = found.torrents[quality];
      }
    } else if (found.torrents[quality] && !matching.torrents[quality]) {
      if (quality === '480p') matching.torrents['0'] = found.torrents[quality];
      matching.torrents[quality] = found.torrents[quality];
    }

    show.episodes.splice(index, 1, matching);
    return show;
  }

  /**
   * Update a given show with it's associated episodes.
   * @param {Show} show - The show to update its episodes.
   * @returns {Show} - A newly updated show.
   */
  async _updateEpisodes(show) {
    try {
      const found = await this._model.findOne({
        _id: show._id
      }).exec();
      if (found) {
        logger.info(`${this._name}: '${found.title}' is an existing show.`);
        for (let i = 0; i < found.episodes.length; i++) { // eslint-disable-line semi-spacing
          const matching = show.episodes
            .filter(showEpisode => showEpisode.season === found.episodes[i].season)
            .filter(showEpisode => showEpisode.episode === found.episodes[i].episode);

          if (found.episodes[i].first_aired > show.latest_episode) show.latest_episode = found.episodes[i].first_aired;

          if (matching.length !== 0) {
            show = this._updateEpisode(matching[0], found.episodes[i], show, '480p');
            show = this._updateEpisode(matching[0], found.episodes[i], show, '720p');
            show = this._updateEpisode(matching[0], found.episodes[i], show, '1080p');
          } else {
            show.episodes.push(found.episodes[i]);
          }
        }

        return await this._updateNumSeasons(show);
      }

      logger.info(`${this._name}: '${show.title}' is a new show!`);
      const newShow = await new this._model(show).save();
      return await this._updateNumSeasons(newShow);
    } catch (err) {
      return logger.error(err);
    }
  }

  /**
   * Adds one seasonal season to a show.
   * @param {Show} show - The show to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {Number} seasonNumber - The season number.
   * @param {String} slug - The slug of the show.
   * @returns {void}
   */
  async _addSeasonalSeason(show, episodes, seasonNumber, slug) {
    try {
      seasonNumber = parseInt(seasonNumber, 10);
      const season = await this._trakt.seasons.season({
        id: slug,
        season: seasonNumber,
        extended: 'full'
      });

      for (let episodeData in season) {
        episodeData = season[episodeData]; // eslint-disable-line prefer-destructuring
        if (episodes[seasonNumber] && episodes[seasonNumber][episodeData.number]) {
          const episode = {
            tvdb_id: episodeData.ids['tvdb'],
            season: episodeData.season,
            episode: episodeData.number,
            title: episodeData.title,
            overview: episodeData.overview,
            date_based: false,
            first_aired: new Date(episodeData.first_aired).getTime() / 1000.0,
            torrents: {}
          };

          if (episode.first_aired > show.latest_episode) show.latest_episode = episode.first_aired;

          episode.torrents = episodes[seasonNumber][episodeData.number];
          episode.torrents[0] = episodes[seasonNumber][episodeData.number]['480p'] ? episodes[seasonNumber][episodeData.number]['480p'] : episodes[seasonNumber][episodeData.number]['720p'];
          show.episodes.push(episode);
        }
      }
    } catch (err) {
      return logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

  /**
   * Adds one datebased season to a show.
   * @param {Show} show - The show to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {Number} seasonNumber - The season number.
   * @returns {void}
   */
  async _addDateBasedSeason(show, episodes, seasonNumber) {
    try {
      if (show.tvdb_id) {
        const tvdbShow = await this._tvdb.getSeriesAllById(show.tvdb_id);
        for (let episodeData in tvdbShow.Episodes) {
          episodeData = tvdbShow.Episodes[episodeData]; // eslint-disable-line prefer-destructuring

          if (episodes[seasonNumber]) {
            Object.keys(episodes[seasonNumber]).map(episodeNumber => {
              if (`${seasonNumber}-${episodeNumber}` === episodeData.FirstAired) {
                const episode = {
                  tvdb_id: episodeData.id,
                  season: episodeData.SeasonNumber,
                  episode: episodeData.EpisodeNumber,
                  title: episodeData.EpisodeName,
                  overview: episodeData.Overview,
                  date_based: true,
                  first_aired: new Date(episodeData.FirstAired).getTime() / 1000.0,
                  torrents: {}
                };

                if (episode.first_aired > show.latest_episode) show.latest_episode = episode.first_aired;

                if (episode.season > 0) {
                  episode.torrents = episodes[seasonNumber][episodeNumber];
                  episode.torrents[0] = episodes[seasonNumber][episodeNumber]['480p'] ? episodes[seasonNumber][episodeNumber]['480p'] : episodes[seasonNumber][episodeNumber]['720p'];
                  show.episodes.push(episode);
                }
              }
            });
          }
        }
      }
    } catch (err) {
      return logger.error(`TVDB: Could not find any data on: ${err.path || err} with tvdb_id: '${show.tvdb_id}'`);
    }
  }

  /**
   * Get TV show images from TMDB.
   * @param {Number} tmdb - The tmdb id of the show you want the images from.
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
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.holder,
        fanart: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : BaseHelper.holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : BaseHelper.holder
      };
    });
  }

  /**
   * Get TV show images from TVDB.
   * @param {Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTvdbImages(tvdb) {
    return this._tvdb.getSeriesById(tvdb).then(images => {
      const baseUrl = 'http://thetvdb.com/banners/';

      return {
        banner: images.banner ? `${baseUrl}${images.banner}` : BaseHelper.holder,
        fanart: images.fanart ? `${baseUrl}${images.fanart}` : BaseHelper.holder,
        poster: images.poster ? `${baseUrl}${images.poster}` : BaseHelper.holder
      };
    });
  }

  /**
   * Get TV show images from Fanart.
   * @param {Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tvdb) {
    return this._fanart.getShowImages(tvdb).then(images => {
      return {
        banner: images.tvbanner ? images.tvbanner[0].url : BaseHelper.holder,
        fanart: images.showbackground ? images.showbackground[0].url : images.clearart ? images.clearart[0].url : BaseHelper.holder,
        poster: images.tvposter ? images.tvposter[0].url : BaseHelper.holder
      };
    });
  }

  /**
   * Get TV show images.
   * @override
   * @param {Number} tmdb - The tmdb id of the show you want the images from.
   * @param {Number} tvdb - The tvdb id of the show you want the images from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getImages(tmdb, tvdb) {
    return Promise.race([
      this._getTmdbImages(tmdb),
      this._getTvdbImages(tvdb),
      this._getFanartImages(tvdb)
    ]).catch(err => logger.error(`Images: Could not find images on: ${err.path || err} with id: '${tmdb || tvdb}'`));
  }

  /**
   * Get info from Trakt and make a new show object.
   * @override
   * @param {String} slug - The slug to query https://trakt.tv/.
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

      let watching = 0;
      if (traktWatchers !== null) watching = traktWatchers.length;

      if (traktShow && traktShow.ids['imdb'] && traktShow.ids['tmdb'] && traktShow.ids['tvdb']) {
        const { imdb, slug, tvdb } = traktShow.ids;

        return {
          _id: imdb,
          imdb_id: imdb,
          tvdb_id: tvdb,
          title: traktShow.title,
          year: traktShow.year,
          slug: slug,
          synopsis: traktShow.overview,
          runtime: traktShow.runtime,
          rating: {
            votes: traktShow.votes,
            watching: watching,
            percentage: Math.round(traktShow.rating * 10)
          },
          country: traktShow.country,
          network: traktShow.network,
          air_day: traktShow.airs.day,
          air_time: traktShow.airs.time,
          status: traktShow.status,
          num_seasons: 0,
          last_updated: Number(new Date()),
          latest_episode: 0,
          images: await this._getImages(tvdb, tvdb),
          genres: traktShow.genres !== null ? traktShow.genres : ['unknown'],
          episodes: []
        };
      }
    } catch (err) {
      return logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

  /**
   * Adds episodes to a show.
   * @param {Show} show - The show to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {String} slug - The slug of the show.
   * @returns {Show} - A show with updated torrents.
   */
  async addEpisodes(show, episodes, slug) {
    try {
      const { dateBased } = episodes;
      delete episodes.dateBased;

      if (dateBased) {
        await asyncq.each(
          Object.keys(episodes),
          seasonNumber => this._addDateBasedSeason(show, episodes, seasonNumber, slug)
        );
      }

      await asyncq.each(
        Object.keys(episodes),
        seasonNumber => this._addSeasonalSeason(show, episodes, seasonNumber, slug)
      );

      return await this._updateEpisodes(show);
    } catch (err) {
      return logger.error(err);
    }
  }

}
