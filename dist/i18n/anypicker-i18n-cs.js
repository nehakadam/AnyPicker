/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2018 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Czech
	file: AnyPicker-i18n-cs

*/

(function ($) {
    $.AnyPicker.i18n["cs"] = $.extend($.AnyPicker.i18n["cs"], {

    	// Common

    	headerTitle: "Vybrat",
		setButton: "Nastavit",
		clearButton: "Smazat",
		nowButton: "Nyní",
		cancelButton: "Zrušit",
		dateSwitch: "Datum",
		timeSwitch: "Čas",

    	// DateTime

        veryShortDays: "Ne_Po_Čt_St_Čt_Pá_So".split("_"),
		shortDays: "Ned_Pon_Úte_Stř_Čtv_Pát_Sob".split("_"),
		fullDays: "Neděle_Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota".split("_"),
		shortMonths: "Led_Úno_Bř_Dub_Kvě_Čer_Čec_Srp_Zář_Říj_Lis_Pro".split("_"),
		fullMonths: "Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		},
		componentLabels: {
			date: "Datum",
			day: "Den",
			month: "Měsíc",
			year: "Rok",
			hours: "Hodiny",
			minutes: "Minuty",
			seconds: "Sekundy",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);