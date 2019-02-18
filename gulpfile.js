const fs = require('fs')
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

gulp.task('compile:less', () => {
    return gulp.src(['src/lime.less'])
      .pipe(less())
      .pipe(gulp.dest('dist'))
})

gulp.task('compile:tsx', function () {
    return gulp.src(['src/**/*.tsx','src/index.js','src/index.css'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
})  

gulp.task('copy:package', () => {
    copyFile('package.json','dist/package.json')
})

gulp.watch('src/**/*.*', gulp.task('default', ['compile:less','compile:tsx','copy:package']))


function copyFile(source,target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}