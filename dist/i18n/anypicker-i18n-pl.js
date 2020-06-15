/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Polski
	file: AnyPicker-i18n-pl

*/

(function ($) {
    $.AnyPicker.i18n["pl"] = $.extend($.AnyPicker.i18n["pl"], {

    	// Common

    	headerTitle: "Wybierz",
		setButton: "OK",
		clearButton: "Usuń",
		nowButton: "Teraz",
		cancelButton: "Anuluj",
		dateSwitch: "Data",
		timeSwitch: "Czas",

    	// DateTime

        veryShortDays: "Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),
		shortDays: "Ndz_Pon_Wt_Śr_Czw_Pt_Sob".split("_"),
		fullDays: "Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota".split("_"),
		shortMonths: "Sty_Lut_Mar_Kwi_Maj_Cze_Lip_Sie_Wrz_Paź_Lis_Gru".split("_"),
		fullMonths: "Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień".split("_"),
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
			day: "Dzień",
			month: "Miesiąc",
			year: "Rok",
			hours: "Godziny",
			minutes: "Minuty",
			seconds: "Sekundy",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);