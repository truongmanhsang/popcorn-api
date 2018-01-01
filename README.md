# popcorn-api

[![Build Status](https://travis-ci.org/popcorn-official/popcorn-api.svg?branch=development)](https://travis-ci.org/popcorn-official/popcorn-api)
[![Windows Build](https://img.shields.io/appveyor/ci/chrisalderson/popcorn-api/3.0.0.svg?label=windows)](https://ci.appveyor.com/project/ChrisAlderson/popcorn-api)
[![Coverage Status](https://coveralls.io/repos/github/popcorn-official/popcorn-api/badge.svg?branch=3.0.0)](https://coveralls.io/github/popcorn-official/popcorn-api?branch=3.0.0)
[![Dependency Status](https://david-dm.org/popcorn-official/popcorn-api.svg)](https://david-dm.org/popcorn-official/popcorn-api)
[![devDependency Status](https://david-dm.org/popcorn-official/popcorn-api/dev-status.svg)](https://david-dm.org/popcorn-official/popcorn-api?type=dev)
[![document](https://popcorn-official.github.io/popcorn-api/badge.svg)](https://popcorn-official.github.io/popcorn-api/source.html)

Popcorn API is developed to make it easier for anyone to create their own
version of [Popcorn Time](http://popcorntime.sh). It contains:

- Metadata about movies (taken from Trakt).
- Metadata about TV shows and individual episodes (taken from Trakt).
- Multiple quality magnet links for every episode.
- Ability to easily filter content to the user's content.
- Add content manually through the CLI.

## Installation

To setup your local machine to start working on the project you can follow
these steps:

1. Install [MongoDB](https://www.mongodb.com/) including `mongoexport` and `mongoimport`
2. Install [NodeJS](https://nodejs.org/) (at least Node v7.10.1 or greater)
3. Clone the repository with: `git clone https://github.com/popcorn-official/popcorn-api.git`
4. Install dependencies `npm i`
5. Install the flow-typed libraries with `npm run flow-typed`

## Documentation

 - [General documentation](https://popcorn-official.github.io/popcorn-api/manual/index.html)
 - [Route Api docs](http://docs.popcornofficial.apiary.io/).
 - [Api docs](https://popcorn-official.github.io/popcorn-api/identifiers.html)
 - TODO: Add more documentation links.

## License

MIT License
