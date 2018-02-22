var gulp         = require('gulp');
var path         = require('path');
var del          = require('del');
var cp           = require('child_process');
var gulpSequence = require('gulp-sequence');
var browserSync  = require('browser-sync');
var watch        = require('gulp-watch');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefix   = require('gulp-autoprefixer');
var cssmin       = require('gulp-cssmin');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var image        = require('gulp-image');
var htmlmin      = require('gulp-htmlmin');


// starts with fresh asset files - this is a jekyll work around to not use its built in sass engine
gulp.task('clean-assets', function () {
  return del([
    './_site/_assets/**/*'
  ]);
});

// build the jekyll site
gulp.task('build-jekyll', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

// rebuild jekyll site and reload
gulp.task('rebuild-jekyll', ['build-jekyll'], function () {
  browserSync.reload();
});

// serve site with browserSync. also mirrors site to sub-directory
gulp.task('serve', ['build-jekyll'], function() {
  browserSync.init({
    server: {
      baseDir: '_site/',
      routes: {
        '/_templates/collection': '_site/'
      }
    }
  });
});


// ----------------------------------------------------------------------  watch

// watch for jekyll rebuild
gulp.task('watch-jekyll', function () {
  gulp.watch(['**/*.*', '!_site/**/*','!_assets/**/*','!node_modules/**/*','!.sass-cache/**/*' ], ['rebuild-jekyll']);
});

// watch for sass
gulp.task('watch-sass', ['build-sass'], function() {
  gulp.watch(['_assets/sass/**/*.scss'], ['build-sass']);
});

// watch for main js
gulp.task('watch-main-js', ['build-main-js'], function() {
  gulp.watch(['_assets/js/**/*.js'], ['build-main-js']);
});

// watch for js
gulp.task('watch-js', ['build-js'], function() {
  gulp.watch(['_assets/js/**/*.js'], ['build-js']);
});

// watch for images
gulp.task('watch-images', ['build-images'], function() {
  gulp.watch(['_assets/img/**/*.*'], ['build-images'])
    // updates the compiled folder if an image is deleted
    // modified snippet from https://gulpjs.org/recipes/handling-the-delete-event-on-watch
    .on('change', function (event) {
      if (event.type === 'deleted') {
        var filePathFromSrc = path.relative(path.resolve('_assets/img/**/*.*'), event.path);
        var destFilePath = path.resolve('_site/_assets/img/**/*.*', filePathFromSrc);
        del.sync(destFilePath);
      }
      browserSync.reload();
    })
});


// ----------------------------------------------------------------------  build

// sass build for dev
gulp.task('build-sass', function() {
  return gulp.src('./_assets/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./_site/_assets/css/'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

// build for main js file
gulp.task('build-main-js', function(cb) {
  return gulp.src([

  //  JS MAIN FILE BUILD
  // --------------------

    // plugins
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery-countdown/dist/jquery.countdown.min.js',
    // './node_modules/waypoints/lib/jquery.waypoints.min.js',

    // custom js - with on doc ready wrapper
    './_assets/js/_components/on-ready/start.js',

    // components
    './_assets/js/_components/standard.js',
    './_assets/js/_components/offer-countdown.js',
    './_assets/js/_components/modal.js',
    './_assets/js/_components/modal-nav.js',
    // './_assets/js/_components/sticky-nav.js',

    // custom js for project
    './_assets/js/main.js',

    './_assets/js/_components/on-ready/end.js'
    // end custom js

  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./_site/_assets/js/'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

// build for other js files - excludes main and files in sub folders
gulp.task('build-js', function(cb) {
  return gulp.src(['./_assets/js/*.js','!./_assets/js/main.js'])
  .pipe(gulp.dest('./_site/_assets/js/'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('build-images', function(cb) {
  return gulp.src('./_assets/img/**/*.*')
  .pipe(gulp.dest('./_site/_assets/img/'))
});


// -------------------------------------------------------------------  compress

// remove sass sourcemaps for live
gulp.task('clean-sourcemaps', function () {
  return del([
    './_site/_assets/css/**/*.css.map'
  ]);
});

// compress sass files for live
gulp.task('compress-sass', function () {
  return gulp.src('./_site/_assets/css/**/*.css')
  .pipe(autoprefix({
    browsers: ['last 3 versions', 'iOS 7'],
    cascade: false
  }))
  .pipe(cssmin())
  .pipe(gulp.dest('./_site/_assets/css'))
})

// compress js files for live
gulp.task('compress-js', function () {
  return gulp.src('./_site/_assets/js/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./_site/_assets/js'))
})

// compress images files for live
gulp.task('compress-images', function () {
  return gulp.src('./_site/_assets/img/**/*')
  .pipe(image())
  .pipe(gulp.dest('./_site/_assets/img'));
})

// compress html files for live
gulp.task('compress-html', function () {
  return gulp.src('./_site/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest('./_site'));
})


///////////////////////////////////////////////////////////////////  build tasks

// builds jekyll site & watches for changes
gulp.task('default', gulpSequence(
  'clean-assets',
  [
    'serve',
    'watch-jekyll',
    'watch-sass',
    'watch-main-js',
    'watch-js',
    'watch-images'
  ])
);

// builds jekyll site for deploying to live
gulp.task('build', gulpSequence(
  'clean-assets',
  [
    'build-jekyll',
    'build-sass',
    'build-main-js',
    'build-js',
    'build-images'
  ],
  [
    'clean-sourcemaps',
    'compress-sass',
    'compress-js',
    'compress-images',
    'compress-html'
  ])
);