const {src, dest, watch } = require("gulp");
const rollup = require('rollup');
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

const sources = [
    "./src/gamut-main.mjs",
    "./src/timeSetter/timeSetter.mjs",
    "./src/formatTextBox/formatTextBox.mjs"
];


function rollupJob(){
    return rollup.rollup({
            input: './src/gamut-main.mjs',
        }).then(bundle => {
            return bundle.write({
                file: './gamut.min.js',
                format: 'cjs',
                name: 'gamut',
                sourcemap: false
            }).then(()=>{
                return mainGamut();
            });        
    });
}

function mainGamut(){
    return src("./gamut.min.js")
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(uglify())
    .pipe(dest("./"));
}

exports.gamutjs = function(){
    watch(sources, rollupJob);
};
