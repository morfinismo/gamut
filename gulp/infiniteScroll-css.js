const {src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function infiniteScrollScss(){
    return src("src/infiniteScroll/infiniteScroll.scss")
    .pipe(sass({outputStyle: "expanded"})).on("error", sass.logError)
    .pipe(dest("src/infiniteScroll"));
}

function infiniteScrollCss(){
    return src("src/infiniteScroll/infiniteScroll.css")
    .pipe(postcss([autoprefixer]))
    .pipe(dest("src/infiniteScroll"));
}

exports.isscss = function(){
    watch("src/infiniteScroll/infiniteScroll.scss", series(infiniteScrollScss, infiniteScrollCss));
};