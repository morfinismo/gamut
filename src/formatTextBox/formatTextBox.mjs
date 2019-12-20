import { validateTextBox } from '../helpers/helpers.mjs';

const formatTextBox = (textBox, config) => {

    //validate is a TextBox widget
    const isTextBox = validateTextBox(textBox);

    //proceed if it is a TextBox widget
    if (isTextBox) {

        //supported input types
        const validTypes = ["number", "password", "text"];

        //supported options
        const options = {
            type: "text",
            readonly: false,
            min: 0, // number type
            max: 999999999, // number type
            step: 1, // number type
            initialValue: null
        };

        //set options values from config
        if (config !== undefined && config !== null && typeof config === "object") {
            if (config.type && validTypes.includes(config.type)) {
                options.type = config.type;
            }
            if (config.readonly !== undefined && config.readonly !== null && typeof config.readonly === "boolean") {
                options.readonly = config.readonly;
            }
            if (config.max !== undefined && config.max !== null && typeof config.max === "number") {
                options.max = config.max;
            }
            if (config.min !== undefined && config.min !== null && typeof config.min === "number") {
                options.min = config.min;
            }
            if (config.step !== undefined && config.step !== null && typeof config.step === "number") {
                options.step = config.step;
            }
            if (config.initialValue !== undefined && config.initialValue !== null) {
                options.initialValue = config.initialValue;
            }
        }

        //extract the input element
        const elem = textBox.getElement().children[1];

        //apply the input type
        elem.setAttribute("type", options.type);

        //apply readonly if applicable
        if (options.readonly) {
            elem.setAttribute("readonly", "");
        }

        //modify label position of the TextBox widget
        textBox.getElement().children[0].classList.add("gamut--label-fix");

        //apply number attributes if needed
        if (options.type === "number") {
            elem.classList.add("gamutNumberInput");
            elem.setAttribute("max", options.max);
            elem.setAttribute("min", options.min);
            elem.setAttribute("step", options.step);
            elem.value = (typeof options.initialValue === "number") ? options.initialValue : options.min;
        }
    }
};

export default formatTextBox;