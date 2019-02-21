const fs = require('fs')
const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const ts = require('gulp-typescript');
const less = require('gulp-less');
const tsProject = ts.createProject('tsconfig.json');
const plugins = gulpLoadPlugins()
const env = process.env.NODE_ENV || 'development'
const isProduction = () => env === 'production'
const path = require('path')
// gulp.task('default', () => {
//     return gulp.src(['src/**/*.tsx'])
//       .pipe(plugins.sourcemaps.init())
//       .pipe(plugins.babel())
//       .pipe(plugins.if(isProduction, plugins.uglify(), plugins.sourcemaps.write('.')))
//       .pipe(gulp.dest('dist'))
// })

gulp.task('clean', cb => {
    rmDir('dist')
    cb()
})

gulp.task('compile:less', () => {
    return gulp.src('src/lime.less')
        .pipe(less())
        .pipe(gulp.dest('dist', { overwrite: true }))
})

gulp.task('compile:tsx', () => {
    return gulp.src(['src/**/*.tsx', 'src/index.js'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist', { overwrite: true }));
})

gulp.task('copy:package', cb => {
    copyFile('package.json', 'dist/package.json')
    cb()
})

gulp.task('default', ['clean', 'compile:less', 'compile:tsx', 'copy:package'])

// gulp.watch(['src/**/*.js', 'src/**/*.less', 'src/**/*.tsx', 'src/**/*.ts'], () => {
//     gulp.start('default')
// })

function copyFile(source, target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}

function rmDir(dirPath, removeSelf = false) {
    let files
    try {
        files = fs.readdirSync(dirPath)
    }
    catch (e) {
        console.exception(e)
        return;
    }

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let filePath = path.join(dirPath, files[i])
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
            else {
                rmDir(filePath, true)
            }
        }
    }

    if (removeSelf) {
        fs.rmdirSync(dirPath)
    }
}