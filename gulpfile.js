const gulp = require('gulp');
const babel = require("gulp-babel");
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");
const rename = require("gulp-rename");
const del = require("del");
const plumber = require("gulp-plumber");
const cssMinify = require("gulp-csso");
const jsMinify = require("gulp-uglify");
const imageMinify = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const pug = require('gulp-pug');

function copyTask() {
    return gulp.src(
        ["src/fonts/**/*.{woff,woff2}",
        "src/icons/**/*.{svg,png}"],
        {base: "src"}
        )
        .pipe(gulp.dest("build"))
}

function cleanTask() {
    return del("build")
}

function styleTask() {
    return gulp.src('src/**/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(postcss([
            autoPrefixer({overrideBrowserslist: ["last 2 versions"]})
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(cssMinify())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}

function jsTask() {
    return gulp.src("src/**/**/*.js")
        .pipe(concat('script.js'))
        .pipe(gulp.dest("build/js"))
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(jsMinify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest("build/js"))
}

function imageTask() {
    return gulp.src('src/img/**')
        .pipe(imageMinify([
            imageMinify.gifsicle({interlaced: true}),
            imageMinify.mozjpeg({quality: 75, progressive: true}),
            imageMinify.optipng({optimizationLevel: 3}),
            imageMinify.svgo()
        ]))
        .pipe(gulp.dest('build/img'))
}

function pugTask() {
    return gulp.src('src/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("build"))
        .pipe(browserSync.stream());
}

function serveTask() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
    gulp.watch('src/**/**/*.scss', styleTask);
    gulp.watch('src/**/**/*.js', jsTask).on('change', browserSync.reload);
    gulp.watch("src/**/**/*.pug", pugTask);
    gulp.watch('build/*.html', browserSync.reload)
}

exports.style = styleTask;
exports.pug = pugTask;
exports.copy = copyTask;
exports.clean = cleanTask;
exports.js = jsTask;
exports.image = imageTask;
exports.serve = serveTask;

exports.build = gulp.series(
    cleanTask,
    copyTask,
    gulp.parallel(pugTask, styleTask, jsTask, imageTask)
);