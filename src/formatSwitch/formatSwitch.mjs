import { validateCheckBox, validatPageWidget, newElem } from '../helpers/helpers.mjs';

const formatSwitch = (appmakerWidget, config, global = false, rootWidgets)=>{

    //supported options for config object
    const options = {
        checked: !config ? null : config.checked,
        checkedBtn: !config ? null : config.checkedBtn,
        unchecked: !config ? null : config.unchecked,
        uncheckedBtn: !config ? null : config.uncheckedBtn
    };

    const applyPreset = (root, preset, isGlobal = true)=>{
        let appSwitches = [...root.querySelectorAll("span")].filter(item=>item.classList.toString().indexOf("app-Checkbox--Switch") > -1);
        appSwitches.forEach(appSwitch => {
            let classList = [...appSwitch.classList];
            if(!classList.includes(preset)){
                if(isGlobal){
                    if(classList.toString().indexOf("gamutSwitch--") === -1 && classList.toString().indexOf("gmt-") === -1){
                        appSwitch.classList.add(preset);
                        appSwitch.classList.add("gamutGlobal");
                    }
                } else {
                    if(classList.includes("gamutGlobal") || classList.toString().indexOf("gamutSwitch--") === -1){
                        let existingGamutClass = "none";
                        for(let i=0; i<classList.length; i++){
                            if(classList[i].indexOf("gamutSwitch--") > -1){
                                existingGamutClass = classList[i];
                                break;
                            }
                        }
                        if(classList.toString().indexOf("gmt-") === -1){
                            appSwitch.classList.remove(existingGamutClass);
                            appSwitch.classList.remove("gamutGlobal");
                            appSwitch.classList.add(preset);
                            appSwitch.classList.add("gamutSwitch");
                        }
                    }                    
                }
            }
        });
    };

    //apply global style
    if(global){

        if(typeof config === "string"){            
            //set preset colors
            const preset = config;
            rootWidgets.forEach(page => {
                let root = page.root.getElement();
                let observer = new MutationObserver(()=>{
                    applyPreset(root, preset);
                });
                observer.observe(root, {subtree: true, childList: true});
                applyPreset(root, preset);
                let observerName = `${page.name}-switch-observer`;
                window.gamut.observers[observerName] = observer;
            });
              
        } else {
            //set config colors
            if(options.unchecked){
                document.documentElement.style.setProperty("--unchecked", options.unchecked);
            }
            if(options.uncheckedBtn){
                document.documentElement.style.setProperty("--uncheckedButton", options.uncheckedBtn);
            }
            if(options.checked){
                document.documentElement.style.setProperty("--checked", options.checked);
            }
            if(options.checkedBtn){
                document.documentElement.style.setProperty("--checkedButton", options.checkedBtn);
            }   
        }
            
    } else { 

        //validate is it is an appamker page
        const isPage = validatPageWidget(appmakerWidget);
        
        //apply style to all switches in the appmaker page
        if (isPage) {

            //get current observer in case global is also being applied
            const observerName = `${appmakerWidget.name}-switch-observer`;
            const currentObserver = window.gamut.observers[observerName];

            //disconnect global observer if any
            if(currentObserver){
                currentObserver.disconnect();
            }

            //apply page level styles depending on the congif type(string or object)
            let page = appmakerWidget;
            if(typeof config === "string"){            
                //set preset colors
                const preset = config;
                let root = page.root.getElement();
                let observer = new MutationObserver(()=>{
                    applyPreset(root, preset, false);
                });
                observer.observe(root, {subtree: true, childList: true});
                applyPreset(root, preset, false);
                window.gamut.observers[observerName] = observer;                  
            } else {
                //set config colors
                if(options.unchecked){
                    document.documentElement.style.setProperty("--unchecked", options.unchecked);
                }
                if(options.uncheckedBtn){
                    document.documentElement.style.setProperty("--uncheckedButton", options.uncheckedBtn);
                }
                if(options.checked){
                    document.documentElement.style.setProperty("--checked", options.checked);
                }
                if(options.checkedBtn){
                    document.documentElement.style.setProperty("--checkedButton", options.checkedBtn);
                }   
            }

        } else {

            //validate if it is a Checkbox widget
            const isCheckBox = validateCheckBox(appmakerWidget);

            //apply style to checkbox switch if it is a checkbox
            if(isCheckBox){

                //get html element from widget
                const elem = appmakerWidget.getElement();

                //remove any gamut style
                const classList = [...elem.classList];
                classList.forEach(className=>{
                    if(className.includes("gamutSwitch")){
                        elem.classList.remove(className);
                    }
                });

                //check if it has already been styled
                const isStyled = classList.toString().indexOf("gmt-") > -1;
                
                //apply style if it hasnt been applied before
                if(!isStyled){
                    //generate a unique class name
                    const className = `gmt-${Math.random().toString().slice(2)}`;
                    elem.classList.add(className);

                    //get the colors from config
                    const unchecked = options.unchecked || rgba(0,0,0,0.5);
                    const uncheckedBtn = options.uncheckedBtn || rgb(255,255,255);
                    const checked = options.checked || rgb(66,133,244);
                    const checkedBtn = options.checkedBtn || rgb(66,133,244);

                    //construct style elem
                    const styleElem = newElem("style");
                    const styleData = `
                    .${className} > .app-Checkbox-Input {
                        background-color: ${unchecked};
                    }
                    
                    .${className} > .app-Checkbox-Label:after {
                        background-color: ${uncheckedBtn};
                    }
                    
                    .${className} > .app-Checkbox-Input:checked {
                        background-color: ${checked};
                    }
                    
                    .${className} > .app-Checkbox-Input:checked + .app-Checkbox-Label:after {
                        background-color: ${checkedBtn};
                    }                  
                    `;

                    //append style data to style elem
                    styleElem.innerHTML = styleData;

                    //append style elem to document body
                    document.body.appendChild(styleElem);
                }
            }

        }


    }

}

export default formatSwitch;