//App Maker TextBox widget validator
const validateTextBox = widget=>widget.__gwt_instance.mb === "TextField";

//App Maker DateBox widget validator
const validateCheckBox = widget=>widget.__gwt_instance.mb === "CheckBoxComponent"; 

//App Maker Page widget validator
const validatPageWidget = widget=>widget.__gwt_instance.mb === "Panel" && widget.parent === null; 

//App Maker DateBox widget validator
const validateDateBox = widget=>widget.__gwt_instance.mb === "DateTextBox"; 

//div element generator
const newElem = (elem)=>document.createElement(elem);

export { validateTextBox, validateCheckBox, validatPageWidget, validateDateBox, newElem };