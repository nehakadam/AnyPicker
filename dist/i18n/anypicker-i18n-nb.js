/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Norwegian Bokmål
	file: AnyPicker-i18n-nb
	author: Tommy Eliassen(https://github.com/pusle)

*/

(function ($) {
    $.AnyPicker.i18n["nb"] = $.extend($.AnyPicker.i18n["nb"], {

    	// Common

    	headerTitle: "Velg",
		setButton: "Bruk",
		clearButton: "Tøm",
		nowButton: "Nå",
		cancelButton: "Avbryt",
		dateSwitch: "Dato",
		timeSwitch: "Klokkeslett",

    	// DateTime

        veryShortDays: "Sø_Ma_Ti_On_To_Fr_Lø".split("_"),
		shortDays: "Søn_Man_Tir_Ons_Tor_Fre_Lør".split("_"),
		fullDays: "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
		shortMonths: "Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),
		fullMonths: "Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		}
	
    });

})(jQuery);
