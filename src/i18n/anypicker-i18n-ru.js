/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Russian
	file: AnyPicker-i18n-ru

*/

(function ($) {
    $.AnyPicker.i18n["ru"] = $.extend($.AnyPicker.i18n["ru"], {

    	// Common

    	headerTitle: "выбрать",
		setButton: "Установите",
		clearButton: "Очистить",
		nowButton: "сейчас",
		cancelButton: "отменить",
		dateSwitch: "дата",
		timeSwitch: "время",

    	// DateTime

    	veryShortDays: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
		shortDays: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
		fullDays: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
		shortMonths: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
		fullMonths: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
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
