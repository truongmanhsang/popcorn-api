# Example

## Index

**GET - `http://localhost:5000/`**

Gives some basic information about the server on which the API is running on.

**Example output:**

```javascript
{
  "repo": "https://github.com/popcorn-official/popcorn-api.git",
  "server": "serv01",
  "status": "Idle",
  "totalMovies": ​6700,
  "totalShows": ​2452,
  "updated": ​1462484100,
  "uptime": ​825385,
  "version": "2.0.0"
}
```

## Anime

**GET - `http://localhost:5000/animes/{page}`**

Gives an array of anime shows. The array has a has a maximum length of 50 anime shows per page.

**Example output:**
```javascript
[
  {
    "_id": "5646",
    "mal_id": "9253",
    "title": "Steins;Gate",
    "year": "2011",
    "slug": "steins-gate",
    "type": "show",
    "genres": [
      "Comedy",
      "Sci-Fi",
      "Mystery",
      "Thriller",
      "Drama"
    ],
    "images": {
      "banner": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953",
      "fanart": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953",
      "poster": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953"
    },
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 0,
      "watching": 0,
      "percentage": 92
    }
  },
  ...
]
```

**GET - `http://localhost:5000/anime/{_id}`**

Gives information about a single anime show based on the given id.

**Example output:**

```javascript
{
  "_id": "5646",
  "mal_id": "9253",
  "title": "Steins;Gate",
  "year": "2011",
  "slug": "steins-gate",
  "synopsis": "Steins;Gate is set in the summer of 2010, approximately one year after the events that took place in Chaos;Head, in Akihabara.\n\nSteins;Gate is about a group of friends who have customized their microwave into a device that can send emails to the past (known as D-mails). As they perform different experiments, an organization named SERN, who has been doing their own research on time travel, tracks them down and now the characters have to find a way to avoid being captured by them.\n\n(Sources: VNDB, Wikipedia)",
  "runtime": "24",
  "status": "Finished Airing",
  "type": "show",
  "num_episodes": 12,
  "last_updated": 1469804168091,
  "__v": 0,
  "episodes": [
    {
      "title": "Episode 13",
      "torrents": {
        "0": {
          "url": "magnet:?xt=urn:btih:IEQGMZOUZJQ5FJJZNURKTTND3KUHBAHT&tr=http://open.nyaatorrents.info:6544/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80/announce",
          "seeds": 0,
          "peers": 0,
          "provider": "HorribleSubs"
        },
        "480p": {
          "url": "magnet:?xt=urn:btih:IEQGMZOUZJQ5FJJZNURKTTND3KUHBAHT&tr=http://open.nyaatorrents.info:6544/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80/announce",
          "seeds": 0,
          "peers": 0,
          "provider": "HorribleSubs"
        },
        "720p": {
          "url": "magnet:?xt=urn:btih:MCZBSUZP4YX2O4SBMBBXLFWBIQCEPOZF&tr=http://open.nyaatorrents.info:6544/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80/announce",
          "seeds": 0,
          "peers": 0,
          "provider": "HorribleSubs"
        }
      },
      "season": "1",
      "episode": "13",
      "overview": "We still don't have single episode overviews for anime… Sorry",
      "tvdb_id": "5646-1-13"
    },
    ...
  ],
  "genres": [
    "Comedy",
    "Sci-Fi",
    "Mystery",
    "Thriller",
    "Drama"
  ],
  "images": {
    "banner": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953",
    "fanart": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953",
    "poster": "https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953"
  },
  "rating": {
    "hated": 100,
    "loved": 100,
    "votes": 0,
    "watching": 0,
    "percentage": 92
  }
}
```

**GET - `http://localhost:5000/random/anime`**

Gives a random show from the database. The output will be similar to the on directly above.

## Movie

**GET - `http://localhost:5000/logs/error`**

Display the error log. Each message will be in JSON format.

**GET - `http://localhost:5000/movies/{page}`**

Gives an array of movies. The array has a has a maximum length of 50 movies per page.

**Example output:**

