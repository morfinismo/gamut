const {src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function formatSwitchScss(){
    return src("src/formatSwitch/formatSwitch.scss")
    .pipe(sass({outputStyle: "expanded"})).on("error", sass.logError)
    .pipe(dest("src/formatSwitch"));
}

function formatSwitchCss(){
    return src("src/formatSwitch/formatSwitch.css")
    .pipe(postcss([autoprefixer]))
    .pipe(dest("src/formatSwitch"));
}

exports.fscss = function(){
    watch("src/formatSwitch/formatSwitch.scss", series(formatSwitchScss, formatSwitchCss));
};