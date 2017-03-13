/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: French
	file: AnyPicker-i18n-fr

*/

(function ($) {
    $.AnyPicker.i18n["fr"] = $.extend($.AnyPicker.i18n["fr"], {

    	// Common

    	headerTitle: "Sélectionner",
		setButton: "Set",
		clearButton: "Clair",
		nowButton: "Maintenant",
		cancelButton: "Annuler",
		dateSwitch: "Date",
		timeSwitch: "Temps",

    	// DateTime

    	veryShortDays: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
		shortDays: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
		fullDays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
		shortMonths: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
		fullMonths: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
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
