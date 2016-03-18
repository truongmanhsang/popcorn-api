1.0.3 - It went unnoticed = 16 March 2016
=========================================

New features:
 - Added `/logs/error` to see the error log
 - Added `imdbMap` in `config.js` for correcting imdb ids.

Bug fixes:
 - Fixed issue where some season based episodes from EZTV where not added (Including [Last Week Tonight with John Oliver](https://eztv.ag/shows/1025/last-week-tonight-with-john-oliver/))
 - Fixed issue with MongoDB limitations to sorting
 - Status will now be set to `Idle` after scraping is done

Notes:
 - Disabled `/shows/search/`, `/shows/update/`, `/shows/last_updated` routes as they don't seem to be used by the
 - Made scraping EZTV faster by merging the `getShowDetails` and `getAllEpisodes` functions
 - Required NodeJS version was changed in 1.0.2 to NodeJS v.5.0.0

1.0.2 - Wanna retry? - 14 March 2016
====================================

New features:
 - Resets the log files on each scrape
 - Added `repo` to the index

Bug fixes:
 - Now properly updates metadata
 - Some fixes to prevent ETIMEDOUT

Notes:
 - Removed dependency on Q
 - Replaced `slug` with `imdb` for getting seasonal metadata from trakt.tv

1.0.1 - What's trening? - 6 March 2016
======================================

Bug fixes:
 - Sort by trending

1.0.0 - Let's kick some ass! -  1 March 2016
============================================

Features:
 - Scraping EZTV.ag just like the old API
 - Scraping kat.cr with 17 different providers
 - Able to add more providers for kat.cr scraping
