const { parallel } = require("gulp");

const timeSetterCss = require("./gulp/timeSetter-css").tsscss
const formatTextBoxCss = require("./gulp/formatTextBox-css").ftbcss;
const formatSwitchCss = require("./gulp/formatSwitch-css").fscss;
const timePickerCss = require("./gulp/timePicker-css").tpscss;
const infiniteScrollCss = require("./gulp/infiniteScroll-css").isscss;
const mainGamutJs = require("./gulp/gamutjs-main").gamutjs;
const mainGamutCss = require("./gulp/gamutcss-main").gamutcss;
 

exports.build = parallel(
    timeSetterCss,
    formatTextBoxCss,
    timePickerCss,
    formatSwitchCss,
    infiniteScrollCss,
    mainGamutJs,
    mainGamutCss
);

