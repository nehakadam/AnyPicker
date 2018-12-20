/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Spanish
	file: AnyPicker-i18n-es

*/

(function ($) {
    $.AnyPicker.i18n["es"] = $.extend($.AnyPicker.i18n["es"], {

    	// Common

    	headerTitle: "Seleccionar",
		setButton: "OK",
		clearButton: "Claro",
		nowButton: "Ahora",
		cancelButton: "Cancelar",
		dateSwitch: "Fecha",
		timeSwitch: "Hora",

    	// DateTime

        veryShortDays: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
		shortDays: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
		fullDays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
		shortMonths: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
		fullMonths: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["a", "p"],
			aa: ["am", "pm"],
			A: ["A", "P"],
			AA: ["AM", "PM"]
		},
		componentLabels: {
			date: "Fecha",
			day: "Día",
			month: "Mes",
			year: "Año",
			hours: "Horas",
			minutes: "Minutos",
			seconds: "Segundos",
			meridiem: "Meridiem"
		}
	
    });

})(jQuery);