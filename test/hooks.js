// Import the neccesary modules.
import hooks from 'hooks';

import Util from '../src/Util';

hooks.beforeAll((transaction, done) => {
  const animemovie = Util.importCollection('anime', './test/movie.json');
  const animeshow = Util.importCollection('anime', './test/show.json');
  const movie = Util.importCollection('movie', './test/movie.json');
  const show = Util.importCollection('show', './test/show.json');

  Promise.all([animemovie, animeshow, movie, show])
    .then(done).catch(done);
});

hooks.before('Logs > Error Logs > Get Error Logs', t => t.skip = true);

hooks.before('Export > Export > Export Collection', t => t.skip = true);
