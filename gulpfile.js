var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var requirejsOptimize = require('gulp-requirejs-optimize');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');
var del = require("del");
var gulpSequence = require('gulp-sequence');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');
var yargs = require('yargs').argv;
var destDir = "dist";

gulp.task('default', ['release']);

gulp.task('release', gulpSequence('clean', ['_release:html', '_copyFiles', '_release:css', '_release:js']));

gulp.task('develop', ['develop:css'], function () {
    gulp.watch("src/scss/**/**", ['develop:css']);
    gulp.src("./src/www/index.html")
        .pipe(inject(gulp.src(["./src/www/debug.js"], {read: true}), {relative: true}))
        .pipe(rename({basename: "index"}))
        .pipe(gulp.dest('./src/www'));
});


gulp.task('develop:css', function () {
    gulp.src('src/scss/base.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest('src/www/css'))
        .pipe(browserSync.stream());

});

gulp.task('_copyFiles', ['_copyImg', '_copyCss', '_copyJs'], function () {
});
gulp.task('clean', function (done) {
    del([destDir]).then(function () {
        done();
    });
});

gulp.task('_release:css', function () {
    return gulp.src("src/scss/base.scss")
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(destDir + '/css/'))
});

gulp.task('_release:js', function () {
    return gulp.src("src/www/js/main.js")
        .pipe(requirejsOptimize({
            mainConfigFile: 'require-config.js'
        })).pipe(gulp.dest(destDir + "/js/"));
});

gulp.task('_release:html', function () {
    return gulp.src("src/www/index.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(replace('<script src="debug.js"></script>', ''))
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest(destDir))
});
gulp.task('_copyImg', function () {
    return gulp.src(["src/www/images?([1])/**"])
        .pipe(gulp.dest(destDir));
});
gulp.task('_copyCss', function () {
    return gulp.src(["src/www/css/**"])
        .pipe(gulp.dest(destDir + "/css/"));
});

gulp.task('_copyJs', function () {
    return gulp.src(["src/www/js/lib/require/require.js"], {base: 'src/www/js'})
        .pipe(gulp.dest(destDir + "/js"));
});
/**
 *
 *以下为测试bebug
 * */
gulp.task('develop-build', gulpSequence('clean', ['_release:html2', '_copyFiles2', '_release:css', '_release:js']));
gulp.task('_copyFiles2', ['_copyImg', '_copyCss', '_copyJs2'], function () {
});
gulp.task('_release:html2', function () {
    return gulp.src("src/www/index.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(replace('<script src="js/debug.js"></script>', '<script src="debug.js"></script>'))
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest(destDir))
});
gulp.task('_copyJs2', function () {
    return gulp.src(["src/www/js/lib/require/require.js", "src/www/debug.js"], {base: 'src/www/js'})
        .pipe(gulp.dest(destDir + "/js"));
});
