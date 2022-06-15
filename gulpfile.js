// import gulp from 'gulp';
// import plumber from 'gulp-plumber';
// import sourcemap from 'gulp-sourcemaps;'
// import sass from 'gulp-dart-sass';
// import postcss from 'gulp-postcss';
// import autoprefixer from 'autoprefixer';
// import sync from 'browser-sync';
// import csso from 'gulp-csso';
// import rename from 'gulp-rename';
const gulp = require ("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-dart-sass');
const postcss = require ("gulp-postcss");
const autoprefixer = require ("autoprefixer");
const sync = require("browser-sync").create();
const csso = require ("gulp-csso");
const rename = require ("gulp-rename");
const webp = require("gulp-webp");
const svgstore = require ("gulp-svgstore");
const del = require("del");
const htmlmin = require('gulp-htmlmin');


// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

//Html

gulp.task('htmlminify', () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true,
    removeComments: true }))
    .pipe(gulp.dest('build'));
});

// exports.htmlmin = htmlmin;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Webp

const webpimg = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
}

exports.webp = webpimg;

//Sprite

const sprite = () => {
  return gulp.src("source/img/**/social-*.svg")
    .pipe(svgstore())
    .pipe(rename("social-sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

//Copy

const copy = () => {
  return gulp.src ([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.svg",
    "source/js/**",
    "source/*.ico",
    "source/*.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Delete

const clean = () => {
  return del("build");
}

exports.clean = clean;

const build = () => gulp.series (
  clean,
  copy,
  styles,
  sprite,
  webpimg,
)

exports.build = build;

// export default gulp.series(
//   styles, server, watcher
// );
