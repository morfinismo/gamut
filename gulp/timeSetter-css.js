const {src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function timeSetterScss(){
    return src("src/timeSetter/timeSetter.scss")
    .pipe(sass({outputStyle: "expanded"})).on("error", sass.logError)
    .pipe(dest("src/timeSetter"));
}

function timeSetterCss(){
    return src("src/timeSetter/timeSetter.css")
    .pipe(postcss([autoprefixer]))
    .pipe(dest("src/timeSetter"));
}

exports.tsscss = function(){
    watch("src/timeSetter/timeSetter.scss", series(timeSetterScss, timeSetterCss));
};