```javascript
[
  {
    "_id": "tt2015381",
    "imdb_id": "tt2015381",
    "title": "Guardians of the Galaxy",
    "year": "2014",
    "synopsis": "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.",
    "runtime": "121",
    "released": 1406851200,
    "trailer": "http://youtube.com/watch?v=2LIQ2-PZBC8",
    "certification": "PG-13",
    "torrents": {
      "en": {
        "1080p": {
          "provider": "Z0n321",
          "fileSize": "8.74 GB",
          "size": 9384503541,
          "peer": 114,
          "seed": 91,
          "magnet": "magnet:?xt=urn:btih:8A8CBF1DF12D459AF26B01DC3C584A3631E0C2B5&dn=guardians+of+the+galaxy+2014+1080p+bluray+x264+sparks&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
          "url": "magnet:?xt=urn:btih:8A8CBF1DF12D459AF26B01DC3C584A3631E0C2B5&dn=guardians+of+the+galaxy+2014+1080p+bluray+x264+sparks&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
        }
      }
    },
    "genres": [
      "adventure",
      "fantasy",
      "science-fiction"
    ],
    "images": {
      "banner": "https://walter.trakt.us/images/movies/000/082/405/banners/original/592c80e5b3.jpg",
      "fanart": "https://walter.trakt.us/images/movies/000/082/405/fanarts/original/d2e37f8511.jpg",
      "poster": "https://walter.trakt.us/images/movies/000/082/405/posters/original/a189960d53.jpg"
    },
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 21025,
      "watching": 1,
      "percentage": 83
    }
  },
  ...
]
```

**GET - `http://localhost:5000/movie/{imdb_id}`**

Gives information about a single movie based on the given imdb id.

**Example output:**

```javascript
[
  {
    "_id": "tt2015381",
    "imdb_id": "tt2015381",
    "title": "Guardians of the Galaxy",
    "year": "2014",
    "synopsis": "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.",
    "runtime": "121",
    "released": 1406851200,
    "trailer": "http://youtube.com/watch?v=2LIQ2-PZBC8",
    "certification": "PG-13",
    "torrents": {
      "en": {
        "1080p": {
          "provider": "Z0n321",
          "fileSize": "8.74 GB",
          "size": 9384503541,
          "peer": 114,
          "seed": 91,
          "magnet": "magnet:?xt=urn:btih:8A8CBF1DF12D459AF26B01DC3C584A3631E0C2B5&dn=guardians+of+the+galaxy+2014+1080p+bluray+x264+sparks&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
          "url": "magnet:?xt=urn:btih:8A8CBF1DF12D459AF26B01DC3C584A3631E0C2B5&dn=guardians+of+the+galaxy+2014+1080p+bluray+x264+sparks&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
        }
      }
    },
    "genres": [
      "adventure",
      "fantasy",
      "science-fiction"
    ],
    "images": {
      "banner": "https://walter.trakt.us/images/movies/000/082/405/banners/original/592c80e5b3.jpg",
      "fanart": "https://walter.trakt.us/images/movies/000/082/405/fanarts/original/d2e37f8511.jpg",
      "poster": "https://walter.trakt.us/images/movies/000/082/405/posters/original/a189960d53.jpg"
    },
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 21025,
      "watching": 1,
      "percentage": 83
    }
  },
  ...
]
```

**GET - `http://localhost:5000/random/movie`**

Gives a random movie from the database. The output will be similar to the on directly above.

## Show

**GET - `http://localhost:5000/shows/{page}`**

Gives an array of shows. The array has a has a maximum length of 50 shows per page.

**Example output:**

```javascript
[
  {
    "_id": "tt0944947",
    "imdb_id": "tt0944947",
    "tvdb_id": "121361",
    "title": "Game of Thrones",
    "year": "2011",
    "slug": "game-of-thrones",
    "num_seasons": 5,
    "images": {
      "poster": "https://walter.trakt.us/images/shows/000/001/390/posters/original/93df9cd612.jpg",
      "fanart": "https://walter.trakt.us/images/shows/000/001/390/fanarts/original/76d5df8aed.jpg",
      "banner": "https://walter.trakt.us/images/shows/000/001/390/banners/original/9fefff703d.jpg"
    },
    "rating": {
      "percentage": 94,
      "watching": 626,
      "votes": 47012,
      "loved": 100,
      "hated": 100
    }
  },
  {
    "_id": "tt0903747",
    "imdb_id": "tt0903747",
    "tvdb_id": "81189",
    "title": "Breaking Bad",
    "year": "2008",
    "slug": "breaking-bad",
    "num_seasons": 5,
    "images": {
      "banner": "https://walter.trakt.us/images/shows/000/001/388/banners/original/c53872a7e2.jpg",
      "fanart": "https://walter.trakt.us/images/shows/000/001/388/fanarts/original/fdbc0cb02d.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/001/388/posters/original/fa39b59954.jpg"
    },
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 39660,
      "watching": 35,
      "percentage": 94
    }
  },
  ...
]
```

