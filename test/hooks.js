import hooks from 'hooks';

import Anime from '../src/models/Anime';
import Movie from '../src/models/Movie';
import Show from '../src/models/Show';

import animeData from './anime.json';
import novieData from './movie.json';
import showData from './show.json';

hooks.beforeAll(async(transaction, done) => {
  try {
    const anime = await new Anime(animeData).save();
    const movie = await new Movie(movieData).save();
    const show = await new Anime(showData).save();

    done();
  } catch (err) {
    hoosk.error(err);
  }
});

// copyTestFiles() {
//   const animePath = path.join(process.cwd(), "test/anime.json");
//   const moviePath = path.join(process.cwd(), "test/movie.json");
//   const showPath = path.join(process.cwd(), "test/show.json");
//
//   const animeNewPath = path.join(tempDir, "animes.json");
//   const movieNewPath = path.join(tempDir, "movies.json");
//   const showNewPath = path.join(tempDir, "shows.json");
//
//   const animeExists = fs.existsSync(animePath);
//   const movieExists = fs.existsSync(moviePath);
//   const showExists = fs.existsSync(showPath);
//
//   if (animeExists && movieExists && showExists) {
//     fse.copySync(animePath, animeNewPath);
//     fse.copySync(moviePath, movieNewPath);
//     fse.copySync(showPath, showNewPath);
//
//     fs.writeFileSync(path.join(tempDir, `${name}.log`), JSON.stringify({
//       "name":"popcorn-api",
//       "pid": 2809,
//       "level": "error",
//       "msg": "Trakt: Could not find any data on: /shows/tt1517514?extended=full with slug: 'tt1517514'",
//       "time": "2016-11-19T16:53:54.968Z"
//     }));
//   } else {
//     throw new Error('A test file could not be found!');
//   }
// }
