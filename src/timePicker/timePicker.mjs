import { validateDateBox, newElem } from '../helpers/helpers.mjs';

const timePicker = (dateBox, config)=>{

    //log error if there is no valid dateBox
    if(!dateBox){
        console.error("%cGAMUT Time Picker Error: "+"%cEither an input element or a Date Box Widget is required!","color:red","color:brown");
        return;
    }

    //default configuration
    const defaultConfig = {
        initialValue: "8:00",
        zIndex: 9,
        onClose: v => v
    };
        
    //main timePicker object
    const $tp = {
        options: defaultConfig,
        input: dateBox,
        isAppMaker: false
    };  

    //check if it's an App Maker widget and if it is, extract the input element and override the $tp.input value
    if (dateBox.__gwt_instance !== undefined && dateBox.__gwt_instance !== null && validateDateBox(dateBox)) {
        $tp.input = dateBox.getElement().children[1];
        $tp.isAppMaker = true;
        $tp.dateTime = dateBox.value || new Date();
    }

    //force the input to be text type
    $tp.input.setAttribute("type", "text");

    //if it is an AppMaker DateBox widget, perform necessary modifications
    if ($tp.isAppMaker) {
        //modify label position
        dateBox.getElement().children[0].classList.add("gamut--label-fix");

        //modify calendar button
        dateBox.getElement().children[2].style.right = "20px"; 

        //create observer for date popup box when calendar is clicked        
        const observer = new MutationObserver((mutationList, observer)=>{
            for(let i=0; i<mutationList.length; i++){
                const mutation = mutationList[i];
                const dateBoxes = [...mutation.removedNodes].filter((node)=>{
                    return node.classList.contains("app-DateBox-Popup");
                });
                if(dateBoxes.length > 0){                    
                    const dateBoxVal = dateBox.value.getTime();
                    const currentTime = $tp.dateTime.getTime();
                    if(currentTime !== dateBoxVal){
                        dateBox.value = new Date(dateBox.value.setHours($tp.dateTime.getHours(), $tp.dateTime.getMinutes(), 0, 0));
                        setTimeout(()=>{
                            $tp.timeButton.click();
                        },50);                        
                    } 
                    break;                
                }                
            }
            observer.disconnect();
        });
        $tp.dateBoxObserver = observer;
        dateBox.getElement().children[2].addEventListener("click", ()=>{
            const appDiv = document.querySelector("#app");
            $tp.dateBoxObserver.observe(appDiv, {subtree: false, childList: true});
        });

        //insert timeButton
        const timeButton = newElem("button");
        timeButton.setAttribute("type", "button");
        timeButton.setAttribute("aria-label", "Open Clock");
        timeButton.classList.add("gamut__timePickerBtn");
        dateBox.getElement().appendChild(timeButton);
        $tp.timeButton = timeButton;
    }

    //set options values from config
    if (config !== undefined && config !== null && typeof (config) === "object") {
        if (config.initialValue !== undefined && config.initialValue !== null) {
            if (new RegExp(/\d{1,2}:\d{1,2}/).test(config.initialValue)) {
                $tp.options.initialValue = config.initialValue;
            }
        }
        if (config.zIndex !== undefined && config.zIndex !== null) {
            const newZindex = parseInt(config.zIndex);
            if (typeof newZindex === "number") {
                $tp.options.zIndex = newZindex;
            }
        }
        if (config.onClose !== undefined && config.onClose !== null) {
            if (typeof config.onClose === "function") {
                $tp.options.onClose = config.onClose;
            }
        }
    }

    //establish the hour, minute and meridiam values
    let hourValue = parseInt($tp.options.initialValue.split(":")[0]);
    $tp.hourValue =  (hourValue > 23 || hourValue === 0) ? 12 : hourValue > 12 ? hourValue - 12 : hourValue;
    $tp.minuteValue = parseInt($tp.options.initialValue.split(":")[1]);
    $tp.meridiamValue = hourValue > 23 ? "AM" : hourValue > 11 ? "PM" : "AM";

    //set value to the $tp.input
    $tp.setValue = (isClosing = false) => {
        let hours = $tp.hourValue;
        let minutes = $tp.minuteValue;
        let meridiam = $tp.meridiamValue;
        let newValue;
        if($tp.isAppMaker){
            if(meridiam === "PM" && hours < 12){ hours += 12; }
            newValue = new Date($tp.dateTime.setHours(hours, minutes, 0, 0));
            $tp.dateTime = newValue;
            dateBox.value = newValue;
        } else {
            hours = $tp.hourValue < 10 ? "0" + $tp.hourValue : $tp.hourValue;
            minutes = $tp.minuteValue < 10 ? "0" + $tp.minuteValue : $tp.minuteValue;
            newValue = `${hours}:${minutes} ${meridiam}`;
            $tp.input.value = newValue;
        }
        if (isClosing) {
            $tp.options.onClose(newValue);
        }
    };
    $tp.setValue(); //sets the default value upon initialization

    //create the timePicker widget
    const widget = newElem("div");

    //open the timePicker widget
    $tp.open = (top, left, height, width) => {

        //rotate handler
        const rotateHand = (event)=>{
            const elem = event.target;
            elem.style.cursor = "grabbing";
            document.body.style.cursor = "grabbing";
            let rotating = true;
            let rotateDegrees;
            const clockHand = elem.dataset.clockHand;
            const multiple =  clockHand === "minute" ? 6 : 30;
            const clock = document.querySelector(".gamut__timePicker__clock");
            const rect = clock.getBoundingClientRect(); // get clock size and position
            const radius = rect.width / 2; // calculate radius based on size
            const rotateHandler = (e)=>{
                const radians = Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius));
                rotateDegrees = Math.round((radians * (180 / Math.PI) * -1) + 180);
                rotateDegrees = Math.ceil(rotateDegrees / multiple) * multiple;
                if (rotating) {
                    elem.style.transform = `rotate(${rotateDegrees}deg)`;          
                    let newTimeParamValue = rotateDegrees / multiple;
                    if(clockHand === "minute"){
                        newTimeParamValue = newTimeParamValue == 60 ? 0 : newTimeParamValue; 
                    } else if(clockHand === "hour"){
                        newTimeParamValue = newTimeParamValue == 0 ? 12 : newTimeParamValue; 
                    }                                       
                    $tp[`${elem.dataset.clockHand}Value`] = Number(newTimeParamValue); 
                    newTimeParamValue = ( newTimeParamValue < 10) ? "0"+(newTimeParamValue) : newTimeParamValue;
                    document.querySelector(`input[data-time-param="${elem.dataset.clockHand}"]`).value = newTimeParamValue;
                }
            };
            document.addEventListener("mousemove", rotateHandler);
            const cancelRotateHandler = (event)=>{
                elem.style.cursor = "grab";
                document.body.style.cursor = "default";
                rotating = !rotating;
                document.removeEventListener("mousemove", rotateHandler);
                document.removeEventListener("mouseup", cancelRotateHandler);
                
            };
            document.addEventListener("mouseup", cancelRotateHandler);
        };

        //set initial value for the analog clock minute hand
        const getMinHandInitialRotate = (minValue)=>{
            const degrees = 360/60;
            const initalValue = minValue * degrees;
            return initalValue;
        };

        //set initial rotate for the analog clock hour hand
        const getHourHandInitialRotate = (hourValue)=>{
            const degrees = 360/12;
            const initialValue = hourValue * degrees;
            return initialValue;
        };

        //set initial value for the digital clock value
        const getTimeParamValue = (timeParam)=>{
            if(timeParam === "hour"){
                return $tp.hourValue < 10 ? "0"+$tp.hourValue : $tp.hourValue;
            } else if(timeParam === "minute"){
                return $tp.minuteValue < 10 ? "0"+$tp.minuteValue : $tp.minuteValue;
            }
        };

        //toggle selected meridiam handler
        const toggleMeridiam = (e)=>{
            const newValue = e.target.dataset.meridiamValue;
            const meridiams = document.querySelectorAll(".gamut__timePicker__meridiamSelector--meridiam");
            meridiams.forEach(meridiam=>{
                meridiam.classList.toggle("gamut__timePicker__meridiamSelector--selected");
            });
            $tp.meridiamValue = newValue;
        };

        //style the widget             
        widget.innerHTML = "";
        //widget.style.width = width + "px";
        if($tp.isAppMaker){
            widget.style.position = "absolute";
            widget.style.top = height + "px";
            widget.style.left = "0px";
        } else {
            widget.style.top = top + height + 2 + "px";
            widget.style.left = left + "px";
        }       
        widget.style.zIndex = $tp.options.zIndex;
        widget.classList.add("gamut__timePicker");

        //create the meridiam selector
        const meridiamSelector = newElem("div");
        meridiamSelector.classList.add("gamut__timePicker__meridiamSelector");
        const amSelector = newElem("div");
        amSelector.setAttribute("data-meridiam-value", "AM");
        amSelector.addEventListener("click", toggleMeridiam);     
        amSelector.innerHTML = "AM";
        amSelector.classList.add("gamut__timePicker__meridiamSelector--meridiam");
        meridiamSelector.appendChild(amSelector);
        const pmSelector = newElem("div");
        pmSelector.setAttribute("data-meridiam-value", "PM");
        pmSelector.addEventListener("click", toggleMeridiam);
        pmSelector.innerHTML = "PM";
        pmSelector.classList.add("gamut__timePicker__meridiamSelector--meridiam");
        meridiamSelector.appendChild(pmSelector);
        if($tp.meridiamValue === "AM"){
            amSelector.classList.toggle("gamut__timePicker__meridiamSelector--selected");
        } else if($tp.meridiamValue === "PM"){
            pmSelector.classList.toggle("gamut__timePicker__meridiamSelector--selected");
        }
        widget.appendChild(meridiamSelector);

        //create the analog clock
        const clockWrapper = newElem("div");
        clockWrapper.classList.add("gamut__timePicker__clockWrapper");
        const clock = newElem("div");
        clock.classList.add("gamut__timePicker__clock"); 
        const minutePointers = 60;
        const minRotateDegree = 360 / minutePointers;
        const clockSize = 202;
        let rotateValue = 90;
        for( let i=0; i<minutePointers; i++){  	
          let pointer = newElem("div");
          let angle = i * (Math.PI / (minutePointers/2));
          let left = (clockSize / 2) + ((clockSize / 2) * Math.cos(angle));
          let leftPercent = (left * 100) / clockSize;
          let top = (clockSize / 2) + ((clockSize / 2) * Math.sin(angle));
          let topPercent = (top * 100) / clockSize;    
          if(i % 5 === 0){ 
            pointer.classList.add("gamut__timePicker__clock--hrPointer"); 
          } else {
            pointer.classList.add("gamut__timePicker__clock--minPointer");
          }
          pointer.style.transform = `rotate(${rotateValue}deg)`;
          pointer.style.left = `${leftPercent}%`;
          pointer.style.top = `${topPercent}%`;
          clock.appendChild(pointer);
          rotateValue += minRotateDegree;    
        }

        //create the analog clock hour labels
        clockWrapper.appendChild(clock); 
        const clockLabels = newElem("div");        
        clockLabels.classList.add("gamut__timePicker__labels"); 
        const totalLabels = 12;
        const circleSize = 160;
        let hourValue = 3;
        for( let i=0; i<totalLabels; i++){  	
          const label = newElem("span");
          label.innerHTML = hourValue;
          let angle = i * (Math.PI / (totalLabels/2));
          let left = (circleSize / 2) + ((circleSize / 2) * Math.cos(angle));
          let leftPercent = (left * 100) / circleSize;
          let top = (circleSize / 2) + ((circleSize / 2) * Math.sin(angle));
          let topPercent = (top * 100) / circleSize;    
          label.classList.add("gamut__timePicker__labels--hourLabel");    
          label.style.left = `${leftPercent}%`;
          label.style.top = `${topPercent}%`;
          clockLabels.appendChild(label);
          hourValue++;
          if(hourValue > 12){ hourValue = 1; }
        }
        clockWrapper.appendChild(clockLabels);

        //create the clock minute hand
        const minHand = newElem("div");
        minHand.classList.add("gamut__timePicker__minHand");
        minHand.style.transform = `rotate(${getMinHandInitialRotate($tp.minuteValue)}deg)`;
        minHand.addEventListener("mousedown", rotateHand);
        minHand.setAttribute("ondragstart", "event.preventDefault(); event.stopPropagation();");
        minHand.setAttribute("data-clock-hand", "minute");
        clockWrapper.appendChild(minHand);

        //create the clock hour hand
        const hrHand = newElem("div");        
        hrHand.classList.add("gamut__timePicker__hrHand");
        hrHand.style.transform = `rotate(${getHourHandInitialRotate($tp.hourValue)}deg)`;
        hrHand.addEventListener("mousedown", rotateHand);
        hrHand.setAttribute("ondragstart", "event.preventDefault(); event.stopPropagation();");
        hrHand.setAttribute("data-clock-hand", "hour");
        clockWrapper.appendChild(hrHand);

        //append clockWrapper to widget
        widget.appendChild(clockWrapper);

        //create the widget time display
        const timeDisplay = newElem("div");
        timeDisplay.classList.add("gamut__timePicker__time");
        ["hourInput","separator","minuteInput"].forEach((elemName)=>{
            if(elemName === "separator"){
                let separator = newElem("span");
                separator.classList.add("gamut__timePicker__time--separator");
                separator.innerHTML = ":";
                timeDisplay.appendChild(separator);
            } else {
                let inputElem = newElem("input");
                inputElem.setAttribute("type", "text");
                if(elemName === "hourInput"){
                    inputElem.setAttribute("data-time-param", "hour");
                    inputElem.value = getTimeParamValue("hour");
                } else if(elemName === "minuteInput"){
                    inputElem.setAttribute("data-time-param", "minute");
                    inputElem.value = getTimeParamValue("minute");
                }
                inputElem.addEventListener("change", (event)=>{
                    const elem = event.target;
                    const timeParam = elem.dataset.timeParam;
                    let newParamValue = elem.value;
                    if(newParamValue !== null && newParamValue !== undefined && typeof(Number(newParamValue)) === "number"){
                        if(timeParam === "hour"){
                            if(newParamValue < 1){ newParamValue = 12; }
                            if(newParamValue > 12){ newParamValue = 1; }
                        } else if(timeParam === "minute"){
                            if(newParamValue < 0){ newParamValue = 59; }
                            if(newParamValue > 59){ newParamValue = 0; }
                        }
                        $tp[`${timeParam}Value`] = Number(newParamValue);
                        let rotateDegrees = timeParam === "hour" ? (newParamValue * 30) : (newParamValue * 6);
                        document.querySelector(`div[data-clock-hand="${timeParam}"]`).style.transform = `rotate(${rotateDegrees}deg)`;
                        if(newParamValue < 10){ 
                            newParamValue = "0" + newParamValue;                            
                        }
                        elem.value = newParamValue;
                    } else {
                        newParamValue = $tp[`${timeParam}Value`];
                        if(newParamValue < 10){ 
                            newParamValue = "0" + newParamValue;                             
                        }
                        elem.value = newParamValue;
                    }
                });
                timeDisplay.appendChild(inputElem);
            }
        });
        widget.appendChild(timeDisplay);   

        //create the done button
        const doneButton = newElem("div");
        doneButton.classList.add("gamut__timePicker__done");
        const doneButtonText = document.createTextNode("DONE");
        doneButton.appendChild(doneButtonText);
        doneButton.addEventListener("click", $tp.close);
        widget.appendChild(doneButton);

        //insert widget to DOM
        $tp.input.parentNode.appendChild(widget);
        window.addEventListener("click", $tp.close); //attach close to the window click
    };

    //close the widget
    $tp.close = (e) => {
        /* If the widget is being rendered in App Maker, then we need to check that the element matches
            the parent element of the input, which is the dateBox widget inside appmaker. If it is not 
            rendered in App Maker, we just need to check it matches the input element.
        */ 
        const proceedToClose = $tp.isAppMaker ? (e.target !== $tp.input.parentElement) : (e.target !== $tp.input);
        if (proceedToClose) {
            $tp.setValue(true);
            $tp.input.parentNode.removeChild(widget);
            window.removeEventListener("click", $tp.close); //remove close from the window click
            gamut.activeTimePicker = null;
        }
    };

    //prevent widget close
    $tp.preventClose = (e) => {
        e.stopPropagation();
        return false;
    };

    //attach prevent close to widget and in case is App Maker, input parent also
    widget.addEventListener("click", $tp.preventClose);
    if ($tp.isAppMaker) {
        $tp.input.parentElement.addEventListener("click", $tp.preventClose);
    }

    //add focus event to $tp.input
    $tp.focus = (e) => {

        //close any open instance if any
        const isOpened = gamut.activeTimePicker ? true : false;
        if (isOpened) {
            gamut.activeTimePicker.close(e);
        }

        //reconfigure date if appmaker DateBox widget
        if($tp.isAppMaker){
            $tp.dateTime = dateBox.value || new Date();
            $tp.dateTime.setHours($tp.hourValue, $tp.minuteValue, 0, 0);
        }        

        //open a new instance
        const rect = $tp.isAppMaker ? e.target.parentElement.getBoundingClientRect() : $tp.input.getBoundingClientRect();
        $tp.open(rect.top, rect.left, rect.height, rect.width);

        //save opened instance as active instance
        gamut.activeTimePicker = $tp;
        $tp.input.blur();
    };

    if($tp.isAppMaker){
        $tp.timeButton.addEventListener("click", $tp.focus);
    } else {
        //add the open widget method upon focus
        $tp.input.addEventListener("focus", $tp.focus);
        $tp.input.blur();
    }

    return $tp;
};

export default timePicker;