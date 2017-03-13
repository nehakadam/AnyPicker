/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*
	
	language: German ("de")
	file: AnyPicker-i18n-de

*/

(function ($) {
    $.AnyPicker.i18n["de"] = $.extend($.AnyPicker.i18n["de"], {

    	// Common

    	headerTitle: "Auswählen",
		setButton: "einstellen",
		clearButton: "klar",
		nowButton: "jetzt",
		cancelButton: "Abbrechen",
		dateSwitch: "Datum",
		timeSwitch: "Zeit",

    	// DateTime

    	veryShortDays: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
		shortDays: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
		fullDays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
		shortMonths: 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
		fullMonths: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
		numbers: '0_1_2_3_4_5_6_7_8_9'.split('_'),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		}
	
    });

})(jQuery);
