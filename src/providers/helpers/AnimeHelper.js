// Import the neccesary modules.
import asyncq from 'async-q';

import Anime from '../../models/Anime';
import { fanart, trakt, tmdb, tvdb } from '../../config/constants';
import {
  checkImages,
  onError
} from '../../utils';

/** class for saving anime shows. */
export default class AnimeHelper {

  /**
   * Create an helper object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;
  }

  /**
   * Update the number of seasons of a given anime.
   * @param {Anime} anime - The anime to update the number of seasons.
   * @returns {Anime} - A newly updated anime.
   */
  async _updateNumSeasons(anime) {
    const saved = await Anime.findOneAndUpdate({
      _id: anime._id
    }, anime, {
      new: true,
      upsert: true
    }).exec();

    const distinct = await Anime.distinct('episodes.season', {
      _id: saved._id
    }).exec();
    saved.num_seasons = distinct.length;

    return await Anime.findOneAndUpdate({
      _id: saved._id
    }, saved, {
      new: true,
      upsert: true
    }).exec();
  }

  /**
   * Update the torrents for an existing anime.
   * @param {Object} matching - The matching episode of new the anime.
   * @param {Object} found - The matching episode existing anime.
   * @param {Anime} anime - The anime to merge the episodes to.
   * @param {String} quality - The quality of the torrent.
   * @returns {Anime} - An anime with merged torrents.
   */
  _updateEpisode(matching, found, anime, quality) {
    const index = anime.episodes.indexOf(matching);

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

    anime.episodes.splice(index, 1, matching);
    return anime;
  }

  /**
   * Update a given anime with it's associated episodes.
   * @param {Anime} anime - The anime to update its episodes.
   * @returns {Anime} - A newly updated anime.
   */
  async _updateEpisodes(anime) {
    try {
      const found = await Anime.findOne({
        _id: anime._id
      }).exec();
      if (found) {
        logger.info(`${this.name}: '${found.title}' is an existing anime.`);
        for (let i = 0; i < found.episodes.length; i++) {
          let matching = anime.episodes
            .filter(animeEpisode => animeEpisode.episode === found.episodes[i].episode);

          if (matching.length != 0) {
            anime = this._updateEpisode(matching[0], found.episodes[i], anime, '480p');
            anime = this._updateEpisode(matching[0], found.episodes[i], anime, '720p');
            anime = this._updateEpisode(matching[0], found.episodes[i], anime, '1080p');
          } else {
            anime.episodes.push(found.episodes[i]);
          }
        }

        return await this._updateNumSeasons(anime);
      } else {
        logger.info(`${this.name}: '${anime.title}' is a new anime!`);
        const newAnime = await new Anime(anime).save();
        return await this._updateNumSeasons(newAnime);
      }
    } catch (err) {
      return onError(err);
    }
  }

