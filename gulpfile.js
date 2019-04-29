var gulp         = require('gulp');
var path         = require('path');
var del          = require('del');
var cp           = require('child_process');
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


/////////////////////////////////////////////////////////////////////  utilities

// starts with fresh asset files - this is a jekyll work around to not use its built in sass engine
function cleanAssets() {
  return del(["./_site/_assets/**/*"]);
}

// start browserSync local server and show under site subdirectory
function browserSyncServe() {
  browserSync.init({
    server: {
      baseDir: '_site/',
      routes: {
        '/template': '_site/'
      }
    }
  });
}

// Reload BrowserSync for when site changes are made
function browserSyncReload(done) {
  browserSync.reload();
  done();
}



///////////////////////////////////////////////////////////////////......  build

// build the jekyll site
function buildJekyll(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
}

// build for sass
function buildSass() {
  return gulp.src('./_assets/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./_site/_assets/css/'))
  .pipe(browserSync.reload({
    stream: true
  }));
}

// build for image files
function buildImages() {
  return gulp.src('./_assets/img/**/*.*')
  .pipe(gulp.dest('./_site/_assets/img/'));
}

// build for main js file
function buildJsMain(cb) {
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
  }));
}

// build for other js files - excludes main and files in sub folders
function buildJs(cb) {
  return gulp.src(['./_assets/js/*.js','!./_assets/js/main.js'])
  .pipe(gulp.dest('./_site/_assets/js/'))
  .pipe(browserSync.reload({
    stream: true
  }));
}



/////////////////////////////////////////////////////////////////////////  watch

// Watch files
function watchFiles() {
  gulp.watch('./_assets/sass/**/*.scss', buildSass);
  gulp.watch('./_assets/js/**/*.js', gulp.parallel(buildJsMain, buildJs));
  gulp.watch( // watch for jekyll
    [
      '**/*.*',
      '!_site/**/*',
      '!_assets/**/*',
      '!node_modules/**/*',
      '!.sass-cache/**/*'
    ],
    gulp.series(rebuild)
  );
  // watch for images
  gulp.watch('_assets/img/**/*.*', buildImages)
    // updates the compiled folder if an image is deleted
    // modified snippet from https://gulpjs.org/recipes/handling-the-delete-event-on-watch
    .on('change', function (event) {
      if (event.type === 'deleted') {
        var filePathFromSrc = path.relative(path.resolve('_assets/img/**/*.*'), event.path);
        var destFilePath = path.resolve('_site/_assets/img/**/*.*', filePathFromSrc);
        del.sync(destFilePath);
      }
      browserSync.reload();
    });
}



//////////////////////////////////////////////////////////////////////  compress

// remove sass sourcemaps for live
function cleanSass() {
  return del(['./_site/_assets/css/**/*.css.map']);
}

// compress sass files for live
function compressSass() {
  return gulp.src('./_site/_assets/css/**/*.css')
  .pipe(autoprefix({
      browsers: ['last 3 versions', 'iOS 7'],
      cascade: false
    }))
  .pipe(cssmin())
  .pipe(gulp.dest('./_site/_assets/css'));
}

// compress js files for live
function compressJs() {
  return gulp.src('./_site/_assets/js/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./_site/_assets/js'));
}

// compress images files for live
function compressImages() {
  return gulp.src('./_site/_assets/img/**/*')
  .pipe(image())
  .pipe(gulp.dest('./_site/_assets/img'));
}

// compress html files for live
function compressHtml() {
  return gulp.src('./_site/**/*.html')
  .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
  .pipe(gulp.dest('./_site'));
}



///////////////////////////////////////////////////////////////////  build tasks

// define complex tasks
var rebuild = gulp.series(buildJekyll, browserSyncReload);
var serve = gulp.series(browserSyncServe);
var watch = gulp.series(watchFiles);
var build = gulp.series(
  cleanAssets,
  gulp.parallel(
    buildJekyll,
    buildSass,
    buildImages,
    buildJsMain,
    buildJs
  )
);
var compress = gulp.parallel(
  cleanSass,
  compressSass,
  compressJs,
  compressImages,
  compressHtml
);

// build and watch site for development
exports.default = gulp.series(
  build,
  gulp.parallel(
    serve,
    watch
  )
);

// compress & complie the site for uploading to live server
exports.compile = gulp.series(
  build,
  compress
);