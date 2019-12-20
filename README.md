# GAMUT - (G)oogle (A)pp (M)aker (UT)ilities

A collection of utilites to use with [Google App Maker](https://developers.google.com/appmaker/). Support outside of Google App Maker might be available for some utilities but the primary focus is compatibility with Google App Maker.


## Browser support

Currently, only Google Chrome v60+ is supported. Compatibility with other browsers has not been tested yet. Please feel free to contribute.

## List of utilities

 - [Time Setter](##Time-Setter)
 - [Format Text Box](##Format-Text-Box)

## Time Setter

A utility that helps you set a certain amount of time in hours, minutes and seconds. Its usage is primarily focused towards systems that require to keep track of time for certain activites.

**Config:**

 - leadingZeros - (boolean) Whether to show the time value with no leading zeros, e.g. 0:3:5; or to show it with leading zeros, e.g. 00:03:05. The default is true.
 - initialValue - (string) A formatted string using the pattern H:M:S or HH:MM:SS. This is the value that the will be shown when the time setter initializes.
 - zIndex - (number) Used to set up the z-index value of the time setter widget when it becomes visible.
 - valueChange - (function) A callback function to execute each time the value changes. This fuction takes in the new value as the only parameter.

### Example Usage - Inisde Google App Maker

This can only be used with a **TextBox** widget. Depending on your need, add the following code to either the **onAttach** event handler or the **onDataLoad** event handler of the widget:

    var config = {
        leadingZeros: true,
        initialValue: "00:45:09",
        zIndex: 9,
        valueChange: function(newValue){
            console.log(newValue);
        }
    };
    gamut.timeSetter(widget, config);

### Example Usage - Outside Google App Maker

This can only be used with an **input** HTML element. Preferrably, use it after the DOM content is loaded:

    var config = {
        leadingZeros: true,
        initialValue: "00:45:09",
        zIndex: 9,
        valueChange: function(newValue){
            console.log(newValue);
        }
    };
    document.addEventListener("DOMContentLoaded", ()=>{
        gamut.timeSetter(document.querySelector["#setTime"], config);
    });


## Format Text Box

A utility that helps you change the type of a TextBox widget.

**Config:**

 - type - (string) The type of input that it should be. (Currently, the only supported ones are **text**, **password** and **number**.)- The default is **text**.
 - readonly - (boolean) Specifies if the widget should not be editable without having to apply the "disabled" option in appmaker which causes the widget to be grayed out. The default is false.
 - min - (number) Applies to **number** type only. Specifies the minimum value allowed. The default is 0.
 - max - (number) Applies to **number** type only. Specifies the maximum value allowed. The default is 999999999.
 - step - (number) Applies to **number** type only. Specifies the granularity that the value must adhere to. The default is 1.
 - initialValue - (any) The value the widget should have upon initialization. Default for text is null and for numbers is the min.

### Example Usage - Inisde Google App Maker

Depending on your need, add the following code to either the **onAttach** event handler or the **onDataLoad** event handler of the widget:

    var config = {
        type: "password"
    };
    gamut.formatTextBox(widget, config);

