const { parallel } = require("gulp");

const timeSetterCss = require("./gulp/timeSetter-css").tsscss;
const mainGamutJs = require("./gulp/gamutjs-main").gamutjs;
const mainGamutCss = require("./gulp/gamutcss-main").gamutcss;
 

exports.build = parallel(timeSetterCss, mainGamutJs, mainGamutCss);

