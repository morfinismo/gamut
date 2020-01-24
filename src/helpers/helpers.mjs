//App Maker TextBox widget validator
const validateTextBox = widget=>widget.__gwt_instance.mb === "TextField";

//App Maker DateBox widget validator
const validateCheckBox = widget=>widget.__gwt_instance.mb === "CheckBoxComponent"; 

//App Maker Page widget validator
const validatPageWidget = widget=>widget.__gwt_instance.mb === "Panel" && widget.parent === null; 

//App Maker DateBox widget validator
const validateDateBox = widget=>widget.__gwt_instance.mb === "DateTextBox"; 

//App Maker List widget validator
const validateListPanel = widget=>widget.__gwt_instance.mb === "ListPanel"; 

//App Maker Grid widget validator
const validateGrid = widget=>widget.__gwt_instance.mb === "GridPanel"; 

//Scrolling widget validator
const validateScrollingWidget = widget=>validateListPanel(widget) || validateGrid(widget);

//div element generator
const newElem = (elem)=>document.createElement(elem);

export { 
    validateTextBox, 
    validateCheckBox, 
    validatPageWidget, 
    validateDateBox, 
    validateListPanel,
    validateGrid,
    validateScrollingWidget,
    newElem 
};