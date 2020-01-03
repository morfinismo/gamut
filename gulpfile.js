const { parallel } = require("gulp");

const timeSetterCss = require("./gulp/timeSetter-css").tsscss
const formatTextBoxCss = require("./gulp/formatTextBox-css").ftbcss;
const formatSwitch = require("./gulp/formatSwitch-css").fscss;
const timePickerCss = require("./gulp/timePicker-css").tpscss;
const mainGamutJs = require("./gulp/gamutjs-main").gamutjs;
const mainGamutCss = require("./gulp/gamutcss-main").gamutcss;
 

exports.build = parallel(
    timeSetterCss,
    formatTextBoxCss,
    timePickerCss,
    formatSwitch,
    mainGamutJs,
    mainGamutCss
);

