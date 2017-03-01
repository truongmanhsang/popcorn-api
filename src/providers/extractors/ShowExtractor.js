// Import the neccesary modules.
import asyncq from 'async-q';

import BaseExtractor from './BaseExtractor';
import Show from '../../models/Show';
import ShowHelper from '../helpers/ShowHelper';
import { showMap } from '../../config/constants';

/** Class for extracting TV shows from torrents. */
export default class ShowExtractor extends BaseExtractor {

  /**
   * Create an extractor object for movie content.
   * @param {String} config.name - The name of the content provider.
   * @param {Object} config.torrentProvider - The content provider to extract
   * content from.
   * @param {String} config.type - The content type to extract.
   * @param {Object} [config.model=Show] - The model for the movie helper.
   */
  constructor({name, torrentProvider, type, model = Show} = {}) {
    super({name, torrentProvider, type});

    /**
     * The helper object for adding shows.
     * @type {ShowHelper}
     */
    this._helper = new ShowHelper(this._name, model);
  }

  /**
   * Extract show information based on a regex.
   * @param {Object} torrent - The torrent to extract the show information from.
   * @param {Regex} regex - The regex to extract the show information.
   * @param {Boolean} dateBased - Check for dateBased episodes.
   * @returns {Object} - Information about a show from the torrent.
   */
  _extractContent(torrent, regex, dateBased) {
    let showTitle, slug, season, episode;

    showTitle = torrent.title.match(regex)[1];
    if (showTitle.endsWith(' ')) showTitle = showTitle.substring(0, showTitle.length - 1);
    showTitle = showTitle.replace(/\./g, ' ');

    slug = showTitle.replace(/[^a-zA-Z0-9 ]/gi, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase();
    if (slug.endsWith('-')) slug = slug.substring(0, slug.length - 1);
    slug = slug in showMap ? showMap[slug] : slug;

    // TODO: fix this.
    // const season = 1;
    // if (torrent.title.match(regex).length >= 4) {
    //   episode = parseInt(torrent.title.match(regex)[3], 10);
    // } else {
    //   episode = parseInt(torrent.title.match(regex)[2], 10);
    // }

    season = torrent.title.match(regex)[2];
    episode = torrent.title.match(regex)[3];
    if (!dateBased) {
      season = parseInt(season, 10);
      episode = parseInt(episode, 10);
    }

    const quality = torrent.title.match(/(\d{3,4})p/) !== null
                                ? torrent.title.match(/(\d{3,4})p/)[0]
                                : '480p';

    const torrentObj = {
      url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
      seeds: torrent.seeds ? torrent.seeds : 0,
      peers: torrent.peers ? torrent.peers : 0,
      provider: this._name
    };

    const show = {
      showTitle,
      slug,
      season,
      episode,
      quality,
      dateBased,
      episodes: {}
    };

    return this._createEpisode(show, torrentObj, season, episode, quality);
  }

  /**
   * Get show info from a given torrent.
   * @param {Object} torrent - A torrent object to extract show information
   * from.
   * @returns {Object} - Information about a show from the torrent.
   */
  _getContentData(torrent) {
    const seasonBased = /(.*).[sS](\d{2})[eE](\d{2})/i;
    const vtv = /(.*).(\d{1,2})[x](\d{2})/i;
    const dateBased = /(.*).(\d{4}).(\d{2}.\d{2})/i;
    const secondSeason = /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i;
    const oneSeason = /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i;

    if (torrent.title.match(seasonBased)) {
      return this._extractContent(torrent, seasonBased, false);
    } else if (torrent.title.match(vtv)) {
      return this._extractContent(torrent, vtv, false);
    } else if (torrent.title.match(dateBased)) {
      return this._extractContent(torrent, dateBased, true);
    } else if (torrent.title.match(secondSeason)) {
      return this._extractContent(torrent, secondSeason, false);
    } else if (torrent.title.match(oneSeason)) {
      return this._extractContent(torrent, oneSeason, false);
    }

    logger.warn(`${this._name}: Could not find data from torrent: '${torrent.title}'`);
  }

  /**
   * Create a new show object with a torrent attached.
   * @param {Object} show - The show to attach a torrent to.
   * @param {Object} torrent - The torrent object.
   * @param {Number} season - The season number for the torrent.
   * @param {Number} episode - The episode number for the torrent.
   * @param {quality} quality - The quality of the episode.
   * @returns {Object} - The show with the newly attached torrent.
   */
  _createEpisode(show, torrent, season, episode, quality) {
    if (!show.episodes[season]) show.episodes[season] = {};
    if (!show.episodes[season][episode]) show.episodes[season][episode] = {};

    const qualityObj = show.episodes[season][episode][quality];
    if ((!qualityObj || show.showTitle.toLowerCase().indexOf('repack') > -1)
        || (qualityObj && qualityObj.seeds < torrent.seeds)) {
      show.episodes[season][episode][quality] = torrent;
    }

    return show;
  }

  /**
   * Puts all the found shows from the torrents in an array.
   * @param {Array} torrents - A list of torrents to extract show information.
   * @returns {Array} - A list of objects with show information extracted from
   * the torrents.
   */
  _getAllContent(torrents) {
    const shows = [];

    return asyncq.mapSeries(torrents, torrent => {
      const show = this._getContentData(torrent);
      if (!show) return null;

      const { showTitle, slug, season, episode, quality } = show;
      const matching = shows.find(
        s => s.showTitle === showTitle && s.slug === slug
      );

      if (!matching) return shows.push(show);

      const index = shows.indexOf(matching);

      const torrentObj = show.episodes[season][episode][quality];
      const created = this._createEpisode(matching, torrentObj, season, episode, quality);

      shows.splice(index, 1, created);
    }).then(() => shows);
  }

}
