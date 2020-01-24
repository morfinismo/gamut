const {src, dest, watch, series } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');

const sources = [
    "src/gamut-main.css",
    "src/timeSetter/timeSetter.css",
    "src/formatTextBox/formatTextBox.css",
    "src/formatSwitch/formatSwitch.css",
    "src/timePicker/timePicker.css",
    "src/infiniteScroll/infiniteScroll.css"
];

function bundleCss(){
    return src(sources)
    .pipe(concat("gamut.min.css", {newLine: "\r\n"}))
    .pipe(dest("./"));    
}

function compressCss(){
    return src("gamut.min.css")
    .pipe(sass({outputStyle: "compressed"})).on("error", sass.logError)
    .pipe(dest("./"));
}

exports.gamutcss = function(){
    watch(sources, series(bundleCss, compressCss));
};