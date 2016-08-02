// Import the neccesary modules.
import asyncq from "async-q";
import HummingbirdAPI from "hummingbird-api";

import Anime from "../../models/Anime";
import Util from "../../util";

/** class for saving anime shows. */
export default class Helper {

  /**
   * Create an helper object.
   * @param {String} name - The name of the helper.
   */
  constructor(name, debug) {
    /**
     * The name of the torrent provider.
     * @type {String}  The name of the torrent provider.
     */
    this.name = name;

    /**
     * A configured HummingBird API.
     * @type {HummingbirdAPI}
     * @see https://github.com/ChrisAlderson/hummingbird-api
     */
    this.hummingbird = new HummingbirdAPI({ debug });

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this.util = new Util();
  };

  /**
   * Update the number of episodes of a given anime
   * @param {Anime} anime - The anime to update the number of episodes.
   * @returns {Anime} - A newly updated anime.
   */
  async updateNumEpisodes(anime) {
    anime.num_episodes = anime.episodes.length;
    return await Anime.findOneAndUpdate({
      _id: anime._id
    }, anime, {
      new: true,
      upsert: true
    }).exec();
  };

  /**
   * Update the torrents for an existing anime.
   * @param {Object} matching - The matching episode of new the anime.
   * @param {Object} found - The matching episode existing anime.
   * @param {Anime} anime - The anime to merge the episodes to.
   * @param {String} quality - The quality of the torrent.
   * @returns {Anime} - An anime with merged torrents.
   */
  updateEpisode(matching, found, anime, quality) {
    let index = anime.episodes.indexOf(matching);

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
        if (quality === "480p") matching.torrents["0"] = found.torrents[quality];
        matching.torrents[quality] = found.torrents[quality];
      }
    } else if (found.torrents[quality] && !matching.torrents[quality]) {
      if (quality === "480p") matching.torrents["0"] = found.torrents[quality];
      matching.torrents[quality] = found.torrents[quality];
    }

    anime.episodes.splice(index, 1, matching);
    return anime;
  };

  /**
   * Update a given anime with it's associated episodes.
   * @param {Anime} anime - The anime to update its episodes.
   * @returns {Anime} - A newly updated anime.
   */
  async updateEpisodes(anime) {
    try {
      const found = await Anime.findOne({
          _id: anime._id
        }).exec();
      if (found) {
        console.log(`${this.name}: '${found.title}' is an existing anime.`);
        for (let i = 0; i < found.episodes.length; i++) {
          let matching = anime.episodes
            .filter(animeEpisode => animeEpisode.episode === found.episodes[i].episode);

          if (matching.length != 0) {
            anime = this.updateEpisode(matching[0], found.episodes[i], anime, "480p");
            anime = this.updateEpisode(matching[0], found.episodes[i], anime, "720p");
            anime = this.updateEpisode(matching[0], found.episodes[i], anime, "1080p");
          } else {
            anime.episodes.push(found.episodes[i]);
          }
        }

        return await this.updateNumEpisodes(anime);
      } else {
        console.log(`${this.name}: '${anime.title}' is a new anime!`);
        const newAnime = await new Anime(anime).save();
        return await this.updateNumEpisodes(newAnime);
      }
    } catch (err) {
      return this.util.onError(err);
    }
  };

  /**
   * Adds one season to a anime.
   * @param {Anime} anime - The anime to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {Integer} seasonNumber - The season number.
   * @param {String} slug - The slug of the anime.
   * @returns {Anime} - A new anime with seasons.
   */
  async addSeason(anime, episodes, seasonNumber, slug) {
    try {
      await asyncq.each(Object.keys(episodes[seasonNumber]), episodeNumber => {
        const episode = {
          title: `Episode ${episodeNumber}`,
          torrents: {},
          season: seasonNumber,
          episode: episodeNumber,
          overview: `We still don't have single episode overviews for anime… Sorry`,
          tvdb_id: `${anime._id}-1-${episodeNumber}`
        };

        episode.torrents = episodes[seasonNumber][episodeNumber];
        episode.torrents[0] = episodes[seasonNumber][episodeNumber]["480p"] ? episodes[seasonNumber][episodeNumber]["480p"] : episodes[seasonNumber][episodeNumber]["720p"];
        anime.episodes.push(episode);
      });
    } catch (err) {
      return this.util.onError(`Hummingbird: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  };

  /**
   * Get info from Hummingbird and make a new anime object.
   * @param {String} slug - The slug to query https://hummingbird.me/.
   * @returns {Anime} - A new anime without the episodes attached.
   */
  async getHummingbirdInfo(slug) {
    try {
      const hummingbirdAnime = await this.hummingbird.Anime.getAnime(slug);

      let type;
      if (hummingbirdAnime.show_type === "TV") {
        type = "show";
      } else {
        type = "movie";
      }

      const genres = hummingbirdAnime.genres.map(genre => genre.name);

      if (hummingbirdAnime && hummingbirdAnime.id) {
        return {
          _id: hummingbirdAnime.id,
          mal_id: hummingbirdAnime.mal_id,
          title: hummingbirdAnime.title,
          year: new Date(hummingbirdAnime.started_airing).getFullYear(),
          slug: hummingbirdAnime.slug,
          synopsis: hummingbirdAnime.synopsis,
          runtime: hummingbirdAnime.episode_length,
          status: hummingbirdAnime.status,
          rating: {
            hated: 100,
            loved: 100,
            votes: 0,
            watching: 0,
            percentage: (Math.round(hummingbirdAnime.community_rating * 10)) * 2,
          },
          type,
          num_episodes: 0,
          last_updated: Number(new Date()),
          images: {
            banner: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : "images/posterholder.png",
            fanart: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : "images/posterholder.png",
            poster: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : "images/posterholder.png"
          },
          genres: genres !== null ? genres : ["unknown"],
          episodes: []
        };
      }
    } catch (err) {
      return this.util.onError(`Hummingbird: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
    }
  };

  /**
   * Adds episodes to a anime.
   * @param {Show} anime - The anime to add the torrents to.
   * @param {Object} episodes - The episodes containing the torrents.
   * @param {String} slug - The slug of the anime.
   * @returns {Anime} - A anime with updated torrents.
   */
  async addEpisodes(anime, episodes, slug) {
    try {
      await asyncq.each(Object.keys(episodes), seasonNumber => this.addSeason(anime, episodes, seasonNumber, slug));
      return await this.updateEpisodes(anime);
    } catch (err) {
      return this.util.onError(err);
    }
  };

};