  /**
   * Adds one season to a anime.
   * @param {Anime} anime - The anime to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {Integer} seasonNumber - The season number.
   * @param {String} slug - The slug of the anime.
   */
   /**
    * Adds one seasonal season to an anime show.
    * @param {Anime} anime - The anime show to add the torrents to.
    * @param {Object} episodes - The episodes containing the torrents.
    * @param {Integer} seasonNumber - The season number.
    * @param {String} slug - The slug of the anime show.
    */
   async _addSeason(anime, episodes, seasonNumber, slug) {
     try {
       seasonNumber = parseInt(seasonNumber);
       const season = await trakt.seasons.season({
         id: slug,
         season: seasonNumber,
         extended: 'full'
       });

       for (let episodeData in season) {
         episodeData = season[episodeData];
         if (episodes[seasonNumber] && episodes[seasonNumber][episodeData.number]) {
           const episode = {
             tvdb_id: episodeData.ids['tvdb'],
             season: episodeData.season,
             episode: episodeData.number,
             title: episodeData.title,
             overview: episodeData.overview,
             date_based: false,
             first_aired: new Date(episodeData.first_aired).getTime() / 1000.0,
             watched: {
               watched: false
             },
             torrents: {}
           };

           if (episode.first_aired > show.latest_episode) show.latest_episode = episode.first_aired;

           episode.torrents = episodes[seasonNumber][episodeData.number];
           episode.torrents[0] = episodes[seasonNumber][episodeData.number]['480p'] ? episodes[seasonNumber][episodeData.number]['480p'] : episodes[seasonNumber][episodeData.number]['720p'];
           show.episodes.push(episode);
         }
       }
     } catch (err) {
       return onError(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
     }
   }

  /**
   * Get anime show images.
   * @param {Integer} tmdb_id - The tmdb id of the anime show you want the images from.
   * @param {Integer} tvdb_id - The tvdb id of the anime show you want the images from.
   * @returns {Object} - Object with a banner, fanart and poster images.
   */
  async _getImages(tmdb_id, tvdb_id) {
    const holder = 'images/posterholder.png';
    const images = {
      banner: holder,
      fanart: holder,
      poster: holder
    };

    try {
      const tmdbData = await tmdb.call(`/tv/${tmdb_id}/images`, {});

      let tmdbPoster = tmdbData['posters'].filter(poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null)[0];
      tmdbPoster = tmdb.getImageUrl(tmdbPoster.file_path, 'w500');

      let tmdbBackdrop = tmdbData['backdrops'].filter(backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null)[0];
      tmdbBackdrop = tmdb.getImageUrl(tmdbBackdrop.file_path, 'w500');

      images.banner = tmdbPoster ? tmdbPoster : holder;
      images.fanart = tmdbBackdrop ? tmdbBackdrop : holder;
      images.poster = tmdbPoster ? tmdbPoster : holder;

      this._checkImages(images, holder);
    } catch (err) {
      try {
        const tvdbImages = await tvdb.getSeriesById(tvdb_id);

        if (images.banner === holder) {
          images.banner = tvdbImages.banner ? `http://thetvdb.com/banners/${tvdbImages.banner}` : holder;
        }
        if (images.fanart === holder) {
          images.fanart = tvdbImages.fanart ? `http://thetvdb.com/banners/${tvdbImages.fanart}` : holder;
        }
        if (images.poster === holder) {
          images.poster = tvdbImages.poster ? `http://thetvdb.com/banners/${tvdbImages.poster}` : holder;
        }

        checkImages(images, holder);
      } catch (err) {
        try {
          const fanartImages = await fanart.getShowImages(tvdb_id);

          if (images.banner === holder) {
            images.banner = fanartImages.tvbanner ? fanartImages.tvbanner[0].url : holder;
          }
          if (images.fanart === holder) {
            images.fanart = fanartImages.showbackground ? fanartImages.showbackground[0].url : fanartImages.clearart ? fanartImages.clearart[0].url : holder;
          }
          if (images.poster === holder) {
            images.poster = fanartImages.tvposter ? fanartImages.tvposter[0].url : holder;
          }
        } catch (err) {
          onError(`Images: Could not find images on: ${err.path || err} with id: '${tmdb_id | tvdb_id}'`);
        }
      }
    }

    return images;
  }

  /**
   * Get info from Trakt and make a new anime show object.
   * @param {String} slug - The slug to query https://trakt.tv/.
   * @returns {Anime} - A new anime show without the episodes attached.
   */
  async getTraktInfo(slug) {
    try {
      const traktAnime = await trakt.shows.summary({
        id: slug,
        extended: 'full'
      });
      const traktWatchers = await trakt.shows.watching({
        id: slug
      });

      let watching = 0;
      if (traktWatchers !== null) watching = traktWatchers.length;

      if (traktAnime && traktAnime.ids['imdb'] && traktAnime.ids['tmdb'] && traktAnime.ids['tvdb']) {
        return {
          _id: traktAnime.ids['imdb'],
          imdb_id: traktAnime.ids['imdb'],
          tvdb_id: traktAnime.ids['tvdb'],
          title: traktAnime.title,
          year: traktAnime.year,
          slug: traktAnime.ids['slug'],
          synopsis: traktAnime.overview,
          runtime: traktAnime.runtime,
          rating: {
            hated: 100,
            loved: 100,
            votes: traktAnime.votes,
            watching: watching,
            percentage: Math.round(traktAnime.rating * 10)
          },
          country: traktAnime.country,
          network: traktAnime.network,
          air_day: traktAnime.airs.day,
          air_time: traktAnime.airs.time,
          status: traktAnime.status,
          num_seasons: 0,
          last_updated: Number(new Date()),
          latest_episode: 0,
          images: await this._getImages(traktAnime.ids['tmdb'], traktAnime.ids['tvdb']),
          genres: traktAnime.genres !== null ? traktAnime.genres : ['unknown'],
          episodes: []
        };
      }
    } catch (err) {
      return onError(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  }

  /**
   * Adds episodes to a anime.
   * @param {Show} anime - The anime to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {String} slug - The slug of the anime.
   * @returns {Anime} - A anime with updated torrents.
   */
  async addEpisodes(anime, episodes, slug) {
    try {
      await asyncq.each(Object.keys(episodes), seasonNumber => this._addSeason(anime, episodes, seasonNumber, slug));
      return await this._updateEpisodes(anime);
    } catch (err) {
      return onError(err);
    }
  }

}
