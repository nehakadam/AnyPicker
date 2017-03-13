/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: English
	file: AnyPicker-i18n-en

*/

(function ($) {
    $.AnyPicker.i18n["en"] = $.extend($.AnyPicker.i18n["en"], {

    	// Common

    	headerTitle: "Select",
		setButton: "Set",
		clearButton: "Clear",
		nowButton: "Now",
		cancelButton: "Cancel",
		dateSwitch: "Date",
		timeSwitch: "Time",

    	// DateTime

        veryShortDays: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
		shortDays: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
		fullDays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
		shortMonths: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
		fullMonths: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		},
		componentLabels: {
			date: "Date",
			day: "Day",
			month: "Month",
			year: "Year",
			hours: "Hours",
			minutes: "Minutes",
			seconds: "Seconds",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);