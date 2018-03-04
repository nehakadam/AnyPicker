/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Turkish
	file: AnyPicker-i18n-tr

*/

(function ($) {
    $.AnyPicker.i18n["tr"] = $.extend($.AnyPicker.i18n["tr"], {

    	// Common

    	headerTitle: "Seçiniz",
		setButton: "Ayarla",
		clearButton: "Temizle",
		nowButton: "Şimdi",
		cancelButton: "İptal",
		dateSwitch: "Tarih",
		timeSwitch: "Saat",

    	// DateTime

        veryShortDays: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
		shortDays: "Paz_Pzt_Sal_Çar_Per_Cum_Cts".split("_"),
		fullDays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
		shortMonths: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
		fullMonths: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
		numbers: "0_1_2_3_4_5_6_7_8_9".split("_"),
		meridiem: 
		{
			a: ["s", "a"],
			aa: ["öö", "ös"],
			A: ["S", "A"],
			AA: ["ÖÖ", "ÖS"]
		},
		componentLabels: {
			date: "Tarih",
			day: "Gün",
			month: "Ay",
			year: "Yıl",
			hours: "Saat",
			minutes: "Dakika",
			seconds: "Saniye",
			meridiem: "ÖÖ/ÖS"
		}
	
    });

})(jQuery);
