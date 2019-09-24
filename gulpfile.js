const fs = require('fs')
const gulp = require('gulp')
const ts = require('gulp-typescript');
const less = require('gulp-less');
const tsProject = ts.createProject('tsconfig.json');
const path = require('path')

if (!fs.existsSync('dist')) { fs.mkdirSync('dist'); }

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
    return gulp.src(['src/**/*.tsx', 'src/**/*.ts', 'src/index.js'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist', { overwrite: true }));
})

gulp.task('copy:package', cb => {
    copyFile('package.json', 'dist/package.json')
    copyFile('readme.md', 'dist/readme.md')
    cb()
})

gulp.task('default', ['clean', 'compile:less', 'compile:tsx', 'copy:package'])

function copyFile(source, target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}

function rmDir(dirPath, removeSelf = false) {
    let files
    try {
        files = fs.readdirSync(dirPath)
    }
    catch (e) {
        console.error(e)
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