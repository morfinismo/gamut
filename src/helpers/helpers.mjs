//App Maker TextBox widget validator
const validateTextBox = (widget) => widget.__gwt_instance.mb === "TextField";

//App Maker DateBox widget validator
const validateDateBox = (widget) => widget.__gwt_instance.mb === "DateTextBox"; 

//div element generator
const getDiv = () => document.createElement("div");

export { validateTextBox, validateDateBox, getDiv };