const {src, dest, watch, series} = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const minify = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const browsersync = require('browser-sync').create()

// Sass Task
function compilescss(){
  return src('scss/main.scss', {sourcemaps: true})
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(minify())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('dist/css'), { sourcemaps: true})
} 

// compress images
function optimizeimg(){
  return src('images/*.{jpg,png}')
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 80, progresive: true}),
      imagemin.optipng({ optiminzationLevel: 2})
    ]))
    .pipe(dest('dist/images'))
} 

// move svg-images
function movesvgimg(){
  return src('images/*.svg')
    .pipe(dest('dist/images'))
} 

// browsersync
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDi: '.'
    }
  })
  cb()
}

function browsersyncReload(cb){
  browsersync.reload()
  cb()  
}

// watchtask
function watchTask(){
  watch('scss/**/*.scss', compilescss)
  watch('images/*.{jpg, png}', optimizeimg)
  watch('images/*.svg', movesvgimg)
  watch('*.html', browsersyncReload)
}

//
exports.default = series(
  compilescss,
  optimizeimg,
  movesvgimg,
  browsersyncServe,
  watchTask
)