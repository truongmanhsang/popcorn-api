// Import the necessary modules.
import babel from 'gulp-babel'
import del from 'del'
import dotenv from 'dotenv'
import gulp from 'gulp'
import { join } from 'path'

// initialize the dotenv module.
dotenv.config()

// Set the TEMP_DIR environment variable if it is not set in the .env file.
process.env.TEMP_DIR = process.env.TEMP_DIR
  ? process.env.TEMP_DIR
  : join(process.cwd(), 'tmp')

/**
 * The default build function.
 * @returns {undefined}
 */
function build() {
  gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('build'))
  gulp.src('src/**/*.json').pipe(gulp.dest('build'))
}

// Delete the `build` directory.
gulp.task('clean', () => del([
  '.nyc_output',
  'build',
  'coverage',
  process.env.TEMP_DIR
]))

// Transpile the `src` directory with Babel.
gulp.task('build', ['clean'], build)

// Set the default task as `build`.
gulp.task('default', ['clean'], build)
