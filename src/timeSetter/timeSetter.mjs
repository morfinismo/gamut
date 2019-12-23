import { validateTextBox, newElem } from '../helpers/helpers.mjs';

const timeSetter = (textBox, config) => {

    if(!textBox){
        console.error("%cGAMUT Time Setter Error: "+"%cEither an input element or a Text Box Widget is required!","color:red","color:brown");
        return;
    }

    //default configuration
    const defaultConfig = {
        leadingZeros: true,
        initialValue: "00:00:00",
        zIndex: 9,
        maxTime: "99:59:59", //TODO: enable support to limit the max time,
        valueChange: v => v
    }
    
    //main timeSetter object
    const $ts = {
        options: defaultConfig,
        input: textBox,
        isAppMaker: false
    };    

    //check if it's an App Maker widget and if it is, extract the input element and override the $ts.input value
    if (textBox.__gwt_instance !== undefined && textBox.__gwt_instance !== null && validateTextBox(textBox)) {
        $ts.input = textBox.getElement().children[1];
        $ts.isAppMaker = true;
    }

    //force the input to be text type
    $ts.input.setAttribute("type", "text");

    //modify label position if App Maker widget
    if ($ts.isAppMaker) {
        textBox.getElement().children[0].classList.add("gamut--label-fix");
    }

    //set options values from config
    if (config !== undefined && config !== null && typeof (config) === "object") {
        if (config.leadingZeros !== undefined && config.leadingZeros !== null) {
            if (typeof config.leadingZeros === "boolean") {
                $ts.options.leadingZeros = config.leadingZeros;
            }
        }
        if (config.initialValue !== undefined && config.initialValue !== null) {
            if (new RegExp(/\d{1,2}:\d{1,2}:\d{1,2}/).test(config.initialValue)) {
                $ts.options.initialValue = config.initialValue;
            }
        }
        if (config.zIndex !== undefined && config.zIndex !== null) {
            const newZindex = parseInt(config.zIndex);
            if (typeof newZindex === "number") {
                $ts.options.zIndex = newZindex;
            }
        }
        if (config.valueChange !== undefined && config.valueChange !== null) {
            if (typeof config.valueChange === "function") {
                $ts.options.valueChange = config.valueChange;
            }
        }
    }

    //establish the hour, minute and second values
    $ts.hourValue = parseInt($ts.options.initialValue.split(":")[0]);
    $ts.minuteValue = parseInt($ts.options.initialValue.split(":")[1]);
    $ts.secondValue = parseInt($ts.options.initialValue.split(":")[2]);

    //set value to the $ts.input
    $ts.setValue = (hasChanged = false) => {
        let hours = $ts.hourValue;
        let minutes = $ts.minuteValue;
        let seconds = $ts.secondValue;
        if ($ts.options.leadingZeros) {
            hours = $ts.hourValue < 10 ? "0" + $ts.hourValue : $ts.hourValue;
            minutes = $ts.minuteValue < 10 ? "0" + $ts.minuteValue : $ts.minuteValue;
            seconds = $ts.secondValue < 10 ? "0" + $ts.secondValue : $ts.secondValue;
        }
        const newValue = `${hours}:${minutes}:${seconds}`;
        $ts.input.value = newValue;
        if (hasChanged) {
            $ts.options.valueChange(newValue);
        }
    }
    $ts.setValue(); //sets the default value upon initialization

    //handles the time argument value change when a controller is clicked
    $ts.controllerClick = (e) => {

        const controller = e.target;
        const action = controller.getAttribute("data-action");
        const argumentInput = controller.parentElement.children[0];
        const argumentType = argumentInput.getAttribute("data-timearg");
        const currentValue = parseInt(argumentInput.value);
        let newValue;

        /* when adding, hours can go up with no limit, minutes and seconds can not go beyond 59,
           it they do, the value will reset to 0. When substracting, hours can not go below 0,
           minutes and seconds can not go below 0, if they do, the value will reset to 59
        */
        if (action === "add") {
            if (argumentType === "hrs") {
                newValue = currentValue + 1;
            } else if (argumentType === "mins" || argumentType === "secs") {
                newValue = (currentValue === 59) ? 0 : currentValue + 1;
            }
        } else if (action === "substract") {
            if (argumentType === "hrs") {
                newValue = currentValue - 1;
            } else if (argumentType === "mins" || argumentType === "secs") {
                newValue = (currentValue === 0) ? 59 : currentValue - 1;
            }
        }
        newValue = newValue < 1 ? 0 : newValue;

        //set the time arguments values for the instance
        if (argumentType === "hrs") {
            $ts.hourValue = newValue;
        } else if (argumentType === "mins") {
            $ts.minuteValue = newValue;
        } else if (argumentType === "secs") {
            $ts.secondValue = newValue;
        }
        if (newValue < 10) {
            argumentInput.value = $ts.options.leadingZeros ? "0" + newValue : newValue;
        } else {
            argumentInput.value = newValue;
        }

        //change the value of the $ts.input
        $ts.setValue(true);
    }

    //handles the time parameter value change when manually edited
    $ts.paramChange = (e) => {

        const inputRef = e.target;
        const argumentType = inputRef.getAttribute("data-timearg");
        const currentValue = parseInt(inputRef.value);

        /* hours can go up with no limit, minutes and seconds can not go beyond 59,
            it they do, the value will reset to 0. hours, minutes and seconds can not go below 0.
            if minutes or seconds go below 0, the value will reset to 59
        */
        let newValue;
        if (argumentType === "hrs") {
            newValue = currentValue < 1 ? 0 : currentValue;
            $ts.hourValue = newValue;
        } else if (argumentType === "mins") {
            newValue = currentValue > 59 ? 0 : currentValue < 0 ? 59 : currentValue;
            $ts.minuteValue = newValue;
        } else if (argumentType === "secs") {
            newValue = currentValue > 59 ? 0 : currentValue < 0 ? 59 : currentValue;
            $ts.secondValue = newValue;
        }
        if ($ts.options.leadingZeros && newValue < 10) {
            newValue = "0" + newValue;
        }
        inputRef.value = newValue;

        //change the value of the $ts.input
        $ts.setValue(true);
    }

    //create the timeSetter widget
    const widget = newElem("div");

    //open the time setter widget
    $ts.open = (top, left, height, width) => {

        //style the widget             
        widget.innerHTML = "";
        widget.style.width = width + "px";
        widget.style.top = top + height + 2 + "px"
        widget.style.left = left + "px";
        widget.style.zIndex = $ts.options.zIndex;
        widget.classList.add("gamut__timeSetter");

        //create the widget body
        const body = newElem("div");
        body.classList.add("gamut__timeSetter__body");
        body.style.flexDirection = width < 175 ? "column" : "row";

        //build the time parameter boxes
        const timeParams = ["Hrs", "Mins", "Secs"];
        timeParams.forEach((timeParam) => {

            //create the param box
            const paramBox = newElem("div");
            paramBox.classList.add("gamut__timeSetter__paramBox");
            paramBox.style.width = width < 175 ? "100%" : "33.3%";

            //create param label
            const paramLabel = newElem("span");
            paramLabel.classList.add("gamut__timeSetter__paramLabel");
            paramLabel.style.textAlign = (width < 175 || width > 224) ? "center" : "left";
            const paramLabelText = document.createTextNode(timeParam);
            paramLabel.appendChild(paramLabelText);

            //append the param label to param box
            paramBox.appendChild(paramLabel);

            //create the wrapper for the param input
            const paramInputWrapper = newElem("div");
            paramInputWrapper.classList.add("gamut__timeSetter__paramInputWrapper");

            //create the param input
            const parameterInput = newElem("input");
            parameterInput.classList.add("gamut__timeSetter__paramInputWrapper__input");
            parameterInput.style.textAlign = (width < 175 || width > 224) ? "center" : "left";
            parameterInput.style.paddingRight = (width < 175 || width > 224) ? "15px" : "0px";
            parameterInput.addEventListener("change", $ts.paramChange);
            parameterInput.addEventListener("focus", (e) => {
                parameterInput.select();
            });
            parameterInput.setAttribute("type", "text");
            switch (timeParam) {
                case "Hrs":
                    parameterInput.setAttribute("value", ($ts.options.leadingZeros && $ts.hourValue < 10) ? `0${$ts.hourValue}` : $ts.hourValue);
                    parameterInput.setAttribute("data-timearg", "hrs");
                    break;
                case "Mins":
                    parameterInput.setAttribute("value", ($ts.options.leadingZeros && $ts.minuteValue < 10) ? `0${$ts.minuteValue}` : $ts.minuteValue);
                    parameterInput.setAttribute("data-timearg", "mins");
                    break;
                default:
                    parameterInput.setAttribute("value", ($ts.options.leadingZeros && $ts.secondValue < 10) ? `0${$ts.secondValue}` : $ts.secondValue);
                    parameterInput.setAttribute("data-timearg", "secs");
            }

            //append the param input to the wrapper of the param input
            paramInputWrapper.appendChild(parameterInput);

            //create the plus controller
            const paramPlusButton = newElem("span");
            paramPlusButton.classList.add("gamut__timeSetter__paramInputWrapper__controller--plus");
            paramPlusButton.setAttribute("data-action", "add");
            const paramPlusButtonText = document.createTextNode("❮");
            paramPlusButton.style.top = $ts.isAppMaker ? "0px" : "-2px";
            paramPlusButton.addEventListener("click", $ts.controllerClick);
            paramPlusButton.appendChild(paramPlusButtonText);

            //append the controller plus to the wrapper of the param input
            paramInputWrapper.appendChild(paramPlusButton);

            //create the minus controller
            const paramMinusButton = newElem("span");
            paramMinusButton.classList.add("gamut__timeSetter__paramInputWrapper__controller--minus");
            paramMinusButton.setAttribute("data-action", "substract");
            const paramMinusButtonText = document.createTextNode("❯");
            paramMinusButton.style.bottom = $ts.isAppMaker ? "0px" : "-2px";
            paramMinusButton.appendChild(paramMinusButtonText);
            paramMinusButton.addEventListener("click", $ts.controllerClick);

            //append the minus controller to the wrapper of the param input
            paramInputWrapper.appendChild(paramMinusButton);

            //append param input wrapper to the param box
            paramBox.appendChild(paramInputWrapper);

            //append the param box to the  
            body.appendChild(paramBox);
        });

        //append boxes wrapper to widget
        widget.appendChild(body);

        //done button
        const doneButton = newElem("div");
        doneButton.classList.add("gamut__timeSetter__doneButton");
        const doneButtonText = document.createTextNode("DONE");
        doneButton.appendChild(doneButtonText);
        doneButton.addEventListener("click", $ts.close);
        widget.appendChild(doneButton);

        //insert widget to DOM
        $ts.input.parentNode.appendChild(widget);
        window.addEventListener("click", $ts.close); //attach close to the window click
    }

    //close the widget
    $ts.close = (e) => {
        /* If the widget is being rendered in App Maker, then we need to check that the element matches
           the parent element of the input, which is the TextBox widget inside appmaker. If it is not 
           rendered in App Maker, we just need to check it matches the input element.
        */
        const proceedToClose = $ts.isAppMaker ? (e.target !== $ts.input.parentElement) : (e.target !== $ts.input);
        if (proceedToClose) {
            $ts.input.parentNode.removeChild(widget);
            window.removeEventListener("click", $ts.close); //remove close from the window click
            gamut.activeTimeSetter = null;
        }
    }

    //prevent widget close
    $ts.preventClose = (e) => {
        e.stopPropagation();
        return false;
    }

    //attach prevent close to widget and in case is App Maker, input parent also
    widget.addEventListener("click", $ts.preventClose);
    if ($ts.isAppMaker) {
        $ts.input.parentElement.addEventListener("click", $ts.preventClose);
    }

    //add focus event to $ts.input
    $ts.focus = (e) => {

        //close any open instance if any
        const isOpened = gamut.activeTimeSetter ? true : false;
        if (isOpened) {
            gamut.activeTimeSetter.close(e);
        }

        //open a new instance
        const rect = $ts.isAppMaker ? e.target.parentElement.getBoundingClientRect() : $ts.input.getBoundingClientRect();
        $ts.open(rect.top, rect.left, rect.height, rect.width);

        //save opened instance as active instance
        gamut.activeTimeSetter = $ts;
        $ts.input.blur();
    };

    //add the open widget method upon focus
    $ts.input.addEventListener("focus", $ts.focus);
    $ts.input.blur();

    return $ts;
};

export default timeSetter;