**GET - `http://localhost:5000/show/{imdb_id}`**

Gives information about a single show based on the given imdb id.

**Example output:**

```javascript
{
  "_id": "tt0944947",
  "imdb_id": "tt0944947",
  "tvdb_id": "121361",
  "title": "Game of Thrones",
  "year": "2011",
  "slug": "game-of-thrones",
  "synopsis": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and the icy horrors beyond.",
  "runtime": "60",
  "country": "us",
  "network": "HBO",
  "air_day": "Sunday",
  "air_time": "21:00",
  "status": "returning series",
  "num_seasons": 5,
  "last_updated": 1464725906217,
  "__v": 0,
  "episodes": [
    {
      "torrents": {
        "0": {
          "provider": "VTV",
          "peers": 303,
          "seeds": 290,
          "url": "magnet:?xt=urn:btih:D7D4BA47D984061F942D0D2F030AA927C943387E&dn=game+of+thrones+6x05+720p+hdtv+x264+avs+vtv&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
        },
        "720p": {
          "provider": "VTV",
          "peers": 303,
          "seeds": 290,
          "url": "magnet:?xt=urn:btih:D7D4BA47D984061F942D0D2F030AA927C943387E&dn=game+of+thrones+6x05+720p+hdtv+x264+avs+vtv&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
        }
      },
      "watched": {
        "watched": false
      },
      "first_aired": 1463965200,
      "date_based": false,
      "overview": "Tyrion seeks a strange ally. Bran learns a great deal. Brienne goes on a mission. Arya is given a chance to prove herself.",
      "title": "The Door",
      "episode": 5,
      "season": 6,
      "tvdb_id": 5600132
    },
    ...
  ],
  "genres": [
    "drama",
    "fantasy",
    "science-fiction",
    "action",
    "adventure"
  ],
  "images": {
    "poster": "https://walter.trakt.us/images/shows/000/001/390/posters/original/93df9cd612.jpg",
    "fanart": "https://walter.trakt.us/images/shows/000/001/390/fanarts/original/76d5df8aed.jpg",
    "banner": "https://walter.trakt.us/images/shows/000/001/390/banners/original/9fefff703d.jpg"
  },
  "rating": {
    "percentage": 94,
    "watching": 626,
    "votes": 47012,
    "loved": 100,
    "hated": 100
  }
}
```

**GET - `http://localhost:5000/random/show`**

Gives a random show from the database. The output will be similar to the on directly above.

# Query strings

The following routes support query strings:

- **GET - `http://localhost:5000/movies/{page}`**
- **GET - `http://localhost:5000/shows/{page}`**

## Sorting

`sort=`

Possible options for movies are:

- `last added`: sort by the release date of the movies.
- `rating`: sort by the highest rated movies.
- `title`: sort by the title of the movies.
- `trending`: sort by trending movies.
- `year`: sort by the release year of the movies.

Possible options for shows are:

- `name`: sort by the title of the shows.
- `rating`: sort by the highest rated shows.
- `trending`: sort by trending shows.
- `updated` sort by the most recently aired shows.
- `year`: sort by the release year of the movies.

## Ordering

`order=`

To order ascending: `1`

To order descending: `-1`

## Genres

`genre=`

##### TV shows & movies

The API supports the following genres for **TV shows** and **movies**:
 - action
 - adventure
 - animation
 - comedy
 - crime
 - disaster
 - documentary
 - drama
 - eastern
 - family
 - fan-film
 - fantasy
 - film-noir
 - history
 - holiday
 - horror
 - indie
 - music
 - mystery
 - none
 - road
 - romance
 - science-fiction
 - short
 - sports
 - sporting-event
 - suspense
 - thriller
 - tv-movie
 - war
 - western

##### Anime

The API supports the following genres for **anime**:
 - Action
 - Ecchi
 - Harem
 - Romance
 - School
 - Supernatural
 - Drama
 - Comedy
 - Mystery
 - Police
 - Sports
 - Mecha
 - Sci-Fi
 - Slice of Life
 - Fantasy
 - Adventure
 - Gore
 - Music
 - Psychological
 - Shoujo Ai
 - Yuri
 - Magic
 - Horror
 - Thriller
 - Gender Bender
 - Parody
 - Historical
 - Racing
 - Demons
 - Samurai
 - Super Power
 - Military
 - Dementia
 - Mahou Shounen
 - Game
 - Martial Arts
 - Vampire
 - Kids
 - Mahou Shoujo
 - Space
 - Shounen Ai

## Keywords

`keywords=`

Search based on keywords.
