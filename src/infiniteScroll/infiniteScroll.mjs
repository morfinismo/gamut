import { validateScrollingWidget, newElem } from '../helpers/helpers.mjs';

//list of existing infinite scrolls instances
const infiniteScrolls = [];

const infiniteScroll = (widget, config)=>{

    //validate if is a scroll widget
    const isScrollingWidget = validateScrollingWidget(widget);
    if(!isScrollingWidget){
        console.error("%cGAMUT Infinite Scroll Error: "+"%cEither a List Widget or a Grid Widget is required!","color:red","color:brown");
        return;
    }

    //get the required panel to observe for mutations
    const observePanel = document.querySelector(".rootPanel").children[1].children[0];

    //create the infinite scroll observer
    const infiniteScrollId = `${widget.root.name}${widget.name}`.toLowerCase();

    //check if there is an instance for this widget already
    const infinteScrollInstance = infiniteScrolls.filter((infScroll)=>{
        return infScroll.id === infiniteScrollId;
    })[0];

    //proceed to create instance if there is non yet    
    if(!infinteScrollInstance) {

        //create infiniteScroll object
        const $is = {
            id: infiniteScrollId,
            elem: widget.getElement(),
            datasource: widget.datasource,
            pageSize: 10,
            isLoading: false,
            autoload: true,
            showSpinner: true,
            forDarkTheme: false
        };
    
        //set $is configuration if needed
        if(config !== null && config !== undefined && typeof(config) === "object"){
            if(config.pageSize !== null && config.pageSize !== undefined && typeof(config.pageSize) === "number"){
                $is.pageSize = config.pageSize;
            }
            if(config.autoload !== null && config.autoload !== undefined && typeof(config.autoload) === "boolean"){
                $is.autoload = config.autoload;
            }
            if(config.showSpinner !== null && config.showSpinner !== undefined && typeof(config.showSpinner) === "boolean"){
                $is.showSpinner = config.showSpinner;
            }
            if(config.forDarkTheme !== null && config.forDarkTheme !== undefined && typeof(config.forDarkTheme) === "boolean"){
                $is.forDarkTheme = config.forDarkTheme;
            }
        }
    
        //return error if widget has no datasource
        if($is.datasource === null || $is.datasource === undefined){
            console.error("%cGAMUT Infinite Scroll Error: "+"%cThe widget lacks a datasource!","color:red","color:brown");
            return;
        }
    
        //load the first items of the datasource based on the pageSize if required
        if($is.autoload){
            $is.datasource.query.pageSize = $is.pageSize;
            $is.datasource.load();
        }
    
        //create the spinner panel to list
        const loaderPanel = newElem("div");
        loaderPanel.classList.add("gamut__infiniteScrolling--spinnerPanel");
        const spinner = `<div class="HJNVY5C-h-Cc app-Spinner${$is.forDarkTheme ? "--Dark" : ""} HJNVY5C-b-a gamut__infiniteScrolling--spinner" role="progressbar" style="width: 22px; height: 22px; box-sizing: border-box; position: relative;"><div class="HJNVY5C-h-Ac HJNVY5C-h-a"> <div class="HJNVY5C-h-Bc HJNVY5C-h-g"> <div class="HJNVY5C-h-j HJNVY5C-h-Pb"> <div class="HJNVY5C-h-i app-Spinner-FirstCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-ub"> <div class="HJNVY5C-h-i app-Spinner-FirstCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-j HJNVY5C-h-gc"> <div class="HJNVY5C-h-i app-Spinner-FirstCircle app-Spinner-AllCircles"></div> </div> </div> <div class="HJNVY5C-h-Bc HJNVY5C-h-fc"> <div class="HJNVY5C-h-j HJNVY5C-h-Pb"> <div class="HJNVY5C-h-i app-Spinner-SecondCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-ub"> <div class="HJNVY5C-h-i app-Spinner-SecondCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-j HJNVY5C-h-gc"> <div class="HJNVY5C-h-i app-Spinner-SecondCircle app-Spinner-AllCircles"></div> </div> </div> <div class="HJNVY5C-h-Bc HJNVY5C-h-Gc"> <div class="HJNVY5C-h-j HJNVY5C-h-Pb"> <div class="HJNVY5C-h-i app-Spinner-ThirdCircle"></div> </div><div class="HJNVY5C-h-ub"> <div class="HJNVY5C-h-i app-Spinner-ThirdCircle"></div> </div><div class="HJNVY5C-h-j HJNVY5C-h-gc"> <div class="HJNVY5C-h-i app-Spinner-ThirdCircle"></div> </div> </div> <div class="HJNVY5C-h-Bc HJNVY5C-h-Db"> <div class="HJNVY5C-h-j HJNVY5C-h-Pb"> <div class="HJNVY5C-h-i app-Spinner-FourthCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-ub"> <div class="HJNVY5C-h-i app-Spinner-FourthCircle app-Spinner-AllCircles"></div> </div><div class="HJNVY5C-h-j HJNVY5C-h-gc"> <div class="HJNVY5C-h-i app-Spinner-FourthCircle app-Spinner-AllCircles"></div> </div> </div> </div></div>`;
        loaderPanel.innerHTML = spinner;
    
        //scroll handelr
        $is.scrollHandler = (event)=>{
            if(!$is.isLoading){    
                $is.isLoading = true;        
                const currentScrollTop = $is.elem.scrollTop;
                if (currentScrollTop + $is.elem.clientHeight >= $is.elem.scrollHeight) {
                    if(!$is.datasource.lastPage){
                        if($is.showSpinner){
                            $is.elem.appendChild(loaderPanel);
                        }                      
                        $is.elem.scrollTop = currentScrollTop + 74;               
                        $is.datasource.query.pageSize += $is.pageSize;
                        $is.datasource.load(()=>{
                            if($is.showSpinner){
                                $is.elem.removeChild(loaderPanel);
                            }
                            $is.elem.scrollTop = currentScrollTop;
                            $is.isLoading = false;
                        });
                    } else {
                        $is.isLoading = false;
                    }
                } else {
                    $is.isLoading = false;
                }
            }
        }
    
        //create observer for when widget root changes       
        $is.observer = new MutationObserver((mutationList, observer)=>{
            for(let i=0; i<mutationList.length; i++){
                const mutation = mutationList[i];
                if(mutation.target.id !== `app-${widget.root.name}`){                    
                    $is.elem.removeEventListener("scroll", $is.scrollHandler);
                    observer.disconnect();
                    break;                
                }                
            }        
        });
        $is.observer.observe(observePanel, {attributes: true, attributeFilter: ["id"]});    
    
        //apply infinite scrolling
        $is.elem.addEventListener("scroll", $is.scrollHandler);
        infiniteScrolls.push($is);

    } else {
        //apply infinite scrolling
        infinteScrollInstance.elem.addEventListener("scroll", infinteScrollInstance.scrollHandler);
        infinteScrollInstance.observer.observe(observePanel, {attributes: true, attributeFilter: ["id"]});
    }

};

export default infiniteScroll;