/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

/*

	language: Chinese
	file: AnyPicker-i18n-zh-cn

*/

(function ($) {
    $.AnyPicker.i18n["zh-cn"] = $.extend($.AnyPicker.i18n["zh-cn"], {

    	// Common

    	headerTitle: "选择",
		setButton: "设置",
		clearButton: "明确",
		nowButton: "现在",
		cancelButton: "取消",
		dateSwitch: "日期",
		timeSwitch: "时间",

    	// DateTime

    	veryShortDays: '日_一_二_三_四_五_六'.split('_'),
		shortDays: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
		fullDays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
		shortMonths: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
		fullMonths: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
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
