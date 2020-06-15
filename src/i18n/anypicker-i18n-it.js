/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Italian
	file: AnyPicker-i18n-it

*/

(function ($) {
    $.AnyPicker.i18n["it"] = $.extend($.AnyPicker.i18n["it"], {

    	// Common

    	headerTitle: "Selezionare",
		setButton: "OK",
		clearButton: "Chiaro",
		nowButton: "Ora",
		cancelButton: "Annulla",
		dateSwitch: "Data",
		timeSwitch: "Tempo",

    	// DateTime

        veryShortDays: "Do_Lu_Ma_Me_Gi_Ve_Sa".split("_"),
		shortDays: "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
		fullDays: "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
		shortMonths: "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
		fullMonths: "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		},
		componentLabels: {
			date: "Data",
			day: "Giorno",
			month: "Mese",
			year: "Anno",
			hours: "Ore",
			minutes: "Minuti",
			seconds: "Secondi",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);