// Packages for Gulp
var gulp       = require('gulp');
var postcss    = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require('gulp-plumber');
var cache      = require('gulp-cache');

// Packages for CSS
var lost         = require('lost');
var nano         = require('cssnano');
var cssimport    = require('postcss-partial-import');
var variables    = require('postcss-custom-properties');
var calc         = require('postcss-calc');
var media        = require('postcss-custom-media');
var selectors    = require('postcss-custom-selectors');
var minmax       = require('postcss-media-minmax');
var colors       = require('postcss-color-function');

// Packages for JS
var webpack       = require('webpack-stream');
var webpackconfig = require('./webpack.config.js');

// Packages for Images
var imagemin = require('gulp-imagemin');

// Packages for Server
var browsersync  = require('browser-sync');
var reload       = browsersync.reload;
var connect_port = 8888;
var ngrok        = require('ngrok');

// Prevent gulp from stop running on css syntax error
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Environment Variables
var src        = 'source/';
var dest       = 'public/';

var src_css    = src + 'styles';
var src_js     = src + 'scripts';
var src_fonts  = src + 'fonts';
var src_images = src + 'images';

var dest_css    = dest + 'styles';
var dest_js     = dest + 'scripts';
var dest_fonts  = dest + 'fonts';
var dest_images = dest + 'images';

var wtc_css    = src_css + '/**/*.css';
var wtc_js     = src_js + '/**/*.js';
var wtc_docs   = dest + '**/*.html';
var wtc_fonts  = src_fonts + '/*.+(eot|svg|ttf|woff)';
var wtc_images = src_images + '/*.+(jpg|jpeg|png)';

var processors = [
  cssimport,
  variables,
  calc,
  media,
  selectors,
  minmax,
  lost,
  colors,
  nano({
    autoprefixer: { browsers: [
      'Android >= 2.3',
      'BlackBerry >= 7',
      'Chrome >= 9',
      'Firefox >= 4',
      'Explorer >= 9',
      'iOS >= 5',
      'Opera >= 11',
      'Safari >= 5',
      'OperaMobile >= 11',
      'OperaMini >= 6',
      'ChromeAndroid >= 9',
      'FirefoxAndroid >= 4',
      'ExplorerMobile >= 9'
    ]}
  })
];

gulp.task('styles', function(){
  return gulp.src(src_css + '/style.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .on('error', handleError)
    .pipe(sourcemaps.write('map'))
    .pipe(gulp.dest(dest_css))
});

gulp.task('webpack', function(){
  return gulp.src(wtc_js)
    .pipe(plumber())
    .pipe(webpack(webpackconfig))
    .pipe(gulp.dest(dest_js))
});

gulp.task('fonts', function(){
  return gulp.src(wtc_fonts)
    .pipe(gulp.dest(dest_fonts))
});

gulp.task('images', function(){
  return gulp.src(wtc_images)
    .pipe(cache(imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(dest_images))
});

gulp.task('browsersync', function(){
  browsersync.init({
    server: {
      baseDir: './public'
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    port: connect_port,
    notify: false,
    reloadOnRestart: false,
    logFileChanges: false,
    logConnections: false
    })
});

gulp.task('domain', function(){
  ngrok.connect({
    proto: 'http',
    addr: connect_port,
    authtoken: ''
  }, function (err, url) {});
})

gulp.task('watch', ['browsersync'], function(){
  gulp.watch(wtc_css, ['styles', reload]);
  gulp.watch(wtc_js, ['webpack', reload]);
  gulp.watch(wtc_fonts, ['fonts', reload]);
  gulp.watch(wtc_images, ['images', reload]);
  gulp.watch(wtc_docs, reload);
});

gulp.task('default', ['watch']);
gulp.task('production', ['styles', 'fonts', 'images']);