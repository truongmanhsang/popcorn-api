#! /bin/bash

# npm i -g gulp
# npm run lint
# gulp build



# popcorn-api -i test/anime.json
# popcorn-api -i test/movie.json
# popcorn-api -i test/show.json

NODE_ENV=test node build/popcorn-api.js -i test/anime.json
NODE_ENV=test node build/popcorn-api.js -i test/movie.json
NODE_ENV=test node build/popcorn-api.js -i test/show.json

NODE_ENV=test dredd

# npm i -g gulp dredd
# npm run lint
# gulp build
# NODE_ENV=test popcorn-api -i test/anime.json
# NODE_ENV=test popcorn-api -i test/movie.json
# NODE_ENV=test popcorn-api -i test/show.json
# dredd
