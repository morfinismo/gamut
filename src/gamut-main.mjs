import timeSetter from "./timeSetter/timeSetter.mjs";
import formatTextBox from "./formatTextBox/formatTextBox.mjs";
import formatSwitch from "./formatSwitch/formatSwitch.mjs";

(window=>{

    const $gmt = {
        
        /* Initiate Library */
        init(app, config){

            /* Library Properties */
            this.observers = {}; //this property helps to keep track of certain element that are being observed for changes on some utilities

            /* Add general utilities */
            this.activeTimeSetter = null; //helper to keep track of the current open instance of timeSetter
            this.timeSetter = timeSetter;            

            /* Init Config */
            if(!app || !app.appKey){
                console.warn(`%cGAMUT Init Warning: %c"app" parameter is required for Google App Maker. Some features may not work!`, `color: red`, `color:brown`);
            } else {    

                /* Add Google App Maker specfic utilities */
                this.formatTextBox = formatTextBox;
                this.formatSwitch = formatSwitch;
                
                /* formatSwitches init config */
                const pages = app.pages._values;
                const popups = app.popups._values;
                const pageFragments = app.pageFragments._values;
                const rootWidgets = [...pages, ...popups, ...pageFragments];
                let gamutSwitches = [];
                rootWidgets.forEach(rootWidget=>{
                    const root = rootWidget.root.getElement();
                    gamutSwitches = [...gamutSwitches, ...root.querySelectorAll("span")].filter(item=>item.classList.toString().indexOf("gamutSwitch--") > -1);  
                });       
                gamutSwitches.forEach(gamutSwitch=>{
                    gamutSwitch.classList.add("gamutSwitch");
                });
                if(config !== undefined && config !== null && typeof config === "object"){
                    if(config.defaultSwitch !== undefined && config.defaultSwitch !== null){
                        const defaultSwitch = config.defaultSwitch;
                        formatSwitch(null, config.defaultSwitch, true, rootWidgets);
                    }
                }
            }
        }
    };

    window.gamut = $gmt;

})(window);