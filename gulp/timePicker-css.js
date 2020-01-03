const {src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function timePickerScss(){
    return src("src/timePicker/timePicker.scss")
    .pipe(sass({outputStyle: "expanded"})).on("error", sass.logError)
    .pipe(dest("src/timePicker"));
}

function timePickerCss(){
    return src("src/timePicker/timePicker.css")
    .pipe(postcss([autoprefixer]))
    .pipe(dest("src/timePicker"));
}

exports.tpscss = function(){
    watch("src/timePicker/timePicker.scss", series(timePickerScss, timePickerCss));
};