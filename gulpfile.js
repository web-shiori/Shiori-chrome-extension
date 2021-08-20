const gulp = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const Fiber = require('fibers');
gulpSass.compiler = require('sass');
const del = require('del');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

// distの削除
function clean(cb) {
    del.sync('./dist');
    cb();
}

// ファイルコピー
function copy() {
    return gulp.src([
        './src/**/*.*', '!src/scss/**/*.scss', '!src/ts/**/*.ts', '!src/ts/lib/*'
    ], {
        base: './src'
    })
        .pipe(gulp.dest('./dist'));
}

function copyLibs() {
    return gulp.src([
        'src/ts/lib/*.js'
    ])
        .pipe(gulp.dest('./dist/js/lib'));
}

// sassのコンパイル
function sass() {
    return gulp.src('./src/scss/*.scss')
        .pipe(
            gulpSass({
                fiber: Fiber,
                outputStyle: 'compressed',
            })
        )
        .pipe(gulp.dest('./dist/scss'))
}

// TypeScriptのトランスパイル
function script() {
    return gulp.src('./src/ts/**/*.ts')
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist/js'));
}

const build = gulp.series (
    clean,
    gulp.parallel(
        copy,
        copyLibs,
        sass,
        script,
    ),
);

exports.clean = clean;
exports.copy = copy;
exports.copyLibs = copyLibs;
exports.sass = sass;
exports.script = script;
exports.build = build;
