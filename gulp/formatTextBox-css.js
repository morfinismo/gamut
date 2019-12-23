const {src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function formatTextBoxScss(){
    return src("src/formatTextBox/formatTextBox.scss")
    .pipe(sass({outputStyle: "expanded"})).on("error", sass.logError)
    .pipe(dest("src/formatTextBox"));
}

function formatTextBoxCss(){
    return src("src/formatTextBox/formatTextBox.css")
    .pipe(postcss([autoprefixer]))
    .pipe(dest("src/formatTextBox"));
}

exports.ftbcss = function(){
    watch("src/formatTextBox/formatTextBox.scss", series(formatTextBoxScss, formatTextBoxCss));
};