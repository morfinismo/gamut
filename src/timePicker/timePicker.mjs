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
        valueChange: v => v
    }
        
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
    }

    //force the input to be text type
    $tp.input.setAttribute("type", "text");

    //modify label position if App Maker widget
    if ($tp.isAppMaker) {
        dateBox.getElement().children[0].classList.add("gamut--label-fix");
    }

    //set options values from config
    if (config !== undefined && config !== null && typeof (config) === "object") {
        if (config.initialValue !== undefined && config.initialValue !== null) {
            if (new RegExp(/\d{1,2}:\d{1,2}:\d{1,2}/).test(config.initialValue)) {
                $tp.options.initialValue = config.initialValue;
            }
        }
        if (config.zIndex !== undefined && config.zIndex !== null) {
            const newZindex = parseInt(config.zIndex);
            if (typeof newZindex === "number") {
                $tp.options.zIndex = newZindex;
            }
        }
        if (config.valueChange !== undefined && config.valueChange !== null) {
            if (typeof config.valueChange === "function") {
                $tp.options.valueChange = config.valueChange;
            }
        }
    }

    //establish the hour, minute and meridiam values
    let hourValue = parseInt($tp.options.initialValue.split(":")[0]);
    $tp.hourValue =  (hourValue > 23 || hourValue === 0) ? 12 : hourValue > 12 ? hourValue - 12 : hourValue;
    $tp.minuteValue = parseInt($tp.options.initialValue.split(":")[1]);
    $tp.meridiamValue = hourValue > 23 ? "am" : hourValue > 11 ? "pm" : "am";

    //set value to the $tp.input
    $tp.setValue = (hasChanged = false) => {
        let hours = $tp.hourValue;
        let minutes = $tp.minuteValue;
        let meridiam = $tp.meridiamValue;
        hours = $tp.hourValue < 10 ? "0" + $tp.hourValue : $tp.hourValue;
        minutes = $tp.minuteValue < 10 ? "0" + $tp.minuteValue : $tp.minuteValue;
        const newValue = `${hours}:${minutes} ${meridiam}`;
        $tp.input.value = newValue;
        if (hasChanged) {
            $tp.options.valueChange(newValue);
        }
    }
    $tp.setValue(); //setp the default value upon initialization

    //create the timePicker widget
    const widget = newElem("div");

    //open the timePicker widget
    $tp.open = (top, left, height, width) => {

        //rotate handler
        const rotateHand = (event)=>{
            const elem = event.target;
            elem.style.cursor = "grabbing";
            console.dir(elem);
            let rotating = true;
            const clock = document.querySelector(".gamut__timePicker__clock");
            const rect = clock.getBoundingClientRect(); // get clock size and position
            const radius = rect.width / 2; // calculate radius based on size
            const rotateHandler = (e)=>{
                const radians = Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius));
                let rotateDegrees = (radians * (180 / Math.PI) * -1) -180;
                if (rotating) {
                    elem.style.transform = `rotate(${rotateDegrees}deg)`;
                }
            };
            document.addEventListener("mousemove", rotateHandler);
            const cancelRotateHandler = (event)=>{
                elem.style.cursor = "grab";
                rotating = !rotating;
                console.log('rotate: ' + rotating);
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
        widget.style.top = top + height + 2 + "px"
        widget.style.left = left + "px";
        widget.style.zIndex = $tp.options.zIndex;
        widget.classList.add("gamut__timePicker");

        //create the meridiam selector
        const meridiamSelector = newElem("div");
        meridiamSelector.classList.add("gamut__timePicker__meridiamSelector");
        const amSelector = newElem("div");
        amSelector.setAttribute("data-meridiam-value", "am");
        amSelector.addEventListener("click", toggleMeridiam);     
        amSelector.innerHTML = "AM";
        amSelector.classList.add("gamut__timePicker__meridiamSelector--meridiam");
        meridiamSelector.appendChild(amSelector);
        const pmSelector = newElem("div");
        pmSelector.setAttribute("data-meridiam-value", "pm");
        pmSelector.addEventListener("click", toggleMeridiam);
        pmSelector.innerHTML = "PM";
        pmSelector.classList.add("gamut__timePicker__meridiamSelector--meridiam");
        meridiamSelector.appendChild(pmSelector);
        if($tp.meridiamValue === "am"){
            amSelector.classList.toggle("gamut__timePicker__meridiamSelector--selected");
        } else if($tp.meridiamValue === "pm"){
            pmSelector.classList.toggle("gamut__timePicker__meridiamSelector--selected");
        }

        //append the meridiam selector to the widget
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
        const minHand = newElem("div");
        minHand.classList.add("gamut__timePicker__minHand");
        minHand.style.transform = `rotate(${getMinHandInitialRotate($tp.minuteValue)}deg)`;
        minHand.addEventListener("mousedown", rotateHand);
        clockWrapper.appendChild(minHand);
        const hrHand = newElem("div");
        hrHand.addEventListener("mousedown", rotateHand);
        hrHand.classList.add("gamut__timePicker__hrHand");
        hrHand.style.transform = `rotate(${getHourHandInitialRotate($tp.hourValue)}deg)`;
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
                timeDisplay.appendChild(inputElem);
            }
        });

        //append the time display to the widget
        widget.appendChild(timeDisplay);        
      
        //done button
        const doneButton = newElem("div");
        doneButton.classList.add("gamut__timePicker__done");
        const doneButtonText = document.createTextNode("DONE");
        doneButton.appendChild(doneButtonText);
        doneButton.addEventListener("click", $tp.close);
        widget.appendChild(doneButton);

        //insert widget to DOM
        $tp.input.parentNode.appendChild(widget);
        window.addEventListener("click", $tp.close); //attach close to the window click
    }

    //close the widget
    $tp.close = (e) => {
        /* If the widget is being rendered in App Maker, then we need to check that the element matches
            the parent element of the input, which is the dateBox widget inside appmaker. If it is not 
            rendered in App Maker, we just need to check it matches the input element.
        */
       $tp.setValue(); 
        const proceedToClose = $tp.isAppMaker ? (e.target !== $tp.input.parentElement) : (e.target !== $tp.input);
        if (proceedToClose) {
            $tp.input.parentNode.removeChild(widget);
            window.removeEventListener("click", $tp.close); //remove close from the window click
            gamut.activeTimeSetter = null;
        }
    }

    //prevent widget close
    $tp.preventClose = (e) => {
        e.stopPropagation();
        return false;
    }

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

        //open a new instance
        const rect = $tp.isAppMaker ? e.target.parentElement.getBoundingClientRect() : $tp.input.getBoundingClientRect();
        $tp.open(rect.top, rect.left, rect.height, rect.width);

        //save opened instance as active instance
        gamut.activeTimePicker = $tp;
        $tp.input.blur();
    };

    //add the open widget method upon focus
    $tp.input.addEventListener("focus", $tp.focus);
    $tp.input.blur();

    return $tp;
}

export default timePicker;