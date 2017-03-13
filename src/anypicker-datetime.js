/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

// --------------------------------- Global Variables : AnyPicker.DateTime Start -----------------------------------

//"use strict";

$.AnyPicker = $.extend(true, $.AnyPicker, {

	defaults: // Defaults Settings
	{

		selectedDate: null,

		i18n: 
		{
			veryShortDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			fullDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			fullMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			meridiem: 
			{
				a: ["a", "p"],
				aa: ["am", "pm"],
				A: ["A", "P"],
				AA: ["AM", "PM"]
			},

			componentLabels: {
				date: "Date",
				day: "Day",
				month: "Month",
				year: "Year",
				hours: "Hours",
				minutes: "Minutes",
				seconds: "Seconds",
				meridiem: "Meridiem"
			}
		},

		inputDateTimeFormat: "",
		dateTimeFormat: "dd-MM-yyyy hh:mm AA",

		tzOffset: "",

		maxValue: null,
		minValue: null,
		maxYear: 0,
		disableValues: {},

		intervals: 
		{
			h: 1,
			m: 1,
			s: 1
		},
		roundOff: true

		//------------------ Callback Functions Start --------------------------

		//------------------ Callback Functions End ----------------------------
	},

	tempDefaults: // Plugin-level Variables required to maintain state across methods
	{
		oMinMax: {},
		oArrPDisable: {},
		sDateTimeMode: "",
		sArrDateTimeFormat: [],
		sDateTimeRegex: "",
		diffDateTimeFormats: false,
		sArrInputDateTimeFormat: [],
		sInputDateTimeRegex: "",
		sHeaderTitleType: "Static",
		sArrHeaderTitleFormat: [],
		dPrevDate: null
	},

	extra: // Common Temporary Variables
	{
		dToday: new Date(),

		iMS: 
		{ 
			m: 6E4, 
			h: 36E5, 
			d: 864E5, 
			w: 6048E5 
		},

		sFormatRegex: /(\[[^\[]*\])|(\\)?(MMMM|MMM|MM?|DDDD|DDD|DD|D|dd?|yyyy|YYYY|yy|YY|y|Y|aa?|AA?|hh?|HH?|mm?|ss?|x|X|zz?|ZZ?|.)/g,

		en: 
		{
			veryShortDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			fullDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			fullMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			meridiem: 
			{
				a: ["a", "p"],
				aa: ["am", "pm"],
				A: ["A", "P"],
				AA: ["PM", "PM"]
			}
		},

		sArrDateComponents: 
		[
			"d", "dd", "DD", "DDD", "DDDD",
			"M", "MM", "MMM", "MMMM",
			"y", "yy", "yyyy", "Y", "YY", "YYYY",
			"h", "hh", "H", "HH",
			"m", "mm",
			"s", "ss",
			"AA", "A", "aa", "a"
		],

		sArrDateTimeModes:
		[
			"date",
			"time",
			"datetime"
		]
	}

});

// --------------------------------- Global Variables : AnyPicker.DateTime End --------------------------------------

// --------------------------------- Functions : AnyPicker.DateTime Start ------------------------------------

AnyPicker.prototype = $.extend(AnyPicker.prototype, {

	_isSupportedFormat: function(sFormat)
	{
		var apo = this;
		return (sFormat.search($.AnyPicker.extra.sFormatRegex, "") !== -1);		
	},

	/*
	
	A function to set components data of picker for a particular datetime format.
	
	*/
	__setComponentsOfDateTimePicker: function()
	{
		var apo = this;

		var iTempIndex, sFormat;

		apo.setting.components = [];
		apo.tmp.numOfComp = 0;
		apo.setting.dataSource = [];

		var bHasDateComponent = (apo.setting.dateTimeFormat.search(/D|d|M|y|Y/, "") !== -1),
		bHasTimeComponent = (apo.setting.dateTimeFormat.search(/H|h|m|s|A|a/, "") !== -1);

		apo.tmp.sDateTimeMode = (bHasDateComponent && bHasTimeComponent) ? "datetime" : (bHasDateComponent ? "date" : (bHasTimeComponent ? "time" : ""));
	
		if($.CF.isValid(apo.setting.dateTimeFormat))
		{
			if($.CF.isValid(apo.setting.inputDateTimeFormat))
			{
				apo.tmp.diffDateTimeFormats = (apo.setting.dateTimeFormat !== apo.setting.inputDateTimeFormat);
			}
			else
			{
				apo.setting.inputDateTimeFormat = apo.setting.dateTimeFormat;
				apo.tmp.diffDateTimeFormats = false;
			}
		}
		else
		{
			console.log("Invalid DateTimeFormat");
		}
	
		apo.tmp.sArrDateTimeFormat = apo._setDateTimeFormatComponentsArray(apo.setting.dateTimeFormat);
		if(apo.tmp.diffDateTimeFormats)
			apo.tmp.sArrInputDateTimeFormat = apo._setDateTimeFormatComponentsArray(apo.setting.inputDateTimeFormat);

		//----------------- Code to concatenate separators End -------------
	
		apo.tmp.sDateTimeRegex = apo._createDateTimeRegex(apo.tmp.sArrDateTimeFormat);
		if(apo.tmp.diffDateTimeFormats)
			apo.tmp.sInputDateTimeRegex = apo._createDateTimeRegex(apo.tmp.sArrInputDateTimeFormat);

		apo.setSelectedDate(apo.setting.selectedDate);
		apo.parseDisableValues();

		var bMMMMddYYYY = apo.setting.dateTimeFormat.match(/(MMMM).*(dd|d).*(yyyy|YYYY)/);
		if(apo.tmp.sArrDateTimeFormat.length > 0)
		{
			for(iTempIndex = 0; iTempIndex < apo.tmp.sArrDateTimeFormat.length; iTempIndex++)
			{
				sFormat = apo.tmp.sArrDateTimeFormat[iTempIndex];
				if(sFormat.search(/D|d|M|y|Y|H|h|m|s|A|a/, "g") !== -1)
				{
					apo._setComponentAndDataSourceForFormat(sFormat, {"MMMMddYYYY": bMMMMddYYYY});
				}
			}
		}

		if(!apo.tmp.headerTitleDefined && $.CF.compareStrings(apo.setting.mode, "datetime") && !$.CF.compareStrings(apo.setting.theme, "iOS"))
		{
			apo.setting.headerTitle.contentBehaviour = "Dynamic";
			if(apo.tmp.sDateTimeMode === "datetime")
			{
				if(apo._formatContains(apo.tmp.sArrDateTimeFormat, ["d", "M", "y|Y", "h", "m"], "and") && apo._formatContains(apo.tmp.sArrDateTimeFormat, ["a", "A"], "or"))
					apo.setting.headerTitle.format = "dd.MM.yyyy, hh:mm " + apo._getFormatForComponent("meridiem");
				else if(apo._formatContains(apo.tmp.sArrDateTimeFormat, ["d", "M", "y|Y", "H", "m"], "and"))
					apo.setting.headerTitle.format = "dd.MM.yyyy, HH:mm";
				else
					apo.setting.headerTitle.format = apo.setting.dateTimeFormat;
			}
			else if(apo.tmp.sDateTimeMode === "date")
			{
				if(apo._formatContains(apo.tmp.sArrDateTimeFormat, ["d", "M", "y|Y"], "and"))
					apo.setting.headerTitle.format = "DDD, MMM dd, yyyy";
				else
					apo.setting.headerTitle.format = apo.setting.dateTimeFormat;
			}
			else if(apo.tmp.sDateTimeMode === "time")
			{
				if(apo._formatContains(apo.tmp.sArrDateTimeFormat, ["h", "m"], "and") && apo._formatContains(apo.tmp.sArrDateTimeFormat, ["a", "A"], "or"))
					apo.setting.headerTitle.format = "hh:mm " + apo._getFormatForComponent("meridiem");
				else if(apo._formatContains(apo.tmp.sArrDateTimeFormat, ["H", "m"], "and"))
					apo.setting.headerTitle.format = "HH:mm";
				else
					apo.setting.headerTitle.format = apo.setting.dateTimeFormat;
			}
		}

		if($.CF.compareStrings(apo.setting.headerTitle.contentBehaviour, "Dynamic") && $.CF.isValid(apo.setting.headerTitle.format))
		{
			if(typeof apo.setting.headerTitle.format === "function")
				apo.tmp.sHeaderTitleType = "DynamicFunction";
			else if(typeof apo.setting.headerTitle.format === "string")
			{
				apo.tmp.sHeaderTitleType = "DynamicString";
				apo.tmp.sArrHeaderTitleFormat = apo._matchRegex($.AnyPicker.extra.sFormatRegex, apo.setting.headerTitle.format);
			}
		}
	},

	// Public Method
	setSelectedDate: function(oDate)
	{
		var apo = this;

		if($.CF.isValid(oDate))
		{
			if(typeof oDate === "string")
			{
				apo.tmp.selectedDate = apo._parseInputDateTime(oDate);
			}
			else if(Object.prototype.toString.call(oDate) === "[object Date]")
			{
				apo.setting.selectedDate = apo.formatOutputDates(oDate);
				apo.tmp.selectedDate = new Date(oDate);
			}

			if(apo.setting.inputElement !== null)
			{	
				var $oInput = $(apo.setting.inputElement);
				if(apo.tmp.oInputElemValid.bIsInput)
				{
					$oInput.val(apo.setting.selectedDate);
				}
				else
				{
					$oInput.text(apo.setting.selectedDate);
				}
			}
		}
		else
		{
			apo.tmp.selectedDate = new Date($.AnyPicker.extra.dToday);
		}
	},

	// Public Method
	setMinimumDate: function(oDate)
	{
		var apo = this;

		apo.setting.minValue = oDate;
		apo.parseDisableValues();
	},

	// Public Method
	setMaximumDate: function(oDate)
	{
		var apo = this;

		apo.setting.maxValue = oDate;
		apo.parseDisableValues();
	},

	_getFormatForComponent: function(sCompName)
	{
		var apo = this;
		for(var iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{
			var oComp = apo.setting.components[iTempIndex];
			if(oComp.name === sCompName)
				return oComp.format;
		}
	},

	_formatContains: function(sArrFormat, sArrComp, bLogic)
	{
		var apo = this;
		var iTempIndex1, iTempIndex2,
		bArrComp = [], bContains;

		for(iTempIndex1 = 0; iTempIndex1 < sArrComp.length; iTempIndex1++)
		{
			var sComp = sArrComp[iTempIndex1],
			bComp = false;
			for(iTempIndex2 = 0; iTempIndex2 < sArrFormat.length; iTempIndex2++)
			{
				var sFormat = sArrFormat[iTempIndex2];
				if($.CF.isValid(sFormat) && $.CF.isValid(sComp))
				{
					if(sFormat.search(new RegExp(sComp), "") !== -1)
					{
						bComp = true;
						break;
					}
				}
			}
			bArrComp.push(bComp);
		}

		if(bLogic === "and")
		{
			bContains = true;
			for(iTempIndex1 = 0; iTempIndex1 < bArrComp.length; iTempIndex1++)
			{
				if(bArrComp[iTempIndex1] !== true)
				{
					bContains = false;
					break;
				}
			}
		}
		else if(bLogic === "or")
		{
			bContains = false;
			for(iTempIndex1 = 0; iTempIndex1 < bArrComp.length; iTempIndex1++)
			{
				if(bArrComp[iTempIndex1] === true)
				{
					bContains = true;
					break;
				}
			}
		}

		return bContains;
	},

	_setComponentAndDataSourceForFormat: function(sCompFormat, sArrSpecial)
	{
		var apo = this;

		var oComp = {}, oData = {},
		bIsSupportedFormat = apo._isSupportedFormat(sCompFormat);

		if(bIsSupportedFormat)
		{
			if(sCompFormat === "d" || sCompFormat === "dd")
			{
				oComp.name = "date";
				oComp.label = apo.setting.i18n.componentLabels.date;
				oComp.type = "date";

				if($.CF.compareStrings(apo.setting.theme, "iOS"))
				{
					if(sArrSpecial.MMMMddYYYY)
					{
						oComp.width = "24%";
						oComp.textAlign = "right";
					}
				}
			}
			else if(sCompFormat === "DD" || sCompFormat === "DDD" || sCompFormat === "DDDD")
			{
				oComp.name = "day";
				oComp.label = apo.setting.i18n.componentLabels.day;
				oComp.type = "date";
			}
			else if(sCompFormat === "M" || sCompFormat === "MM" || sCompFormat === "MMM" || sCompFormat === "MMMM")
			{
				oComp.name = "month";
				oComp.label = apo.setting.i18n.componentLabels.month;
				oComp.type = "date";

				if($.CF.compareStrings(apo.setting.theme, "iOS"))
				{
					if(sArrSpecial.MMMMddYYYY)
					{
						oComp.width = "46%";
						oComp.textAlign = "left";
					}
				}
			}
			else if(sCompFormat === "y" || sCompFormat === "Y" || sCompFormat === "yyyy" || sCompFormat === "Y" || sCompFormat === "YYYY")
			{
				oComp.name = "year";
				oComp.label = apo.setting.i18n.componentLabels.year;
				oComp.type = "date";

				if($.CF.compareStrings(apo.setting.theme, "iOS"))
				{
					if(sArrSpecial.MMMMddYYYY)
					{
						oComp.width = "30%";
						oComp.textAlign = "right";
					}
				}
			}
			else if(sCompFormat === "H" || sCompFormat === "HH" || sCompFormat === "h" || sCompFormat === "hh")
			{
				oComp.name = "hours";
				oComp.label = apo.setting.i18n.componentLabels.hours;
				oComp.type = "time";
			}
			else if(sCompFormat === "m" || sCompFormat === "mm")
			{
				oComp.name = "minutes";
				oComp.label = apo.setting.i18n.componentLabels.minutes;
				oComp.type = "time";
			}
			else if(sCompFormat === "s" || sCompFormat === "ss")
			{
				oComp.name = "seconds";
				oComp.label = apo.setting.i18n.componentLabels.seconds;
				oComp.type = "time";
			}
			else if(sCompFormat === "aa" || sCompFormat === "a" || sCompFormat === "AA" || sCompFormat === "A")
			{
				oComp.name = "meridiem";
				oComp.label = apo.setting.i18n.componentLabels.meridiem;
				oComp.type = "time";
			}
			else
				console.log("Picker Component for " + sCompFormat + " can noot be added because the format you specified as  " + sCompFormat + "  cannot be parsed using this function. If you want to parse it, please add the condition in the _setComponentAndDataSourceForFormat function.");
		
			oComp.format = sCompFormat;
			oComp.component = apo.tmp.numOfComp;
			apo.setting.components.push(oComp);

			oData.component = oComp.component;
			oData.data = apo.__setDataSourceArrayForComponent(oComp.name, sCompFormat);
			apo.setting.dataSource.push(oData);
		
			apo.tmp.numOfComp++;
		}
	},

	__setDataSourceArrayForComponent: function(sCompName, sCompFormat)
	{
		var apo = this;
	
		var iChars, iTempIndex, 
		iDaysOfMonth, iStartValue, iEndValue, 
		iTotalYears, iStepYears, 
		oArrData = [], 
		oSelectedDate = apo.getDateObject(apo.tmp.selectedDate), 
		oMin = null, oMax = null;

		if($.CF.isValid(apo.tmp.oMinMax.min))
		{
			oMin = apo.getDateObject(apo.tmp.oMinMax.min);
		}
		if($.CF.isValid(apo.tmp.oMinMax.max))
		{
			oMax = apo.getDateObject(apo.tmp.oMinMax.max);
		}
	
		if(sCompName === "day")
		{
			if(sCompFormat === "DD")
			{
				for(iTempIndex = 0; iTempIndex < $.AnyPicker.extra.en.veryShortDays.length; iTempIndex++)
				{
					oArrData.push(
					{
						val: iTempIndex,
						label: apo.setting.i18n.veryShortDays[iTempIndex]
					});
				}
			}
			else if(sCompFormat === "DDD")
			{
				for(iTempIndex = 0; iTempIndex < $.AnyPicker.extra.en.shortDays.length; iTempIndex++)
				{
					oArrData.push(
					{
						val: iTempIndex,
						label: apo.setting.i18n.shortDays[iTempIndex]
					});
				}
			}
			else if(sCompFormat === "DDDD")
			{
				for(iTempIndex = 0; iTempIndex < $.AnyPicker.extra.en.fullDays.length; iTempIndex++)
				{
					oArrData.push(
					{
						val: iTempIndex,
						label: apo.setting.i18n.fullDays[iTempIndex]
					});
				}
			}
		}
		else if(sCompName === "date")
		{
			iDaysOfMonth = 31;
		
			iStartValue = 1;
			iEndValue = iDaysOfMonth;
			if($.CF.isValid(oMin) && $.CF.isValid(oMax))
			{
				if((oMin.y === oMax.y) && (oMin.M === oMax.M))
				{
					iStartValue = oMin.d;
					iEndValue = oMax.d;
				}
			}

			for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex++)
			{
				if(sCompFormat === "d")
					iChars = 0;
				else if(sCompFormat === "dd")
					iChars = 2;

				oArrData.push(
				{
					val: iTempIndex,
					label: apo.getNumberStringInFormat(iTempIndex, iChars, true)
				});
			}
		}
		else if(sCompName === "month")
		{
			iStartValue = 1;
			iEndValue = 12;
			if($.CF.isValid(oMin) && $.CF.isValid(oMax))
			{
				if(oMin.y === oMax.y)
				{
					iStartValue = oMin.M;
					iEndValue = oMax.M;

					if(sCompFormat === "M" || sCompFormat === "MM")
					{
						iStartValue++;
						iEndValue++;
					}
				}
			}

			if(sCompFormat === "M" || sCompFormat === "MM")
			{
				if(sCompFormat === "M")
					iChars = 0;
				else if(sCompFormat === "MM")
					iChars = 2;

				for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex++)
				{
					oArrData.push(
					{
						val: (iTempIndex - 1),
						label: apo.getNumberStringInFormat(iTempIndex, iChars, true)
					});
				}
			}
			else if(sCompFormat === "MMM")
			{
				for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex++)
				{
					oArrData.push(
					{
						val: (iTempIndex - 1),
						label: apo.setting.i18n.shortMonths[iTempIndex - 1]
					});
				}
			}
			else if(sCompFormat === "MMMM")
			{
				for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex++)
				{
					oArrData.push(
					{
						val: (iTempIndex - 1),
						label: apo.setting.i18n.fullMonths[iTempIndex - 1] 
					});
				}
			}
		}
		else if(sCompName === "year")
		{
			iTotalYears = (apo.setting.maxRows === 0) ? 50 : apo.setting.maxRows;
			iStepYears = Math.floor(iTotalYears / 2);
		
			if($.CF.isValid(oMin))
				iStartValue = oMin.y;
			else
				iStartValue = (iTotalYears % 2 === 0) ? (oSelectedDate.y - iStepYears - 1) : (oSelectedDate.y - iStepYears);
		
			if($.CF.isValid(oMax))
				iEndValue = oMax.y;
			else
				iEndValue = (oSelectedDate.y + iStepYears);
		
			for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex++)
			{
				oArrData.push(
				{
					val: iTempIndex,
					label: apo.getNumberStringInFormat(iTempIndex, 0, true)
				});
			}
		}
		else if(sCompName === "hours")
		{
			var iArrHourValues = [],
			iStartHour = 0;

			if(!apo.setting.roundOff)
			{
				iStartHour = oSelectedDate.H;
				while((iStartHour - apo.setting.intervals.h) >= 0)
					iStartHour -= apo.setting.intervals.h;
			}

			if(sCompFormat === "h" || sCompFormat === "hh")
			{
				iArrHourValues = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

				iStartHour = iStartHour % 12;
				iStartHour = (iStartHour === 0) ? 12 : iStartHour;
				iStartValue = iArrHourValues.indexOf(iStartHour);
				iEndValue = 11;
			}
			else if(sCompFormat === "H" || sCompFormat === "HH")
			{
				iStartValue = iStartHour;
				iEndValue = 23;
			}

			if(sCompFormat === "h" || sCompFormat === "H")
				iChars = 0;
			else if(sCompFormat === "hh" || sCompFormat === "HH")
				iChars = 2;

			for(iTempIndex = iStartValue; iTempIndex <= iEndValue; iTempIndex = (iTempIndex + apo.setting.intervals.h))
			{
				if(sCompFormat === "h" || sCompFormat === "hh")
				{
					oArrData.push(
					{
						val: iArrHourValues[iTempIndex],
						label: apo.getNumberStringInFormat(iArrHourValues[iTempIndex], iChars, true)
					});
				}
				else if(sCompFormat === "H" || sCompFormat === "HH")
				{
					oArrData.push(
					{
						val: iTempIndex,
						label: apo.getNumberStringInFormat(iTempIndex, iChars, true)
					});
				}
			}
		}
		else if(sCompName === "minutes")
		{
			var iStartMinute = 0;
			if(!apo.setting.roundOff)
			{
				iStartMinute = oSelectedDate.m;
				while((iStartMinute - apo.setting.intervals.m) >= 0)
					iStartMinute -= apo.setting.intervals.m;
			}

			if(sCompFormat === "m")
				iChars = 0;
			else if(sCompFormat === "mm")
				iChars = 2;
		
			for(iTempIndex = iStartMinute; iTempIndex < 60; iTempIndex = (iTempIndex + apo.setting.intervals.m))
			{
				oArrData.push(
				{
					val: iTempIndex,
					label: apo.getNumberStringInFormat(iTempIndex, iChars, true) 
				});
			}
		}
		else if(sCompName === "seconds")
		{
			var iStartSeconds = 0;
			if(!apo.setting.roundOff)
			{
				iStartSeconds = oSelectedDate.s;
				while((iStartSeconds - apo.setting.intervals.s) >= 0)
					iStartSeconds -= apo.setting.intervals.s;
			}

			if(sCompFormat === "s")
				iChars = 0;
			else if(sCompFormat === "ss")
				iChars = 2;
		
			for(iTempIndex = iStartSeconds; iTempIndex < 60; iTempIndex = (iTempIndex + apo.setting.intervals.s))
			{
				oArrData.push(
				{
					val: iTempIndex,
					label: apo.getNumberStringInFormat(iTempIndex, iChars, true)
				});
			}
		}
		else if(sCompName === "meridiem")
		{
			for(iTempIndex = 0; iTempIndex < 2; iTempIndex++)
			{
				oArrData.push(
				{
					val: iTempIndex,
					label: apo.setting.i18n.meridiem[sCompFormat][iTempIndex]
				});
			}
		}

		return oArrData;
	},

	_setDateTimeFormatComponentsArray: function(sDateTimeFormat)
	{
		var apo = this;
		var sArrDateTimeFormat = apo._matchRegex($.AnyPicker.extra.sFormatRegex, sDateTimeFormat);
	
		//----------------- Code to concatenate separators Start -------------------
		var iTempIndex, sPrevFormat = "", sArrTempFormat = [];
		for(iTempIndex = 0; iTempIndex < sArrDateTimeFormat.length; iTempIndex++)
		{
			var sTempFormat = sArrDateTimeFormat[iTempIndex];
			if(sTempFormat.match(/[a-zA-Z0-9]/))
			{
				if(sPrevFormat !== "")
				{
					sArrTempFormat.push(sPrevFormat);
					sPrevFormat = "";
				}
				sArrTempFormat.push(sTempFormat);
			}
			else
				sPrevFormat += sTempFormat;
		}
		if(sPrevFormat !== "")
		{
			sArrTempFormat.push(sPrevFormat);
			sPrevFormat = "";
		}
		return sArrTempFormat;
	},

	_createDateTimeRegex: function(sArrDateTimeFormat)
	{
		var apo = this;
		var iTempIndex, sFormat,
		sInRegex = "", sOutRegex = "",
		sRegexStart = "(\\[[^\\[]*\\])|(\\\\)?",
		sRegexEnd = "|.",
		sDateTimeRegex;

		sInRegex += sRegexStart;
		for(iTempIndex = 0; iTempIndex < sArrDateTimeFormat.length; iTempIndex++)
		{
			sFormat = sArrDateTimeFormat[iTempIndex];
			sInRegex = apo._getRegexComponentForFormat(sInRegex, sFormat);
		}
		sInRegex += sRegexEnd;
		sDateTimeRegex = new RegExp(sInRegex, "g");
		return sDateTimeRegex;
	},

	_getRegexComponentForFormat: function(sInRegex, sFormat)
	{
		var apo = this;

		//removed code with \b, because it was causing RegExp matching to break while using Unicode Characters. as \b and \w enforce restriction on characters be a subset of [A-Z,a-z,0-9]

		if(sFormat === "d" || sFormat === "dd")
		{
			sInRegex += "(\\d{1,2})";
		}
		else if(sFormat === "DD")
		{	
			/*
			sInRegex += "(\\b";
			sInRegex += apo.setting.i18n.veryShortDays.join("\\b|\\b");
			sInRegex += "\\b)";
			*/
			sInRegex += "(";
			sInRegex += apo.setting.i18n.veryShortDays.join("|");
			sInRegex += ")";
		}
		else if(sFormat === "DDD")
		{
			sInRegex += "(";
			sInRegex += apo.setting.i18n.shortDays.join("|");
			sInRegex += ")";
		}
		else if(sFormat === "DDDD")
		{
			sInRegex += "(";
			sInRegex += apo.setting.i18n.fullDays.join("|");
			sInRegex += ")";
		}
		else if(sFormat === "M" || sFormat === "MM")
		{
			sInRegex += "(\\d{1,2})";
		}
		else if(sFormat === "MMM")
		{
			sInRegex += "(";
			sInRegex += apo.setting.i18n.shortMonths.join("|");
			sInRegex += ")";
		}
		else if(sFormat === "MMMM")
		{
			/*
			sInRegex += "(\\b";
			sInRegex += apo.setting.i18n.fullMonths.join("\\b|\\b");
			sInRegex += "\\b)";
			*/
			sInRegex += "(";
			sInRegex += apo.setting.i18n.fullMonths.join("|");
			sInRegex += ")";
		}
		else if($.CF.compareStrings(sFormat, "y") || $.CF.compareStrings(sFormat, "yyyy"))
		{
			sInRegex += "(\\d{1,4})";
		}
		else if($.CF.compareStrings(sFormat, "yy"))
		{
			sInRegex += "(\\d{2})";
		}
		else if($.CF.compareStrings(sFormat, "h") || $.CF.compareStrings(sFormat, "hh"))
		{
			sInRegex += "(\\d{1,2})";
		}
		else if(sFormat === "m" || sFormat === "mm")
		{
			sInRegex += "(\\d{1,2})";
		}
		else if(sFormat === "s" || sFormat === "ss")
		{
			sInRegex += "(\\d{1,2})";
		}
		else if(sFormat === "a" || sFormat === "aa" || sFormat === "A" || sFormat === "AA")
		{
			sInRegex += "(";

			if(sFormat === "a")
				sInRegex += apo.setting.i18n.meridiem.a.join("|");
			else if(sFormat === "aa")
				sInRegex += apo.setting.i18n.meridiem.aa.join("|");
			else if(sFormat === "A")
				sInRegex += apo.setting.i18n.meridiem.A.join("|");
			else if(sFormat === "AA")
				sInRegex += apo.setting.i18n.meridiem.AA.join("|");

			sInRegex += ")";
		}
		else if(sFormat === "/" || sFormat === "-" || sFormat === "." || sFormat === " " || sFormat === ":" || sFormat === ",")
		{
			//sInRegex += "(\\b" +sFormat + "\\b)";
			sInRegex += "(/|-|.| |:|,)";
		}
		else
		{
			//sInRegex += "(\\b" +sFormat + "\\b)";
			sInRegex += "(" + sFormat + ")";
		}

		return sInRegex;
	},

	_matchRegex: function(sRegex, sString)
	{
		var apo = this;
		var sArrOut = [], sArrString = [];
	
		while((sArrString = sRegex.exec(sString)) !== null) 
		{
			for(var iTempIndex = 3; iTempIndex < sArrString.length; iTempIndex++)
    		{
    			sArrOut.push(sArrString[iTempIndex]);
    		}
    		if(sArrString.index === sRegex.lastIndex) 
    		{
        		sRegex.lastIndex++;
    		}
		}

		return sArrOut;
	},

	_parseInputDateTime: function(sDate)
	{
		var apo = this;
		var oThisDate = null, oDate = {},
		iTempIndex, sFormat, sDTComp,
		iArrDateTimeComps, sDateTimeRegex, iArrDateTimeFormatComps;

		if(typeof sDate === "string")
		{
			iArrDateTimeFormatComps =  apo.tmp.diffDateTimeFormats ? apo.tmp.sArrInputDateTimeFormat : apo.tmp.sArrDateTimeFormat;
			sDateTimeRegex =  apo.tmp.diffDateTimeFormats ? apo.tmp.sInputDateTimeRegex : apo.tmp.sDateTimeRegex;
			iArrDateTimeComps = apo._matchRegex(sDateTimeRegex, sDate);
		
			for(iTempIndex = 0; iTempIndex < iArrDateTimeFormatComps.length; iTempIndex++)
			{
				sFormat = iArrDateTimeFormatComps[iTempIndex];
				sDTComp = iArrDateTimeComps[iTempIndex];

				if(sFormat.search(/D|d|M|y|Y|H|h|m|s|A|a/, "") !== -1)
					oDate = apo._setInputDateTimeValue(sFormat, sDTComp, oDate);
			}

			if($.CF.isValid(oDate.h))
			{
				if(($.CF.compareStrings(oDate.me, "AM") || $.CF.compareStrings(oDate.sm, "A")) && oDate.h === 12)
					oDate.H = 0;
				else if(($.CF.compareStrings(oDate.me, "PM") || $.CF.compareStrings(oDate.sm, "P")) && oDate.h < 12)
					oDate.H = oDate.h + 12;
				else
					oDate.H = oDate.h;
			}
			
			oThisDate = apo.setDateInFormat({"iDate": oDate}, "");
		}
		else if(Object.prototype.toString.call(sDate) === "[object Date]")
		{
			oThisDate = new Date(sDate);
		}
	
		return oThisDate;
	},

	_setInputDateTimeValue: function(sDateTimeFormat, sDateTimeValue, oThisDate)
	{
		var apo = this;

		if(apo._isSupportedFormat(sDateTimeFormat))
		{
			if(sDateTimeFormat === "d" || sDateTimeFormat === "dd")
			{
				oThisDate.d = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "M" || sDateTimeFormat === "MM")
			{
				oThisDate.M = parseInt(sDateTimeValue) - 1;
			}
			else if(sDateTimeFormat === "MMM")
			{
				oThisDate.M = apo.setting.i18n.shortMonths.indexOf(sDateTimeValue);
			}
			else if(sDateTimeFormat === "MMMM")
			{
				oThisDate.M = apo.setting.i18n.fullMonths.indexOf(sDateTimeValue);
			}
			else if($.CF.compareStrings(sDateTimeFormat, "yy"))
			{
				oThisDate.y = parseInt(sDateTimeValue);

				var iMaxPrefix = (apo.setting.maxYear / 100), // first two digits of the year
				iMaxSuffix = (apo.setting.maxYear % 100); // last two digits of the year
			
				if(oThisDate.y > iMaxSuffix)
					oThisDate.y = ((iMaxPrefix - 1) * 100) + oThisDate.y;
				else
					oThisDate.y = (iMaxPrefix * 100) + oThisDate.y;
			}
			else if($.CF.compareStrings(sDateTimeFormat, "y") || $.CF.compareStrings(sDateTimeFormat, "yyyy"))
			{
				oThisDate.y = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "H" || sDateTimeFormat === "HH")
			{
				oThisDate.H = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "h" || sDateTimeFormat === "hh")
			{
				oThisDate.h = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "m" || sDateTimeFormat === "mm")
			{
				oThisDate.m = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "s" || sDateTimeFormat === "ss")
			{
				oThisDate.s = parseInt(sDateTimeValue);
			}
			else if(sDateTimeFormat === "a" || sDateTimeFormat === "A")
			{
				if($.CF.isValid(sDateTimeValue))
				{
					if(sDateTimeValue.search(/A/gi, "") !== -1)
						oThisDate.me = "A";
					else if(sDateTimeValue.search(/P/gi, "") !== -1)
						oThisDate.me = "P";
				}
			}
			else if(sDateTimeFormat === "aa" || sDateTimeFormat === "AA")
			{
				if($.CF.isValid(sDateTimeValue))
				{
					if(sDateTimeValue.search(/AM/gi, "") !== -1)
						oThisDate.me = "AM";
					else if(sDateTimeValue.search(/PM/gi, "") !== -1)
						oThisDate.me = "PM";
				}
			}
		}
	
		return oThisDate;
	},

	// Public Method
	formatOutputDates: function(dDate, oFormat)
	{
		var apo = this;
		var sOutput = "", sFormat, iTempIndex,
		sArrFormat, oDate;

		if($.CF.isValid(oFormat))
		{
			if(typeof oFormat === "string")
				sArrFormat = apo._setDateTimeFormatComponentsArray(oFormat);
			else if(typeof oFormat === "object")
				sArrFormat = oFormat;
			else
				sArrFormat = (apo.tmp.diffDateTimeFormats ? apo.tmp.sArrInputDateTimeFormat : apo.tmp.sArrDateTimeFormat);
		}
		else
			sArrFormat = (apo.tmp.diffDateTimeFormats ? apo.tmp.sArrInputDateTimeFormat : apo.tmp.sArrDateTimeFormat);

		oDate = apo.getDateObject(dDate);

		for(iTempIndex = 0; iTempIndex < sArrFormat.length; iTempIndex++)
		{
			sFormat = sArrFormat[iTempIndex];

			if(sFormat === "dd")
			{
				sOutput += apo.getNumberStringInFormat(oDate.d, 2, true);
			}
			else if(sFormat === "d")
			{
				sOutput += apo.getNumberStringInFormat(oDate.d, 0, true);
			}
			else if(sFormat === "DDDD")
			{
				sOutput += apo.setting.i18n.fullDays[oDate.D];
			}
			else if(sFormat === "DDD")
			{
				sOutput += apo.setting.i18n.shortDays[oDate.D];
			}
			else if(sFormat === "DD")
			{
				sOutput += apo.setting.i18n.veryShortDays[oDate.D];
			}
			else if(sFormat === "MMMM")
			{
				sOutput += apo.setting.i18n.fullMonths[oDate.M];
			}
			else if(sFormat === "MMM")
			{
				sOutput += apo.setting.i18n.shortMonths[oDate.M];
			}
			else if(sFormat === "MM")
			{
				sOutput += apo.getNumberStringInFormat((oDate.M + 1), 2, true);
			}
			else if(sFormat === "M")
			{
				sOutput += apo.getNumberStringInFormat((oDate.M + 1), 0, true);
			}
			else if($.CF.compareStrings(sFormat, "yyyy"))
			{
				sOutput += apo.getNumberStringInFormat(oDate.y, 4, true);
			}
			else if($.CF.compareStrings(sFormat, "yy"))
			{
				var iYear = ((Math.floor(oDate.y / 10) % 10) * 10) + (oDate.y % 10);
				sOutput += apo.getNumberStringInFormat(iYear, 2, true);
			}
			else if($.CF.compareStrings(sFormat, "y"))
			{
				sOutput += apo.getNumberStringInFormat(oDate.y, 4, true);
			}
			else if(sFormat === "hh")
			{
				sOutput += apo.getNumberStringInFormat(oDate.h, 2, true);
			}
			else if(sFormat === "h")
			{
				sOutput += apo.getNumberStringInFormat(oDate.h, 0, true);
			}
			else if(sFormat === "HH")
			{
				sOutput += apo.getNumberStringInFormat(oDate.H, 2, true);
			}
			else if(sFormat === "H")
			{
				sOutput += apo.getNumberStringInFormat(oDate.H, 0, true);
			}
			else if(sFormat === "mm")
			{
				sOutput += apo.getNumberStringInFormat(oDate.m, 2, true);
			}
			else if(sFormat === "m")
			{
				sOutput += apo.getNumberStringInFormat(oDate.m, 0, true);
			}
			else if(sFormat === "ss")
			{
				sOutput += apo.getNumberStringInFormat(oDate.s, 2, true);
			}
			else if(sFormat === "s")
			{
				sOutput += apo.getNumberStringInFormat(oDate.s, 0, true);
			}
			else if(sFormat === "aa")
			{
				sOutput += oDate.me;
			}
			else if(sFormat === "a")
			{
				sOutput += oDate.sm;
			}
			else if(sFormat === "AA")
			{
				sOutput += oDate.me.toUpperCase();
			}
			else if(sFormat === "A")
			{
				sOutput += oDate.sm.toUpperCase();
			}
			else
			{
				sOutput += sFormat;
			}
		}

		return sOutput;
	},

	// Public Method
	parseDisableValues: function()
	{
		var apo = this;
		apo.tmp.oMinMax = 
		{
			min: null,
			max: null
		};
		apo.tmp.oArrPDisable = 
		{
			day: [],
			date: [],
			time: [],
			datetime: []
		};
		var iTempIndex, iTempIndex1, iTempIndex2;

		if($.CF.isValid(apo.setting.minValue))
		{
			var dMin = apo._parseInputDateTime(apo.setting.minValue);
			if($.CF.isValid(dMin))
				apo.tmp.oMinMax.min = dMin;
		}
		if($.CF.isValid(apo.setting.maxValue))
		{
			var dMax = apo._parseInputDateTime(apo.setting.maxValue);
			if($.CF.isValid(dMax))
				apo.tmp.oMinMax.max = dMax;
		}


		var bIsOutOfBounds = false;
		if($.CF.isValid(apo.tmp.oMinMax.min) && $.CF.isValid(apo.tmp.oMinMax.max))
		{
			if(apo.tmp.sDateTimeMode === "date")
			{
				if(!(apo.compareDates(apo.tmp.selectedDate, apo.tmp.oMinMax.min) >= 1 && apo.compareDates(apo.tmp.selectedDate, apo.tmp.oMinMax.max) <= -1))
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "time")
			{
				if(!(apo.compareTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.min) >= 1 && apo.compareTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.max) <= -1))
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "datetime")
			{
				if(!(apo.compareDateTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.min) >= 1 && apo.compareDateTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.max) <= -1))
					bIsOutOfBounds = true;
			}

			if(bIsOutOfBounds)
			{
				apo.setting.selectedDate = new Date(apo.tmp.oMinMax.min);
				apo.tmp.selectedDate = new Date(apo.tmp.oMinMax.min);
			}
		}
		else if($.CF.isValid(apo.tmp.oMinMax.min))
		{
			if(apo.tmp.sDateTimeMode === "date")
			{
				if(apo.compareDates(apo.tmp.selectedDate, apo.tmp.oMinMax.min) < -1)
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "time")
			{
				if(apo.compareTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.min) < -1)
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "datetime")
			{
				if(apo.compareDateTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.min) < -1)
					bIsOutOfBounds = true;
			}

			if(bIsOutOfBounds)
			{
				apo.setting.selectedDate = new Date(apo.tmp.oMinMax.min);
				apo.tmp.selectedDate = new Date(apo.tmp.oMinMax.min);
			}
		}
		else if($.CF.isValid(apo.tmp.oMinMax.max))
		{
			if(apo.tmp.sDateTimeMode === "date")
			{
				if(apo.compareDates(apo.tmp.selectedDate, apo.tmp.oMinMax.max) > 1)
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "time")
			{
				if(apo.compareTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.max) > 1)
					bIsOutOfBounds = true;
			}
			else if(apo.tmp.sDateTimeMode === "datetime")
			{
				if(apo.compareDateTimes(apo.tmp.selectedDate, apo.tmp.oMinMax.max) > 1)
					bIsOutOfBounds = true;
			}

			if(bIsOutOfBounds)
			{
				apo.setting.selectedDate = new Date(apo.tmp.oMinMax.max);
				apo.tmp.selectedDate = new Date(apo.tmp.oMinMax.max);
			}
		}

		if(apo.tmp.sDateTimeMode === "date")
			apo.tmp.oArrPDisable.date.push(apo.tmp.oMinMax);
		else if(apo.tmp.sDateTimeMode === "time")
			apo.tmp.oArrPDisable.time.push({day: [], val: [apo.tmp.oMinMax]});
		else if(apo.tmp.sDateTimeMode === "datetime")
			apo.tmp.oArrPDisable.datetime.push(apo.tmp.oMinMax);

		if($.CF.isValid(apo.setting.disableValues))
		{
			// Parse Days
			if($.CF.isValid(apo.setting.disableValues.day) && apo.setting.disableValues.day.length > 0)
			{
				for(iTempIndex = 0; iTempIndex < apo.setting.disableValues.day.length; iTempIndex++)
				{
					if(apo.setting.disableValues.day[iTempIndex] >= 0 && apo.setting.disableValues.day[iTempIndex] <= 6)
					{
						apo.tmp.oArrPDisable.day.push(apo.setting.disableValues.day[iTempIndex]);
					}
				}
			}

			// Parse Dates
			if($.CF.isValid(apo.setting.disableValues.date) && apo.setting.disableValues.date.length > 0)
			{
				for(iTempIndex = 0; iTempIndex < apo.setting.disableValues.date.length; iTempIndex++)
				{
					var oDate = apo.setting.disableValues.date[iTempIndex],
					oOutDate = null;

					if($.CF.isValid(oDate.val))
					{
						var oDateVal = apo._parseInputDateTime(oDate.val);
						if($.CF.isValid(oDateVal))
						{
							if(oOutDate === null)
								oOutDate = {};
							oOutDate.val = oDateVal;
						}
					}
					if($.CF.isValid(oDate.start))
					{
						var oDateStart = apo._parseInputDateTime(oDate.start);
						if($.CF.isValid(oDateStart))
						{
							if(oOutDate === null)
								oOutDate = {};
							oOutDate.start = oDateStart;
						}
					}
					if($.CF.isValid(oDate.end))
					{
						var oDateEnd = apo._parseInputDateTime(oDate.end);
						if($.CF.isValid(oDateEnd))
						{
							if(oOutDate === null)
								oOutDate = {};
							oOutDate.end = oDateEnd;
						}
					}

					if($.CF.isValid(oOutDate))
						apo.tmp.oArrPDisable.date.push(oOutDate);
				}
			}

			// Parse Times
			if($.CF.isValid(apo.setting.disableValues.time) && apo.setting.disableValues.time.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.setting.disableValues.time.length; iTempIndex1++)
				{
					var oDayTime = apo.setting.disableValues.time[iTempIndex1],
					bIsValidDay = $.CF.isValid(oDayTime.day) && (oDayTime.day.length > 0),
					bIsValidVal = $.CF.isValid(oDayTime.val) && (oDayTime.val.length > 0);

					if(bIsValidVal)
					{
						var oArrTimes = [];
						for(iTempIndex2 = 0; iTempIndex2 < oDayTime.val.length; iTempIndex2++)
						{
							var oTime = oDayTime.val[iTempIndex2],
							oOutTime = null;

							if($.CF.isValid(oTime.val))
							{
								var oTimeVal = apo._parseInputDateTime(oTime.val);
								if($.CF.isValid(oTimeVal))
								{
									if(oOutTime === null)
										oOutTime = {};
									oOutTime.val = oTime;									
								}
							}
							if($.CF.isValid(oTime.start))
							{
								var oTimeStart = apo._parseInputDateTime(oTime.start);
								if($.CF.isValid(oTimeStart))
								{
									if(oOutTime === null)
										oOutTime = {};
									oOutTime.start = oTimeStart;
								}
							}
							if($.CF.isValid(oTime.end))
							{
								var oTimeEnd = apo._parseInputDateTime(oTime.end);
								if($.CF.isValid(oTimeEnd))
								{
									if(oOutTime === null)
										oOutTime = {};
									oOutTime.end = oTimeEnd;	
								}
							}

							if($.CF.isValid(oOutTime))
								oArrTimes.push(oOutTime);
						}

						if(oArrTimes.length > 0)
						{
							apo.tmp.oArrPDisable.time.push(
							{
								day: (bIsValidDay ? oDayTime.day : []),
								val: oArrTimes
							});
						}
					}
				}
			}

			// Parse DateTimes
			if($.CF.isValid(apo.setting.disableValues.datetime) && apo.setting.disableValues.datetime.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.setting.disableValues.datetime.length; iTempIndex1++)
				{
					var oDateTime = apo.setting.disableValues.datetime[iTempIndex1],
					oOutDateTime = null;
				
					if($.CF.isValid(oDateTime.val))
					{
						var oDateTimeVal = apo._parseInputDateTime(oDateTime.val);
						if($.CF.isValid(oDateTimeVal))
						{
							if(oOutDateTime === null)
								oOutDateTime = {};
							oOutDateTime.val = oDateTimeVal;
						}
					}
					if($.CF.isValid(oDateTime.start))
					{
						var oDateTimeStart = apo._parseInputDateTime(oDateTime.start);
						if($.CF.isValid(oDateTimeStart))
						{
							if(oOutDateTime === null)
								oOutDateTime = {};
							oOutDateTime.start = oDateTimeStart;
						}
					}
					if($.CF.isValid(oDateTime.end))
					{
						var oDateTimeEnd = apo._parseInputDateTime(oDateTime.end);
						if($.CF.isValid(oDateTimeEnd))
						{
							if(oOutDateTime === null)
								oOutDateTime = {};
							oOutDateTime.end = oDateTimeEnd;
						}
					}

					if($.CF.isValid(oOutDateTime))
						apo.tmp.oArrPDisable.datetime.push(oOutDateTime);
				}
			}
		}
		else
			console.log("Invalid value for AnyPicker plugin option disableValues");
	},

	__setSelectedDateTimeInComponent: function()
	{
		var apo = this;
		var iTempIndex, oComp, sValue = "", iChars, 
		oSelectedDate = apo.getDateObject(apo.tmp.selectedDate);
	
		for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{			
			oComp = apo.setting.components[iTempIndex];

			if(oComp.name === "date")
			{
				sValue = oSelectedDate.d;
			}
			else if(oComp.name === "day")
			{
				sValue = oSelectedDate.D;
			}
			else if(oComp.name === "month")
			{
				sValue = oSelectedDate.M;
			}
			else if(oComp.name === "year")
			{
				sValue = oSelectedDate.y;
			}
			else if(oComp.name === "hours")
			{
				if(oComp.format === "h" || oComp.format === "hh")
					sValue = oSelectedDate.h;
				else if(oComp.format === "H" || oComp.format === "HH")
					sValue = oSelectedDate.H;
			}
			else if(oComp.name === "minutes")
			{
				sValue = oSelectedDate.m;
			}
			else if(oComp.name === "seconds")
			{
				sValue = oSelectedDate.s;
			}
			else if(oComp.name === "meridiem")
			{
				if(oSelectedDate.sm === "a")
					sValue = 0;
				else if(oSelectedDate.sm === "p")
					sValue = 1;
			}

			apo.__changeComponentValue(iTempIndex, sValue);
		}
	},

	__disableInvalidRowsOfDateTimePicker: function()
	{
		var apo = this;
		var iTempIndex1, iTempIndex2, iTempIndex3, iTempIndex4,
		oArrValues = [], sValue, oArrSelectedValues,
		oComp, sCompName, sCompFormat, oData;

		if(apo.tmp.numOfComp === 1)
		{
			oComp = apo.setting.components[0];
			sCompName = oComp.name;
			sCompFormat = oComp.format;
			oData = apo.setting.dataSource[0].data;

			if(sCompName === "day")
			{
				for(iTempIndex1 = 0; iTempIndex1 < oData.length; iTempIndex1++)
				{
					for(iTempIndex2 = 0; iTempIndex2 < apo.tmp.oArrPDisable.day.length; iTempIndex2++)
					{
						if(apo.tmp.oArrPDisable.day[iTempIndex2] === oData[iTempIndex2].val)
						{
							$(apo.elem).find("#ap-row-0-" + iTempIndex1).addClass("ap-row-disabled ap-row-invalid");
						}
					}
				}	
			}
		}
		else
		{
			oArrSelectedValues = apo.__getSelectedDate(true)[1];
			
			for(iTempIndex1 = 0; iTempIndex1 < apo.setting.dataSource.length; iTempIndex1++) // change values of one component (dataSource)
			{
				var oData1 = apo.setting.dataSource[iTempIndex1];

				for(iTempIndex2 = 0; iTempIndex2 < oData1.data.length; iTempIndex2++) // dataSource.data values
				{
					var oDateToValidate = {
									d: 1,
									M: 0,
									y: 0,
									H: 0,
									h: 0,
									m: 0,
									s: 0,
									sm: 0
								};

					for(iTempIndex3 = 0; iTempIndex3 < apo.tmp.numOfComp; iTempIndex3++) // set selected values
					{
						if(iTempIndex3 === iTempIndex1)
						{
							sValue =  oData1.data[iTempIndex2].val;

							oComp = apo.setting.components[iTempIndex3];
							sCompName = oComp.name;
							sCompFormat = oComp.format;
						}
						else
						{
							sValue = oArrSelectedValues[iTempIndex3];

							oComp = apo.setting.components[iTempIndex3];
							sCompName = oComp.name;
							sCompFormat = oComp.format;
						}
						
						if(sCompName === "date")
						{
							oDateToValidate.d = parseInt(sValue);
						}
						else if(sCompName === "month")
						{
							oDateToValidate.M = parseInt(sValue); // parseInt(sValue) - 1
						}
						else if(sCompName === "year")
						{
							oDateToValidate.y = parseInt(sValue);
						}
						else if(sCompName === "hours")
						{
							if(sCompFormat === "h" || sCompFormat === "hh")
							{
								oDateToValidate.h = parseInt(sValue);
								oDateToValidate.H = -1;
							}
							else if(sCompFormat === "H" || sCompFormat === "HH")
							{
								oDateToValidate.H = parseInt(sValue);
							}
						}
						else if(sCompName === "minutes")
						{
							oDateToValidate.m = parseInt(sValue);
						}
						else if(sCompName === "seconds")
						{
							oDateToValidate.s = parseInt(sValue);
						}
						else if(sCompName === "meridiem")
						{
							oDateToValidate.sm = parseInt(sValue);
						}
					}

					if(oDateToValidate.H === -1)
					{
						oDateToValidate.H = (oDateToValidate.sm === 1) ? ((oDateToValidate.h === 12) ? 12 : (oDateToValidate.h + 12)) : ((oDateToValidate.h === 12) ? 0 : oDateToValidate.h);
					}

					var dNewSelectedDate = apo.setDateInFormat({"iDate": oDateToValidate}, "");
					var bValidDate = apo.__validateSelectedDate(dNewSelectedDate, true, false);
					if(!bValidDate)
					{
						$("#ap-component-" + iTempIndex1).find("#ap-row-" + iTempIndex1 + "-" + iTempIndex2).addClass("ap-row-disabled ap-row-invalid");
					}
				}
			}
		}
	},

	__getSelectedDate: function(bGetObject)
	{
		var apo = this;

		var iTempIndex, oComp, oArrSelected, oElemSelected, iValue,
		oNewSelectedDate = apo.getDateObject(apo.tmp.selectedDate),
		dNewSelectedDate = {}, iMeridiem = 0, oArrSelectedValues = [];
	
		for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{
			oComp = apo.setting.components[iTempIndex];
			oArrSelected = $(apo.tmp.overlaySelector).find("#ap-component-" + iTempIndex + " .ap-row-selected");
			oElemSelected = (oArrSelected.length > 0) ? oArrSelected[0] : null;

			iValue = parseInt($(oElemSelected).data('value'));
			oArrSelectedValues.push(iValue);
			if(oComp.name === "date")
			{
				oNewSelectedDate.d = isNaN(iValue) ? oNewSelectedDate.d : iValue;
			}
			else if(oComp.name === "day")
			{
				oNewSelectedDate.D = isNaN(iValue) ? oNewSelectedDate.D : iValue;
			}
			else if(oComp.name === "month")
			{
				oNewSelectedDate.M = isNaN(iValue) ? oNewSelectedDate.M : iValue;
			}
			else if(oComp.name === "year")
			{
				oNewSelectedDate.y = isNaN(iValue) ? oNewSelectedDate.y : iValue;
			}
			else if(oComp.name === "hours")
			{
				if(oComp.format === "h" || oComp.format === "hh")
				{
					oNewSelectedDate.h = isNaN(iValue) ? oNewSelectedDate.h : iValue;
					oNewSelectedDate.H = -1;
				}
				else
					oNewSelectedDate.H = isNaN(iValue) ? oNewSelectedDate.H : iValue;
			}
			else if(oComp.name === "minutes")
			{
				oNewSelectedDate.m = isNaN(iValue) ? oNewSelectedDate.m : iValue;
			}
			else if(oComp.name === "seconds")
			{
				oNewSelectedDate.s = isNaN(iValue) ? oNewSelectedDate.s : iValue;
			}
			else if(oComp.name === "meridiem")
			{
				iMeridiem = isNaN(iValue) ? (oNewSelectedDate.sm === "a" ? 0 : 1) : iValue;
			}
		}

		if(oNewSelectedDate.H === -1)
		{
			oNewSelectedDate.H = (iMeridiem === 1) ? ((oNewSelectedDate.h === 12) ? 12 : (oNewSelectedDate.h + 12)) : ((oNewSelectedDate.h === 12) ? 0 : oNewSelectedDate.h);
		}

		var iNoOfDays = apo._getNumberOfDaysOfMonth(oNewSelectedDate.M, oNewSelectedDate.y);
		if(oNewSelectedDate.d > iNoOfDays)
			oNewSelectedDate.d = iNoOfDays;

		dNewSelectedDate = apo.setDateInFormat({"iDate": oNewSelectedDate}, "");
		if(bGetObject)
			return [dNewSelectedDate, oArrSelectedValues];
		else
			return dNewSelectedDate;
	},

	/*

	1. Get New selectedDate based on the selected values in the Picker Components.
	2. Check whether new selectedDate is equal to or is in the range of disable date/time/datetimes
	3. If selectedDate matches disableDates then select previous value of selectedDate

	*/
	__validateSelectedDate: function(dNewSelectedDate, bReturnResult, bIsBefore)
	{
		var apo = this;

		var oNewSelectedDate = apo.getDateObject(dNewSelectedDate);

		if($.CF.isValid(apo.tmp.oArrPDisable))
		{
			var iTempIndex1, iTempIndex2,
			bHasDateComponent = (apo.tmp.sDateTimeMode === "datetime" || apo.tmp.sDateTimeMode === "date"),
			bHasTimeComponent = (apo.tmp.sDateTimeMode === "datetime" || apo.tmp.sDateTimeMode === "time"),
			bInvalidSelected = false,
			bResult = true,
			bLTMin, bGTMax, bDirIsBefore, oDateRecord, oTimeRecord;
		
			// -----------------------------------------------------------------
		
			// Validate Day

			if(!bInvalidSelected && bHasDateComponent && apo.tmp.oArrPDisable.day.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.tmp.oArrPDisable.day.length; iTempIndex1++)
				{
					if(apo.tmp.oArrPDisable.day[iTempIndex1] === oNewSelectedDate.D)
					{
						if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
						{
							bInvalidSelected = true;
							dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, dNewSelectedDate, "day");
							apo.tmp.selectedDate = new Date(dNewSelectedDate);
							apo.__scrollToSelectedRow();
						}
						else
						{
							if(bReturnResult)
								bResult = false;
							else
								apo.__scrollToSelectedRow();
						}
						break;
					}
				}
			}
			else
			{
				//console.log("No Disable Day Specified");
			}

			// -----------------------------------------------------------------

			// Validate Date
			if(!bInvalidSelected && bHasDateComponent && apo.tmp.oArrPDisable.date.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.tmp.oArrPDisable.date.length; iTempIndex1++)
				{
					oDateRecord = apo.tmp.oArrPDisable.date[iTempIndex1];

					if($.CF.isValid(oDateRecord.val))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.val) === 0)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, dNewSelectedDate, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.start) && $.CF.isValid(oDateRecord.end))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.start) >= 0 && apo.compareDates(dNewSelectedDate, oDateRecord.end) <= 0)
						{
							
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, oDateRecord.start, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.start))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.start) >= 0)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(true, oDateRecord.start, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.end))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.end) <= 0)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(false, oDateRecord.end, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.min) && $.CF.isValid(oDateRecord.max))
					{
						bLTMin = apo.compareDates(dNewSelectedDate, oDateRecord.min) < 0;
						bGTMax = apo.compareDates(dNewSelectedDate, oDateRecord.max) > 0;
						bDirIsBefore = bLTMin ? true : bGTMax ? false : true;
						if(bLTMin || bGTMax)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bDirIsBefore, oDateRecord.min, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.min))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.min) < 0)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(false, oDateRecord.min, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.max))
					{
						if(apo.compareDates(dNewSelectedDate, oDateRecord.max) > 0)
						{
							if(apo.compareDates(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(true, oDateRecord.max, "date");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
				}
			}
			else
			{
				//console.log("No Disable Date Specified");
			}

			// -----------------------------------------------------------------

			// Validate Time

			if(!bInvalidSelected && bHasTimeComponent && apo.tmp.oArrPDisable.time.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.tmp.oArrPDisable.time.length; iTempIndex1++)
				{
					var oDayRecord = apo.tmp.oArrPDisable.time[iTempIndex1],
					bIsValidDay = false;

					if($.CF.isValid(oDayRecord.day) && oDayRecord.day.length > 0)
					{
						for(iTempIndex2 = 0; iTempIndex2 < oDayRecord.day.length; iTempIndex2++)
						{
							bIsValidDay = (oDayRecord.day[iTempIndex2] === oNewSelectedDate.D);
							if(bIsValidDay)
								break;
						}
					}
					else
						bIsValidDay = true;

					if(bIsValidDay)
					{
						for(iTempIndex2 = 0; iTempIndex2 < oDayRecord.val.length; iTempIndex2++)
						{
							oTimeRecord = oDayRecord.val[iTempIndex2];

							if($.CF.isValid(oTimeRecord.val))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.val) === 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, dNewSelectedDate, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.start) && $.CF.isValid(oTimeRecord.end))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.start) >= 0 && apo.compareTimes(dNewSelectedDate, oTimeRecord.end) <= 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, oTimeRecord.start, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.start))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.start) >= 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(true, oTimeRecord.start, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.end))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.end) <= 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(false, oTimeRecord.end, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.min) && $.CF.isValid(oTimeRecord.max))
							{
								bLTMin = apo.compareTimes(dNewSelectedDate, oTimeRecord.min) < 0;
								bGTMax = apo.compareTimes(dNewSelectedDate, oTimeRecord.max) > 0;
								bDirIsBefore = bLTMin ? true : bGTMax ? false : true;
								
								if(bLTMin || bGTMax)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(bDirIsBefore, oTimeRecord.min, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.min))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.min) < 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(false, oTimeRecord.min, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
							else if($.CF.isValid(oTimeRecord.max))
							{
								if(apo.compareTimes(dNewSelectedDate, oTimeRecord.max) > 0)
								{
									if(apo.compareTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
									{
										bInvalidSelected = true;
										dNewSelectedDate = apo._findValidSelectedDate(true, oTimeRecord.max, "time");
										apo.tmp.selectedDate = new Date(dNewSelectedDate);
										apo.__scrollToSelectedRow();
									}
									else
									{
										if(bReturnResult)
											bResult = false;
										else
											apo.__scrollToSelectedRow();
									}
									break;
								}
							}
						}
					}
				}
			}
			else
			{
				//console.log("No Disable Time Specified");
			}

			// -----------------------------------------------------------------

			// Validate DateTime

			if(!bInvalidSelected && bHasTimeComponent && apo.tmp.oArrPDisable.datetime.length > 0)
			{
				for(iTempIndex1 = 0; iTempIndex1 < apo.tmp.oArrPDisable.datetime.length; iTempIndex1++)
				{
					oDateRecord = apo.tmp.oArrPDisable.datetime[iTempIndex1];
				
					if($.CF.isValid(oDateRecord.val))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.val) === 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, dNewSelectedDate, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.start) && $.CF.isValid(oDateRecord.end))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.start) >= 0 && apo.compareDateTimes(dNewSelectedDate, oDateRecord.end) <= 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bIsBefore, oDateRecord.start, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.start))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.start) >= 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(true, oDateRecord.start, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.end))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.end) <= 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(false, oDateRecord.end, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.min) && $.CF.isValid(oDateRecord.max))
					{
						bLTMin = apo.compareDateTimes(dNewSelectedDate, oDateRecord.min) < 0;
						bGTMax = apo.compareDateTimes(dNewSelectedDate, oDateRecord.max) > 0;
						bDirIsBefore = bLTMin ? true : bGTMax ? false : true;
						if(bLTMin || bGTMax)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(bDirIsBefore, oDateRecord.min, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.min))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.min) < 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(false, oDateRecord.min, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
					else if($.CF.isValid(oDateRecord.max))
					{
						if(apo.compareDateTimes(dNewSelectedDate, oDateRecord.max) > 0)
						{
							if(apo.compareDateTimes(dNewSelectedDate, apo.tmp.selectedDate) === 0)
							{
								bInvalidSelected = true;
								dNewSelectedDate = apo._findValidSelectedDate(true, oDateRecord.max, "datetime");
								apo.tmp.selectedDate = new Date(dNewSelectedDate);
								apo.__scrollToSelectedRow();
							}
							else
							{
								if(bReturnResult)
									bResult = false;
								else
									apo.__scrollToSelectedRow();
							}
							break;
						}
					}
				}
			}
			else
			{
				//console.log("No Disable DateTime Specified");
			}

			// -----------------------------------------------------------------

			if(bReturnResult)
				return bResult;
		}
		else
		{
			if(bReturnResult)
				return true;
		}
	},

	_findValidSelectedDate: function(bIsBefore, dDate, sType)
	{
		var apo = this;
	
		if(sType === "day" || sType === "date")
		{
			if($.CF.isValid(apo.setting.minValue) && apo.compareDates(apo.setting.minValue, dDate) >= 0)
			{
				dDate = new Date(apo.setting.minValue);
				bIsBefore = false;
			}

			if($.CF.isValid(apo.setting.maxValue) && apo.compareDates(apo.setting.maxValue, dDate) <= 0)
			{
				dDate = new Date(apo.setting.maxValue);
				bIsBefore = true;
			}

			do
			{
				if(bIsBefore)
					dDate = new Date(dDate.getTime() - $.AnyPicker.extra.iMS.d);
				else
					dDate = new Date(dDate.getTime() + $.AnyPicker.extra.iMS.d);
				if(apo.__validateSelectedDate(dDate, true, false))
				{
					if((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareDates(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareDates(apo.setting.maxValue, dDate) >= 0)))
					{
						return dDate;
					}
				}

			}while((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareDates(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareDates(apo.setting.maxValue, dDate) >= 0)));
		}
		else if(sType === "time")
		{
			if($.CF.isValid(apo.setting.minValue) && apo.compareTimes(apo.setting.minValue, dDate) >= 0)
			{
				dDate = new Date(apo.setting.minValue);
				bIsBefore = false;
			}

			if($.CF.isValid(apo.setting.maxValue) && apo.compareTimes(apo.setting.maxValue, dDate) <= 0)
			{
				dDate = new Date(apo.setting.maxValue);
				bIsBefore = true;
			}

			do
			{
				if(bIsBefore)
					dDate = new Date(dDate.getTime() - ($.AnyPicker.extra.iMS.m * apo.setting.intervals.m));
				else
					dDate = new Date(dDate.getTime() + ($.AnyPicker.extra.iMS.m * apo.setting.intervals.m));
				if(apo.__validateSelectedDate(dDate, true, false))
				{
					if((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareTimes(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareTimes(apo.setting.maxValue, dDate) >= 0)))
					{
						return dDate;
					}
				}
			}while((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareTimes(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareTimes(apo.setting.maxValue, dDate) >= 0)));
		}
		else if(sType === "datetime")
		{
			if($.CF.isValid(apo.setting.minValue) && apo.compareDateTimes(apo.setting.minValue, dDate) >= 0)
			{
				dDate = new Date(apo.setting.minValue);
				bIsBefore = false;
			}

			if($.CF.isValid(apo.setting.maxValue) && apo.compareDateTimes(apo.setting.maxValue, dDate) <= 0)
			{
				dDate = new Date(apo.setting.maxValue);
				bIsBefore = true;
			}

			do
			{
				if(bIsBefore)
					dDate = new Date(dDate.getTime() - ($.AnyPicker.extra.iMS.m * apo.setting.intervals.m));
				else
					dDate = new Date(dDate.getTime() + ($.AnyPicker.extra.iMS.m * apo.setting.intervals.m));
				
				if(apo.__validateSelectedDate(dDate, true, false))
				{
					if((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareDateTimes(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareDateTimes(apo.setting.maxValue, dDate) >= 0)))
					{
						return dDate;
					}
				}
			}while((!$.CF.isValid(apo.setting.minValue) || ($.CF.isValid(apo.setting.minValue) && apo.compareDateTimes(apo.setting.minValue, dDate) <= 0)) && (!$.CF.isValid(apo.setting.maxValue) || ($.CF.isValid(apo.setting.maxValue) && apo.compareDateTimes(apo.setting.maxValue, dDate) >= 0)));
		}
	
		if($.CF.isValid(apo.setting.minValue))
		{
			return apo.setting.minValue;
		}
	},

	__setDaysOfMonthInDatePicker: function()
	{
		var apo = this;

		var iTempIndex, oComp, iDateComp = null, sDateCompFormat = null;
		for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{
			oComp = apo.setting.components[iTempIndex];
			if(oComp.name === "date")
			{
				iDateComp = oComp.component;
				sDateCompFormat = oComp.format;
			}
		}

		if(iDateComp !== null)
		{
			var oSelectedDate = apo.getDateObject(apo.tmp.selectedDate),
			iNoOfDays = apo._getNumberOfDaysOfMonth(oSelectedDate.M, oSelectedDate.y),
			bHasAria = false;

			for(iTempIndex = (iNoOfDays + 1); iTempIndex <= 31; iTempIndex++)
			{
				var $oHiddenElem = $("#ap-component-" + iDateComp).find("#ap-row-" + iDateComp + "-" + (iTempIndex - 1));
				$oHiddenElem.addClass("ap-row-disabled ap-row-hidden");
				if(!bHasAria)
					bHasAria = ($oHiddenElem.attr("aria-selected") === "true") ? true : false;
			}
			
			if(bHasAria)
			{
				var dTemp = new Date(oSelectedDate.y, oSelectedDate.M, iNoOfDays, oSelectedDate.H, oSelectedDate.m, oSelectedDate.s, oSelectedDate.ms);
				
				apo.__validateSelectedDate(dTemp, false, true);
				apo.__scrollToSelectedRow();
			}
		}
	},

	//------------------------------- Date Manipulation Functions Start -------------------------------

	// Public Method
	setDateInFormat: function(oInput, sType)
	{
		var apo = this;

		if(oInput.date === undefined && oInput.iDate === undefined)
			oInput.date = apo._getCurrentDate();
		if(oInput.iDate === undefined)
		{
			oInput.iDate = {
				d: oInput.date.getDate(),
				M: oInput.date.getMonth(),
				y: oInput.date.getFullYear(),
				H: oInput.date.getHours(),
				m: oInput.date.getMinutes(),
				s: oInput.date.getSeconds(),
				ms: oInput.date.getMilliseconds()
			};
		}
		else
		{
			oInput.iDate = {
				d: (oInput.iDate.d !== undefined) ? oInput.iDate.d : 1,
				M: (oInput.iDate.M !== undefined) ? oInput.iDate.M : $.AnyPicker.extra.dToday.getMonth(),
				y: (oInput.iDate.y !== undefined) ? oInput.iDate.y : $.AnyPicker.extra.dToday.getFullYear(),
				H: (oInput.iDate.H !== undefined) ? oInput.iDate.H : 0,
				m: (oInput.iDate.m !== undefined) ? oInput.iDate.m : 0,
				s: (oInput.iDate.s !== undefined) ? oInput.iDate.s : 0,
				ms: (oInput.iDate.ms !== undefined) ? oInput.iDate.ms : 0
			};
		}

		var dDate;
		if(!$.CF.isValid(sType))
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, oInput.iDate.H, oInput.iDate.m, oInput.iDate.s, oInput.iDate.ms);
		else if(sType === "START")
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, 0, 0, 0, 0);
		else if(sType === "END")
			dDate = new Date(oInput.iDate.y, oInput.iDate.M, oInput.iDate.d, 23, 59, 59, 999);
	
		return dDate;
	},

	_getCurrentDate: function()
	{
		var apo = this;
		var dToday = apo.getDateByAddingOutputTZOffset(apo.convertToUTC(new Date()), apo.setting.tzOffset);
		return dToday;
	},

	// Public Method
	convertToUTC: function(dIpDate, sIpTZOffset)
	{
		var apo = this;
		return new Date(dIpDate.getTime() - ((sIpTZOffset === undefined || sIpTZOffset === "" || sIpTZOffset === null) ?  -(dIpDate.getTimezoneOffset() * $.AnyPicker.extra.iMS.m) : apo._getTZOffsetInMS(sIpTZOffset)));
	},

	_getTZOffsetInMS: function(sTZOffset)
	{
		var apo = this;
		var iOffsetMS = 0;
		if(sTZOffset === undefined || sTZOffset === "" || sTZOffset === null)
			iOffsetMS = -($.AnyPicker.extra.dToday.getTimezoneOffset() * $.AnyPicker.extra.iMS.m);
		else
		{
			var sArrTZOffset = apo._matchRegex(/^([+|-]{1})([0-1]{0,1}[0-9]{1}):([0-6]{0,1}[0-9]{1})$/, sTZOffset);
			iOffsetMS = parseInt(sArrTZOffset[2]) * $.AnyPicker.extra.iMS.h + parseInt(sArrTZOffset[3]) * $.AnyPicker.extra.iMS.m;
			iOffsetMS = (sArrTZOffset[1]==="+") ? iOffsetMS : -iOffsetMS;
		}
		return iOffsetMS;
	},

	// Public Method
	getDateByAddingOutputTZOffset: function(dIpDate, sOpTZOffset)
	{
		var apo = this;
		return new Date(dIpDate.getTime() + apo._getTZOffsetInMS(sOpTZOffset));
	},

	// Public Method
	normalizeDateTimeWithOffset: function(dIpDate, sIpTZOffset, sOpTZOffset)
	{
		var apo = this;
		return apo.getDateByAddingOutputTZOffset(apo.convertToUTC(dIpDate, sIpTZOffset), sOpTZOffset);
	},

	_getNumberOfDaysOfMonth: function(iMonth, iYear)
	{
		var apo = this;
		var iArrMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		iArrLeapYearMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(iYear % 4 === 0)
			return iArrLeapYearMonthDays[iMonth];
		else
			return iArrMonthDays[iMonth];
	},

	_normalizeDateTime: function(dInputDate, sFunction, sUnit)
	{
		var apo = this;
		// sFunction = "START" | "END"
		// sUnit = "s" | "m" | "h" | "T" | "d" | "M" | 
	
		var dOutputDate,
		iArrInput = 
		{
			d: dInputDate.getDate(),
			M: dInputDate.getMonth(),
			y: dInputDate.getFullYear(),
			H: dInputDate.getHours(),
			m: dInputDate.getMinutes(),
			s: dInputDate.getSeconds()
		};
	
		switch(sUnit)
		{
			case "s":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, iArrInput.m, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, iArrInput.m, 59, 999);
				}
				break;
			case "m":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, iArrInput.H, 59, 59, 999);
				}
				break;
			case "h":
			case "T":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, iArrInput.d, 23, 59, 59, 999);
				}
				break;
			case "d":
			case "dE":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, 1, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, iArrInput.M, apo._getNumberOfDaysOfMonth(iArrInput.M, iArrInput.y), 0, 0, 0, 0);
				}
				break;
			case "M":
			case "ME":
			case "y":
			case "yE":
				{
					if(sFunction === "START")
						dOutputDate = new Date(iArrInput.y, 0, 1, 0, 0, 0, 0);
					else if(sFunction === "END")
						dOutputDate = new Date(iArrInput.y, 11, apo._getNumberOfDaysOfMonth(11, iArrInput.y), 0, 0, 0, 0);
				}
				break;
		}
	
		if(sUnit === "dE" || sUnit === "ME" || sUnit === "yE")
			dOutputDate = apo._normalizeDateTime(dOutputDate, "END", "T");
	
		return dOutputDate;
	},

	_getDifference: function(sUnit, dDate1, dDate2)
	{
		var apo = this;
		// sUnit = "ms | "s" | "m" | "h" | "T" | "d" | "M"| "y"
	
		var iUnitDiff, iMSDiff = dDate1.getTime() - dDate2.getTime();
	
		if(sUnit === "ms")
			iUnitDiff = iMSDiff;
		else if(sUnit === "s")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.s);
		else if(sUnit === "m")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.m);
		else if(sUnit === "h")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.h);
		else if(sUnit === "d")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.d);
		else if(sUnit === "M")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.m);
		else if(sUnit === "y")
			iUnitDiff = (iMSDiff / $.AnyPicker.extra.iMS.y);
	
		return iUnitDiff;
	},

	// Public Method
	compareDates: function(dDate1, dDate2)
	{
		var apo = this;
		dDate1 = apo._normalizeDateTime(dDate1, "START", "T");
		dDate2 = apo._normalizeDateTime(dDate2, "START", "T");
		var iDateDiff = apo._getDifference("d", dDate1, dDate2);
		return (iDateDiff === 0) ? iDateDiff: (iDateDiff/Math.abs(iDateDiff));
	},

	// Public Method
	compareDateTimes: function(dDate1, dDate2)
	{
		var apo = this;
		var iDateTimeDiff = apo._getDifference("m", dDate1, dDate2);
		return (iDateTimeDiff === 0) ? iDateTimeDiff: (iDateTimeDiff/Math.abs(iDateTimeDiff));
	},

	// Public Method
	compareTimes: function(dDate1, dDate2)
	{
		var apo = this;
		var dDateTime1 = new Date($.AnyPicker.extra.dToday),
		dDateTime2 = new Date($.AnyPicker.extra.dToday);

		dDateTime1.setHours(dDate1.getHours());
		dDateTime1.setMinutes(dDate1.getMinutes());
		dDateTime1.setSeconds(dDate1.getSeconds());

		dDateTime2.setHours(dDate2.getHours());
		dDateTime2.setMinutes(dDate2.getMinutes());
		dDateTime2.setSeconds(dDate2.getSeconds());

		return apo.compareDateTimes(dDateTime1, dDateTime2);
	},

	// Public Method
	getNumberStringInFormat: function(iNumber, iChars, bIsLocalized)
	{
		var apo = this;
		var iTempIndex, sFormattedString = "", sNumber = iNumber.toString(), iNumberLength = sNumber.length;
		if(iChars !== 0)
		{
			for(iTempIndex = 0; iTempIndex < (iChars - iNumberLength); iTempIndex++)
				sFormattedString += (bIsLocalized ? apo.setting.i18n.numbers[0] : "0");
		}
		if(!bIsLocalized)
			sFormattedString += sNumber;
		else
		{
			for(iTempIndex = 0; iTempIndex < iNumberLength; iTempIndex++)
				sFormattedString += apo.setting.i18n.numbers[parseInt(sNumber.charAt(iTempIndex))];
		}
		return sFormattedString;
	},

	// Public Method
	getDateObject: function(dInput)
	{
		var apo = this;
	
		var oInput = {
			D: dInput.getDay(),
			d: dInput.getDate(),
			M: dInput.getMonth(),
			y: dInput.getFullYear(),
			H: dInput.getHours(),
			m: dInput.getMinutes(),
			s: dInput.getSeconds(),
			ms: dInput.getMilliseconds()
		};
		
		oInput.h = (oInput.H > 12) ? (oInput.H - 12) : ((oInput.H === 0) ? 12 : oInput.H);
		oInput.me = (oInput.H < 12) ?  "am" : "pm";
		oInput.sm = (oInput.H < 12) ?  "a" : "p";
		
		return oInput;
	}

	//------------------------------- Date Manipulation Functions End -------------------------------

});

// --------------------------------- Functions : AnyPicker.DateTime End --------------------------------------
