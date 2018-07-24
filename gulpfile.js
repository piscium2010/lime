const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const ts = require('gulp-typescript');
const less = require('gulp-less');
const tsProject = ts.createProject('tsconfig.json');

const plugins = gulpLoadPlugins()
const env = process.env.NODE_ENV || 'development'
const isProduction = () => env === 'production'

// gulp.task('default', () => {
//     return gulp.src(['src/**/*.tsx'])
//       .pipe(plugins.sourcemaps.init())
//       .pipe(plugins.babel())
//       .pipe(plugins.if(isProduction, plugins.uglify(), plugins.sourcemaps.write('.')))
//       .pipe(gulp.dest('dist'))
// })

gulp.task('compile:tsx', function () {
    return gulp.src(['src/**/*.tsx'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('compile:less', () => {
    return gulp.src(['src/**/*.less'])
      .pipe(less())
      .pipe(gulp.dest('dist'))
})

gulp.task('default', ['compile:tsx','compile:less'])
