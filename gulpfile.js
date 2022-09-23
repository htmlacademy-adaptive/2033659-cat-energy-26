import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import squoosh from 'gulp-libsquoosh';
import postcss from 'gulp-postcss';
import terser from 'gulp-terser';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import del from 'del';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(gulp.dest('build'));
}

// Scripts
const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
}

//Images
export const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('build/img'));
}

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

// WebP
const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

//Svg
const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg', '!source/img/sprite.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

// Srites
const sprite = () => {
  return gulp.src([
    'source/img/features-icons/*.svg',
    'source/img/footer-icons/*.svg',
    'source/img/form-icons/*.svg'
  ])
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('icons.sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

const copy = (done) => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/*.svg',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'));
}

//Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html').on('change', reload);
}

//Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
));
