/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Danish
	file: AnyPicker-i18n-da

*/

(function ($) {
    $.AnyPicker.i18n["da"] = $.extend($.AnyPicker.i18n["da"], {

    	// Common

    	headerTitle: "Vælg",
		setButton: "Vælg",
		clearButton: "Nulstil",
		nowButton: "Nu",
		cancelButton: "Annuller",
		dateSwitch: "Dato",
		timeSwitch: "Tid",

    	// DateTime

        veryShortDays: "Sø_Ma_Ti_On_To_Fr_Lø".split("_"),
		shortDays: "Søn_Moa_Tir_Ons_Tor_Fre_Lør".split("_"),
		fullDays: "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Søndag".split("_"),
		shortMonths: "Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec".split("_"),
		fullMonths: "Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		},
		componentLabels: {
			date: "Dato",
			day: "Dag",
			month: "Måned",
			year: "År",
			hours: "Timer",
			minutes: "Minutter",
			seconds: "Sekunder",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);