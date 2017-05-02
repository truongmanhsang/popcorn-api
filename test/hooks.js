// Import the neccesary modules.
import hooks from 'hooks';
import path from 'path';

import Logger from '../src/config/Logger';
import Util from '../src/Util';

hooks.beforeAll((t, done) => {
  global.tempDir = path.join(process.cwd(), 'tmp');
  Logger.getLogger('winston', undefined, true);

  const animemovie = Util.Instance.importCollection('anime', './test/movie.json');
  const animeshow = Util.Instance.importCollection('anime', './test/show.json');
  const movie = Util.Instance.importCollection('movie', './test/movie.json');
  const show = Util.Instance.importCollection('show', './test/show.json');

  return Promise.all([animemovie, animeshow, movie, show])
    .then(done)
    .catch(done);
});

hooks.before('Logs > Error Logs > Get Error Logs', t => t.skip = true);

hooks.before('Export > Export > Export Collection', t => t.skip = true);
