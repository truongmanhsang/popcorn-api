# Change log

All notable changes to this project will be documented in this file. See
[standard-version](https://github.com/conventional-changelog/standard-version)
for commit guidelines.



<a name="2.2.4"></a>
## [2.2.4](https://github.com/popcorn-official/popcorn-api/commit/83ca4a24f77ea749f827a7d623db48e2ca821ed0) (17-12-2016)

### Features
 * Testing with [Dredd](https://github.com/apiaryio/dredd) in favor of mocha.
 * Better fetching of images.


### Bug Fixes
 * Fixed ExtraTorrent scraping with [extratorrent-api@1.0.9](https://github.com/ChrisAlderson/extratorrent-api).



<a name="2.2.3"></a>
## [2.2.3](https://github.com/popcorn-official/popcorn-api/commit/e7537765cf91e16ed81999325e06657e7ebcfbf6) (19-11-2016)

### Features
 * Added `themoviedbclient` as a provider for images.
 * Moved `/` to `/status`.
 * Removed JSCS for ESLint.


### Bug Fixes
 * `trailer` defaults to `null` instead of `false`.



<a name="2.2.2"></a>
## [2.2.2](https://github.com/popcorn-official/popcorn-api/commit/528abcbe1e4dca514647ff23881a2baf23c7df8b) (26-10-2016)

### Features
 * Movie images are now coming from Fanart.tv or OMDB.
 * Show images are now coming from Fanart.tv or TVDB.


### Bug Fixes
 * Removed special characters when searching with keywords [#44](https://github.com/popcorn-official/popcorn-api/issues/44).



<a name="2.2.1"></a>
## [2.2.1](https://github.com/popcorn-official/popcorn-api/commit/3d4c99b1fc9ce8455542b427017ccd6cc74833f6) (23-08-2016)

### Bug Fixes
 * Fixed an issue where the API could return an anime with the type `movie`.
 * Fixed an issue where a season of a date based show could be `0`.
 * Fixed an issue where date based shows where not added correctly.



<a name="2.2.0"></a>
## [2.2.0](https://github.com/popcorn-official/popcorn-api/commit/1fcf1f130ba3f2eeb167b2d115b9ae5c1e32ed04) (11-08-2016)

### Features
 * Added extractors to extract torrents and content data from content providers.
 * Added ExtraTorrent as a content provider with the [extratorrent-api](https://github.com/ChrisAlderson/extratorrent-api) module.
 * DateBased shows are now included in the scrape [#8](https://github.com/popcorn-official/popcorn-api/issues/8).
 * Added Nyaa as a content provider for anime with the [nyaa-api-pt](https://github.com/ChrisAlderson/nyaa-api-pt) module.
 * Added tests for the controllers.
 * Changed `num_episodes` to `num_seasons` for the `Anime` model.



<a name="2.1.0"></a>
## [2.1.0](https://github.com/popcorn-official/popcorn-api/commit/3c94446e39fad43a744cfb30134f26b433dc8e67) (02-08-2016)

### Features
 * Anime! For all you weeaboos.
 * Get a random TV show at `/random/show`.
 * Import & export collection.
 * Moved documentation over to ESDoc.
 * Documentation will now be on GitHub.
 * Added Travis CI.
 * Using ES6 classes instead of factory functions.


### Bug Fixes
   - Fixed search not working correctly.
   - Fixed MongoDB sorting limitation [#25](https://github.com/popcorn-official/popcorn-api/issues/25).



<a name="2.0.0"></a>
## [2.0.0](https://github.com/popcorn-official/popcorn-api/commit/c773837a3932261618db33b2bcbd25474c86cc9a) (20-06-2016)

### Features
 * Get a random movie at `/random/movie`.
 * Added YTS as a movie provider.
 * Movies now support multiple languages.
 * Moved the entire project to ES6 with [Babel](https://babeljs.io/).
 * The API can now be installed globally.
 * Added a command line interface to the API ([See CLI](https://popcorn-official.github.io/popcorn-api/manual/usage.html#global)).
   * Able to add new show torrents through the CLI.
   * Able to add new movie torrents through the CLI.
 * Added support for the Gulp build system ([See Gulp](https://popcorn-official.github.io/popcorn-api/manual/usage.html#gulp)).
 * Documentation can be generated with the `npm run docs`.
 * Added option to start with the forever module (`npm run forever`).
 * Changed the projection of movies so it can be used with a [popcorntime provider](https://github.com/ChrisAlderson/butter-provider-movies).
 * (HTTP) Logging is done with the Winston library.
 * Added configuration for JSCS linter.
 * Changed license from GPLv3 to MIT.
 * Moved the library for eztv scraping to its own module over [here](https://github.com/ChrisAlderson/eztv-api-pt).
 * Moved the library for kat scraping to its own module over [here](https://github.com/ChrisAlderson/kat-api-pt).
 * Redid the [README.md](README.md).
 * Redid the kat providers.


### Bug Fixes
 * Fixed bug where the cron job was not working.
 * Fixed bug where better movie and show torrents did not update.
 * Fixed bug where `num_seasons` was fluctuating.



<a name="1.1.0"></a>
## [1.1.0](https://github.com/popcorn-official/popcorn-api/commit/433dc80daad41228c000a86d607abfb1d092c18b) (20-03-2016)

### Features
 * Movies!
   * Scrape movies from kat.cr the same way shows work.
   * Routes to get a list of movies or a specific movie.
 * Added `/logs/error` to see the error log.
 * Added `imdbMap` in `config.js` for correcting imdb ids.
 * Disabled `/shows/search/`, `/shows/update/`, `/shows/last_updated` routes as they don't seem to be used by Popcorn Time.
 * Made scraping EZTV faster by merging the `getShowDetails` and `getAllEpisodes` functions.
 * Required NodeJS version was changed in 1.0.2 to NodeJS v.5.0.0.
 * Fixed several issues with adding content through the CLI.


### Bug Fixes
 * Fixed issue where some season based episodes from EZTV where not added (Including [Last Week Tonight with John Oliver](https://eztv.ag/shows/1025/last-week-tonight-with-john-oliver/)).
 * Partially fixed issue with MongoDB limitations to sorting.
 * Status will now be set to `Idle` after scraping is done.



## [1.0.2](https://github.com/popcorn-official/popcorn-api/commit/cb89f8a0d5d8baf1b87d606b334b125d7ae2cfba) (14-03-2016)

### Features
 * Resets the log files on each scrape.
 * Added `repo` to the index.
 * Removed dependency on Q.
 * Replaced `slug` with `imdb` for getting seasonal metadata from trakt.tv.

### Bug Fixes
 * Now properly updates metadata.
 * Some fixes to prevent ETIMEDOUT.



<a name="1.0.1"></a>
## [1.0.1](https://github.com/popcorn-official/popcorn-api/commit/3280e84bdf7def38c24c2012215cec0be3aceaf9) (06-03-2016)

### Bug Fixes
 * Sort by trending.



<a name="1.0.0"></a>
## [1.0.0](https://github.com/popcorn-official/popcorn-api/commit/75bb4c9a958cadcf906d3eb25edd3c7650ea349f) (01-03-2016)

### Features
 * Scraping EZTV.ag just like the old API.
 * Scraping kat.cr with 17 different providers.
 * Able to add more providers for kat.cr scraping.
