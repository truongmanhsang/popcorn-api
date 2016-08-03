# Tutorial

In this tutorial section you can read about the scraping process of the API.

## Scraper

The `scraper.js` class is the entry point to start the scraping process with the `scrape` method. This method will iterate through an array of methods to scrape each individual content provider.

```javascript
scrape() {
  Scraper._util.setLastUpdated();

  asyncq.eachSeries([
    this._scrapeEZTVShows,
    this._scrapeKATShows,
    this._scrapeYTSMovies,
    this._scrapeKATMovies,
    this._scrapeHorribelSubsAnime,
    this._scrapeKATAnime
  ], scraper => scraper()).then(value => Scraper._util.setStatus())
    .catch(err => Scraper._util.onError(`Error while scraping: ${err}`));
};
```

## Content Providers

Popcorn API gets its torrent content from various sources. Here you can see where the content is coming from.

|              | Anime | Movie | Show |
|--------------|-------|-------|------|
| EZTV         |       |       | X    |
| Horriblesubs | X     |       |      |
| KAT          | X     | X     | X    |
| YTS          |       | X     |      | |

### EZTV

Content from [eztv.ag](https://eztv.ag/) is grabbed through the [eztv-api-pt](https://github.com/ChrisAlderson/eztv-api-pt) module. The module contains two methods `getAllShows` and `getShowData`.

#### getAllShows

This method returns a list of all the available shows listed [here](https://eztv.ag/showlist/). Through regular expression it grabs the show title, the id used by [eztv](https://eztv.ag/) and the slug.

```javascript
[{
    show: "10 O\"Clock Live",
    id: "449",
    slug: "10-o-clock-live"
  }, {
    show: "10 Things I Hate About You",
    id: "308",
    slug: "10-things-i-hate-about-you"
  },
  ...
]
```

#### getShowData

Each show from the `getAllShows` can be passed into the `getShowData` method to get more data on the individual show. Through this process the slug can change to another slug or imdb id which is compatible with [trakt.tv](https://trakt.tv/). Torrents are being added to the `episodes` property which is compatible with the [helper](#helpers) to insert the torrents into the MongoDB database. Nested within the `episodes` property there is the `season number` within the `season number` is the `episode number` and within the `episode number` are the different `qualities` of the torrent.

```javascript
{ show: "10 O\'Clock Live",
  id: "449",
  slug: "tt1811399",
  episodes:
   { "1":
      { "1":
         { "480p":
            { url: "magnet:?xt=urn:btih:LMJXHHNOW33Z3YGXJLCTJZ23WK2D6VO4&dn=10.OClock.Live.S01E01.WS.PDTV.XviD-PVR&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969",
              seeds: 0,
              peers: 0,
              provider: "EZTV" } },
        ...
      }
    }
}
```


### Horriblesubs

Content from [horriblesubs.info](https://horriblesubs.info/) is grabbed through the [horriblesubs-api](https://github.com/ChrisAlderson/horriblesubs-api) module. The module contains two methods `getAllAnime` and `getAnimeData`. This module is based on [eztv-api-pt](https://github.com/ChrisAlderson/eztv-api-pt) module and the usage of the module within the API is very similar to the [EZTV provider](#eztv).

#### getAllAnime

This method returns a list of all the available shows listed [here](http://horriblesubs.info/shows/). Through the [cheerio](https://github.com/cheeriojs/cheerio) module it grabs the anime title, the slug, and the link to get more details about the anime.

```javascript
[{
  link: "/shows/91-days",
  slug: "91-days",
  title: "91 Days"
}, {
  link: "/shows/absolute-duo",
  slug: "absolute-duo",
  title: "Absolute Duo"
}, ...]
```

#### getAnimeData

Each anime from the `getAllAnime` can be passed into the `getAnimeData` method to get more data on the individual anime. Through this process the slug can change to another slug which is compatible with [hummingbird.me](https://hummingbird.me). The `hs_showid` is added and torrents are being added to the `episodes` property which is compatible with the [helper](#helpers) to insert the torrents into the MongoDB database. Nested within the `episodes` property there is the `season number` within the `season number` is the `episode number` and within the `episode number` are the different `qualities` of the torrent.

```javascript
{ link: "/shows/91-days",
  slug: "ninety-one-days",
  title: "91 Days",
  hs_showid: "731",
  episodes:
   { "1":
      { "1":
        { "480":
          { url: "magnet:?xt=urn:btih:AYIJKPLP5WVVF36O25JBB3FFPNJEBBPQ&tr=http://open.nyaatorrents.info:6544/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.coppersurfer.tk:6969/announce",
          seeds: 0,
          peers: 0,
          provider: "HorribleSubs" } },
        ...
      }
    }
}
```

### KAT

Content from [kat.cr](https://kat.cr/) is grabbed with so called `providers` which can be configured in the `./src/config/constants.js` file. Providers will be converted to a search query to [kat.cr](https://kat.cr/) so each provider can get a maximum of 10.000 torrents (or 400 pages or torrents). The module used for getting the data from [kat.cr](https://kat.cr/) can be found [here](https://github.com/chrisalderson/kat-api-pt).

Each provider needs a `name` property and a `query` property. The `name` property is a `String` will be used for logging purposes so that issues can be more easily figured out. The `query` property is an `Object` which can contain various properties. These properties will be converted into a search query to [kat.cr](https://kat.cr/).

The following `query` properties can be used:
```
- query               # Search for keywords
- category            # The category to search for e.g. tv or movies
- uploader            # The name of the uploader of the torrents
- min_seeds           # The minimum amount of seeds
- age                 # The age of the torrents
- min_files           # The minimum amount of files
- imdb                # The imdb id for a tv show (only works with category:tv)
- tvrage              # The tvrage id for a tv show (only works with category:tv)
- isbn                # The isbn id for a book (only works with category:books)
- language            # The language of the movie/tv show e.g. en or pl
- adult_filter        # Adult filtering of torrents
- verified            # Show only the verified torrents
- season              # Season number of a tv show (only works with category:tv)
- episode             # Episode number of a tv show (only works with category:tv)
- page                # The page to search on.
- sort_by             # Sort by property
- order               # Order the list asc or desc
```

All three types of content can be scraped from [kat.cr](https://kat.cr/) through the `kat.js` class in each folder of the providers. By default the `kat.js` class add a few default properties to the providers. The `page` property does not need to be indicated as the algorithm for scraping [kat.cr](https://kat.cr/) will go through all the available pages. The `adult_filter` and `verified` properties are also turned on by default to potentially filter out bad content. The `category` property is filled in for each type of content. For `anime` it is `english-translated`, the `movies` category is `movies` and for `shows` there is `tv`. Lastly the `movies` need a `language` property otherwise the scraper with throw an error and the `shows` will have a default `language` as `en` so only English TV shows get filtered.

**An example of a provider:**
```javascript
{
  name: "ZonerLOL",
  query: {
    query: "x264-LOL",
    min_seeds: 3
  }
}
```

If you want to make a provider for [kat.cr](https://kat.cr/) it is highly recommended you try it fist in the browser by manually going to [kat.cr](https://kat.cr/) and search for the content because the title of the torrent will be subjected to regular expression to grab the needed data for the [helper](#helpers) to insert the torrents into the MongoDB database.

#### Anime

**NOTE:** the kat content provider was written just before the [kat.cr](https://kat.cr/) was taken down. This is why there is only one regular expression and it is for Horriblesubs. This regular expression is redundant because of the [horriblesubs](#horriblesubs) provider.

The regular expression needs to get an `title`, `episode` and a `quality` property. A `season` property is optional, if the `season` is not in the episode title it will assume the torrent is from `season` 1. Down below you can see the method to get the needed data for an anime episode. If your content does not match any of these regular expressions, you can add the regular expression to the method.

```javascript
_getAnimeData(torrent) {
  const secondSeason = /\[horriblesubs\].(.*).S(\d)...(\d{2,3}).\[(\d{3,4}p)\]/i; // [HorribleSubs] Fairy Tail S2 - 70 [1080p].mkv
  const oneSeason = /\[horriblesubs\].(.*)...(\d{2,3}).\[(\d{3,4}p)\]/i // [HorribleSubs] Gangsta - 06 [480p].mkv
  if (torrent.title.match(secondSeason)) {
    return this._extractAnime(torrent, secondSeason);
  } else if (torrent.title.match(oneSeason) {
    return this._extractAnime(torrent, oneSeason);
  } else {
    console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
  }
};
```

#### Movie

The regular expression for movies needs to get a `title`, `year` and a `quality` property. Down below you can see the method to get the needed data for a movie. If your content does not match any of these regular expressions, you can add the regular expression to the method.

```javascript
_getMovieData(torrent, language) {
  const threeDimensions = /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/; // Journey to Space 2015 3D 1080p BRRip Half-SBS x264 AAC-ETRG
  const fourKay = /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/; // Spider Man 2002 4K REMASTERED Bluray 1080p TrueHD x264-Grym
  const withYear = /(.*).(\d{4})\D+(\d{3,4}p)/; // Batman Begins 2005 720p BluRay x264 AC3 - Ozlem
  if (torrent.title.match(threeDimensions)) {
    return this._extractMovie(torrent, language, threeDimensions);
  } else if (torrent.title.match(fourKay)) {
    return this._extractMovie(torrent, language, fourKay);
  } else if (torrent.title.match(withYear)) {
    return this._extractMovie(torrent, language, withYear);
  } else {
    console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
  }
};
```

#### Show

The regular expression for shows needs to get a `title`, `season`, `episode` and a `quality` property. Down below you can see the method to get the needed data for a show episode. If your content does not match any of these regular expressions, you can add the regular expression to the method.

```javascript
_getShowData(torrent) {
  const seasonBased = /(.*).[sS](\d{2})[eE](\d{2})/; // Dexter S08E09 720p HDTV x264-IMMERSE
  const vtv = /(.*).(\d{1,2})[x](\d{2})/; // The Whispers 1x09 (HDTV-x264-KILLERS)[VTV]
  const dateBased = /(.*).(\d{4}).(\d{2}.\d{2})/; // Jimmy Fallon 2016 08 02 Jonah Hill HDTV x264-CROOKS
  if (torrent.title.match(seasonBased)) {
    return this._extractShow(torrent, seasonBased, false);
  } else if (torrent.title.match(vtv)) {
    return this._extractShow(torrent, vtv, false);
  } else if (torrent.title.match(dateBased)) {
    return this._extractShow(torrent, dateBased, true);
  } else {
    console.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`);
  }
};
```

### YTS

**NOTE:** This provider will most likely be moved to use a YTS API wrapper module. No API wrappers exists for YTS which are using promises, so one needs to be made.

## Helpers

The `helper.js` classes in each provider folder helps the providers to insert the scraped data into the MongoDB database. The providers need to call two methods.

### Anime & Show

The first method to call is `getHummingbirdInfo` for anime and `getTraktInfo` for shows. These methods need a slug as a parameter (`getTraktInfo` can also use an imdb id). These methods will fetch metadata from [hummingbird.me](https://hummingbird.me/) or [trakt.tv](https://trakt.tv) and return an object based on the schema of the mongoose model, but without any episodes.

```javascript
getTraktInfo(slug);
getHummingbirdInfo(slug);
```

The second method to call is the `addEpisodes` method to attach the episodes to the object returned by `getHummingbirdInfo` or `getTraktInfo`. This object is the first parameter, the second one is the episodes object and the third parameter is the slug again.

```javascript
addEpisodes(anime/show, episodes, slug);
```

The episodes are structured in a particular way. In the episodes object you first have the seasons represented by a number. Nested in each season is another object which is the episode which is also represented by a number. In the episode object you have the qualities available for the episode. These qualities can be `480p`, `720p` or `1080p`. Finally inside the quality object you have the `url` to the torrent or magnet link, the amount of `seeds` and `peers` and lastly the name of the provider.

```javascript
{
  "1": {
    "1": {
      "480p": {
        url: "magnet:?xt=urn:btih:LMJXHHNOW33Z3YGXJLCTJZ23WK2D6VO4&dn=10.OClock.Live.S01E01.WS.PDTV.XviD-PVR&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969",
        seeds: 0,
        peers: 0,
        provider: "EZTV"
      }
    }
  }
}
```

### Movie

The first method to call is `getTraktInfo`. This method need a slug as a parameter, but can also use an imdb id). This method will fetch metadata from [trakt.tv](https://trakt.tv) and return an object based on the schema of the mongoose model, but without any torrents.

```javascript
getTraktInfo(katMovie.slugYear);
```

The second method to call is the `addTorrents` method to attach the torrents to the object returned by `getTraktInfo`. This object is the first parmeter, the second one is the torrents for the movie.

```javascript
addTorrents(movie, torrents);
```

The torrents are structured in a particular way. In the torrents object you first have the language of the torrents represented by a language code e.g. `en`. Nested inside the language are the qualities of the torrents. These qualities can be `720p` or `1080p`. Finally inside the quality object you have the `url` to the torrent or magnet link, the amount of `seeds` and `peers`, the `size` of the torrent in bits, the `fileSize` which is a more easily readable version of `size` and lastly the name of provider.

```javascipt
{
  "en": {
    "720p": {
      url: "magnet:?xt=urn:btih:1BEA4C992D1F7A765F3C943E627E881AC7FDAA35&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337",
      seed: 156,
      peer: 44,
      size: 819829146,
      filesize: "781.85 MB",
      provider: "YTS"
    }
  }
}
```

## Metadata Providers

Metadata providers are providers which get data on a movie or get seasonal information from a show. Popcorn API uses two API services to get its metadata on anime, movies and shows.

### Trakt.tv

[Trakt.tv](https://trakt.tv/) is the metadata provider for movies and shows. It uses a module from [Jean van Kasteel](https://github.com/vankasteelj) called [trakt.tv](https://github.com/vankasteelj/trakt.tv). For more information about the Trakt API you can click [here](http://docs.trakt.apiary.io/).

### Hummingbird.me

[Hummingbird.me](https://hummingbird.me) is the metadata provider for anime. It uses the [hummingbird-api](https://github.com/ChrisAlderson/hummingbird-api) module. For more information about the Hummingbird API you can click [here](https://github.com/hummingbird-me/hummingbird/wiki).
