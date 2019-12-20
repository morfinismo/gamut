import timeSetter from "./timeSetter/timeSetter.mjs";
import formatTextBox from "./formatTextBox/formatTextBox.mjs"

(window => {

    const $gmt = {

        /* -- TIME SETTER UTILITY -- */
        activeTimeSetter: null,
        timeSetter,
        formatTextBox,
        
    };

    window.gamut = $gmt;

})(window);