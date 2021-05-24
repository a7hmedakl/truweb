"use strict";

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var rtlcss = require('gulp-rtlcss');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-csso');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var gulpcopy = require('gulp-copy');
var stripCssComments = require('gulp-strip-css-comments');
var babel = require('gulp-babel');
var reload = browserSync.reload;
var browserSyncInject = require('gulp-browsersync-inject');


gulp.task('message', function() {
    return console.log('Gulp is running...');
});

gulp.task('copyHtml', function() {
    // Copy html
    return gulp.src(['src/*.html'])
        .pipe(gulpcopy('dist', { prefix: 2 }))
        .pipe(browserSync.stream());
});

gulp.task('copyCss', function() {
    // Copy css
    return gulp.src([
            "./node_modules/bootstrap/dist/css/bootstrap.min.css",
            'src/css/helpers/fontawsome.css',
            "./node_modules/animate.css/animate.min.css",
            "./node_modules/slick-carousel/slick/slick.css",
            "./node_modules/aos/dist/aos.css"
        ])
        .pipe(concat('helpers.css'))
        .pipe(gulp.dest('dist/css', { prefix: 2 }))
        .pipe(browserSync.stream());
})

gulp.task('imageMin', function() {
    // Copy images
    return gulp.src(['src/images/*'])
        .pipe(
            imagemin({
                progressive: true
            })
        )
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('scss', function() {
    return gulp.src('src/scss/*.scss', { sourcemaps: true })
        .pipe(sourcemaps.init())

    .pipe(
            sass({
                // includePaths: require('node-bourbon').includePaths,
                outputStyle: 'expanded',
                errLogToConsole: true,
            }))
        // .on('error', gutil.log)
        // Stay live and reload on error
        .pipe(plumber({
            handleError: function(err) {
                console.log(err);
            }
        }))
        .pipe(prefix({
            cascade: true,
            grid: true,
            overrideBrowserslist: ['last 2 versions', 'ie 6-8', 'Firefox > 20']
        }))
        // .pipe(minifyCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/css'), { sourcemaps: 'src/css' })
        .pipe(browserSync.stream());
});


gulp.task('copyStyle', function() {
    // Copy css
    return gulp.src('src/css/*.css', { sourcemaps: true })
        // .pipe(concat('style.css'))
        .pipe(stripCssComments())
        .pipe(gulp.dest('dist/css', { prefix: 2 }))
        .pipe(rtlcss()) // Convert to RTL.
        .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename.
        .pipe(sourcemaps.write('.')) // Output source maps.
        .pipe(gulp.dest('dist/css')) // Output RTL stylesheets.
        .pipe(browserSync.stream());
});

gulp.task('minify', function() {
    return gulp.src([
            'src/js/vendors/modernizr.min.js',
            "./node_modules/jquery/dist/jquery.min.js",
            "./node_modules/jquery-migrate/dist/jquery-migrate.min.js",
            "./node_modules/popper.js/dist/umd/popper.min.js",
            "./node_modules/bootstrap/dist/js/bootstrap.min.js",
            "./node_modules/slick-carousel/slick/slick.js",
            "./node_modules/aos/dist/aos.js",
            "./node_modules/typed.js/lib/typed.min.js",
            'src/js/vendors/svg-inject.js'
        ])
        .pipe(concat('helpers.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('copyFonts', function() {
    // Copy fonts
    return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

// LocalHost
gulp.task('browserSync', gulp.series('scripts', 'minify', 'imageMin', 'copyCss', 'scss', 'copyStyle', 'copyFonts', 'copyHtml', function(done) {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: 'dist'
        },
    });
    done();
}));

gulp.task('injectBrowserSync', function() {
    return gulp.src('src/index.html')
        .pipe(browserSyncInject({ port: 3000 })) // BrowserSync will output the proxy port
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', gulp.series('browserSync', function() {
    gulp.watch("src/scss/**/*", gulp.series(['scss']));
    gulp.watch("src/js/**/*", gulp.series(['minify', 'scripts']));
    gulp.watch("src/images/**/*", gulp.series(['imageMin']));
    gulp.watch("src/css/**/*", gulp.series(['copyCss', 'copyStyle']));
    gulp.watch("src/fonts/**/*", gulp.series(['copyFonts']));
    gulp.watch("src/*.html", gulp.series(['copyHtml']));
}));

// define complex tasks
gulp.task(gulp.parallel('watch', 'browserSync'));
gulp.task('default', gulp.series('scripts', 'minify', 'imageMin', 'copyCss', 'scss', 'copyStyle', 'copyFonts', 'copyHtml', 'watch', 'browserSync', 'injectBrowserSync'));