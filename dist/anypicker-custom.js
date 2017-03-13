/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

(function () {

    "use strict";

// --------------------------------- Global Variables : AnyPicker.Core Start --------------------------------------

//"use strict";

$.CF = {

	setPropertiesStyle: function(sProp, sArrProps)
    {
        var oTest = window.getComputedStyle(document.documentElement, '');
        for(var iProp in sArrProps)
        {
            if(oTest[sArrProps[iProp]] !== undefined)
            {
                var sPrefix = "";
        
                if(sArrProps[iProp].search("Webkit") !== -1)
                    sPrefix = "-webkit-";
                else if(sArrProps[iProp].search("Moz") !== -1)
                    sPrefix = "-moz-";
                else if(sArrProps[iProp].search("O") !== -1)
                    sPrefix = "-o-";
                else if(sArrProps[iProp].search("ms") !== -1)
                    sPrefix = "-ms-";
                
                return sPrefix + sProp;
            }
        }
    },

	testProperties: function(sProp, sArrProps, bReturnProp)
	{
		var oTest = window.getComputedStyle(document.documentElement, '');
		for(var iProp in sArrProps)
		{
			if(oTest[sArrProps[iProp]] !== undefined)
			{
				if(bReturnProp)
				{
					return sArrProps[iProp];
				}
				else
					return true;
			}
		}
		if(bReturnProp)
			return "";
		else
			return false;
	},

	compareDataType: function(oVariable, sDataType)
	{
		if(typeof oVariable === sDataType.toLocaleLowerCase())
			return true;
		return false;
	},

	compareStrings: function(sString1, sString2)
	{
		var to = this;
		if(sString1 !== null && sString1 !== undefined && sString2 !== null && sString2 !== undefined)
		{
			if(typeof sString1 === "string" && typeof sString2 === "string")
			{
				if(sString1.toLocaleLowerCase() === sString2.toLocaleLowerCase())
					return true;
			}
			return false;
		}
		else
		{
			if((sString1 === null && sString2 === null) || (sString1 === undefined && sString2 === undefined))
				return true;
			else
				return false;
		}
	},

	isValid: function(oValue)
	{
		if(oValue !== undefined && oValue !== null && oValue !== "")
			return true;
		else
			return false;
	}

};

$.AnyPicker = $.AnyPicker || {

	name: "AnyPicker", // Plugin Name

	version: "2.0.3", // Plugin Version

	i18n: // Internationalization Strings
	{ 
		
	},

	defaults: // Defaults Settings
	{
		mode: "datetime",
	
		parent: "body",
		layout: "popup",
		hAlign: "left",
		vAlign: "bottom",
		relativeTo: null,
		inputElement: null,
		inputChangeEvent: "onSet",

		lang: "",
		rtl: false,
		animationDuration: 500,

		// View Section Components Start

		setButton: 
		{
			markup: "<a id='ap-button-set' class='ap-button'>Set</a>",
			markupContentWindows: "<span class='ap-button-icon ap-icon-set'></span><span class='ap-button-text'>set</span>",
			type: "Button"
			// action: function(){}
		},

		clearButton: 
		{
			markup: "<a id='ap-button-clear' class='ap-button'>Clear</a>",
			markupContentWindows: "<span class='ap-button-icon ap-icon-clear'></span><span class='ap-button-text'>clear</span>",
			type: "Button"
			// action: function(){}
		},

		nowButton: 
		{
			markup: "<a id='ap-button-now' class='ap-button'>Now</a>",
			markupContentWindows: "<span class='ap-button-icon ap-icon-now'></span><span class='ap-button-text'>now</span>",
			type: "Button"
			// action: function(){}
		},

		cancelButton: 
		{
			markup: "<a id='ap-button-cancel' class='ap-button'>Cancel</a>",
			markupContentWindows: "<span class='ap-button-icon ap-icon-cancel'></span><span class='ap-button-text'>cancel</span>",
			type: "Button"
			// action: function(){}
		},

		headerTitle:
		{
			markup: "<span class='ap-header__title'>Select</span>",
			type: "Text",
			contentBehaviour: "Static", // Static or Dynamic
			format: "" // DateTime Format
		},

		// View Section Components End

		viewSections:
		{
			header: ["headerTitle"],
			contentTop: [],
			contentBottom: [],
			footer: ["cancelButton", "setButton"]
		},

		i18n:
		{
			headerTitle: "Select",
			setButton: "Set",
			clearButton: "Clear",
			nowButton: "Now",
			cancelButton: "Cancel",
			dateSwitch: "Date",
			timeSwitch: "Time"
		},

		theme: "Default",

		//------------------ Callback Functions Start --------------------------

		onInit: null, // ()

		onBeforeShowPicker: null, // ()
		onShowPicker: null, // ()

		onBeforeHidePicker: null, // ()
		onHidePicker: null, // ()

		parseInput: null, // ()
		formatOutput: null, // ()

		setOutput: null,
		onSetOutput: null

		//------------------ Callback Functions End --------------------------
	},

	tempDefaults: // Plugin-level Variables required to maintain state across methods
	{
		sOrientation: "portrait",
		overlayClass: "",
		overlaySelector: "",
		iExt: 2,
		dir: "ltr",
		sElemTag: "",
		oElemValid: {
			bIsInput: false,
			bIsListItem: false,
			bIsSelect: false
		},
		sInputElemTag: "",
		oInputElemValid: {
			bIsInput: false,
			bIsListItem: false,
			bIsSelect: false
		},
		prevActive: null,
		bFirst: true,
		sDateTimeTab: "date",
		iCompDragStart: 0,
		headerTitleDefined: false,
		bIsiPad: false,
		bModified: {
			set: false,
			cancel: false,
			clear: false,
			now: false
		},
		tabKey: false
	},

	extra: // Common Temporary Variables
	{
		sArrModes: ["select", "datetime"], // Modes of AnyPicker
		sArrLayout: ["popup", "relative", "fixed", "inline"], // Type of AnyPicker Layout
		sArrHAlign: ["left", "center", "right"], // Horizontal Alignment of View
		sArrVAlign: ["top", "middle", "bottom"], // Vertical Alignment of View
		sArrViewSections: ["header", "contentTop", "contentBottom", "footer"],
		oArrInputChangeEvent: ["onChange", "onSet"],
		sArrThemes: ["Default", "iOS", "Android", "Windows"],
	
		bIsTouchDevice: "ontouchstart" in document.documentElement,
		sClickHandler: ("ontouchstart" in document.documentElement ? "click" : "click"),
		sClickHandlerButtons: ("ontouchstart" in document.documentElement ? "touchstart" : "click"),
	
		bHasCSS3D : $.CF.testProperties("perspective", ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective", "perspective", "perspectiveProperty"], false),
		sCSSTransform: $.CF.testProperties("transform", ["WebkitTransform", "MozTransform", "OTransform", "msTransform", "transform"], true),
		sCSSTransformStyle: $.CF.setPropertiesStyle("transform", ["WebkitTransform", "MozTransform", "OTransform", "msTransform", "transform"]),
		sCSSTransition: $.CF.testProperties("transition", ["WebkitTransition", "MozTransition", "OTransition", "msTransition", "transition"], true),
		bHasCSSAnimation: $.CF.testProperties("animation", ["WebkitAnimation", "MozAnimation", "OAnimation", "msAnimation", "animation"], false),
		sMouseWheel: ('onwheel' in document || document.documentMode >= 9 ) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'], //"MozMousePixelScroll DOMMouseScroll mousewheel wheel"
		bHasIE10Pointer: window.navigator.msPointerEnabled && !window.navigator.pointerEnabled,
		bHasPointer: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
		bIsiPad: navigator.userAgent.match(/iPad/i) !== null
	}

};

// --------------------------------- Global Variables : AnyPicker.Core End --------------------------------------

(function (factory) 
{
    if (typeof define === 'function' && define.amd) // AMD. Register as an anonymous module.
    {   
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object') // Node/CommonJS
    {
        module.exports = factory(require('jquery'));
    } 
    else // Browser globals
    {
    	factory(jQuery);
    }
}
(function ($) 
{
	$.fn.AnyPicker = function(options) 
	{
		var oAnyPicker = $(this).data();

		var sArrDataKeys = Object.keys(oAnyPicker),
			iKey, sKey;
		if(options === null || options === undefined) // return AnyPicker object
		{
			if(sArrDataKeys.length > 0)
			{
				for(iKey in sArrDataKeys)
				{
					sKey = sArrDataKeys[iKey];
					if(sKey.search("plugin_AnyPicker_") !== -1)
					{
						return oAnyPicker[sKey];
					}
				}
			}
			else
				console.log("No AnyPicker Object Defined For This Element");
		}
		else if(typeof options === "string") // call methods using AnyPicker object
		{			
			if(oAnyPicker !== null || oAnyPicker !== undefined)
			{
				if(sArrDataKeys.length > 0)
				{
					if(options === "destroy")
					{
						if(sArrDataKeys.length > 0)
						{
							for(iKey in sArrDataKeys)
							{
								sKey = sArrDataKeys[iKey];
								if(sKey.search("plugin_AnyPicker_") !== -1)
								{
									oAnyPicker = oAnyPicker[sKey];
									$(window).off("blur." + oAnyPicker.setting.timestamp);
									var oInput = $(oAnyPicker.setting.inputElement);
									$(oInput).off("focus." + oAnyPicker.setting.timestamp);
									$(oInput).off("blur." + oAnyPicker.setting.timestamp);

									$(".ap-overlay-" + sKey.replace("plugin_AnyPicker_", "")).remove(); // Remove AnyPicker DOM appended for a particular AnyPicker object
									$(this).removeData(sKey);
								
									//console.log("Destroyed AnyPicker Object");
									//console.log(oAnyPicker);

									break;
								}
							}
						}
						else
							console.log("No AnyPicker Object Defined For This Element");
						
						// ** Destoy AnyPicker Object **
						// unbind events
						// remove data attached to Element
						// remove AnyPicker Object from the $.AnyPicker.extra.oArrAnyPicker
					}
				}
				else
					console.log("No AnyPicker Object Defined For This Element");
			}
		}
		else // create a new AnyPicker object
		{
			return this.each(function()
			{
				var iTimeStamp = (new Date()).getTime();
				if(!$.data(this, "plugin_AnyPicker_" + iTimeStamp)) 
				{
					options.timestamp = iTimeStamp;
					oAnyPicker = new AnyPicker(this, options);
					$.data(this, "plugin_AnyPicker_" + iTimeStamp, oAnyPicker);
					oAnyPicker.init();
				
					//console.log("Created AnyPicker Object ");
					//console.log(oAnyPicker);
				}
				else
				{
					if(sArrDataKeys.length > 0)
					{
						for(iKey in sArrDataKeys)
						{
							sKey = sArrDataKeys[iKey];
							if(sKey.search("plugin_AnyPicker_") !== -1)
							{
								return oAnyPicker[sKey];
							}
						}
					}
					else
						console.log("No AnyPicker Object Defined For This Element");
				}
			});
		}
	};
}));

// AnyPicker Constructor
function AnyPicker(element, options)
{
	var apo = this;

	apo.elem = element;
	var sLang = (options.lang !== undefined || options.lang !== null) ? options.lang : $.CalenStyle.defaults.lang,
	io18n = $.extend(true, {}, $.AnyPicker.defaults.i18n, $.AnyPicker.i18n[sLang], options.i18n),
	oDefaults = $.extend(true, {}, $.AnyPicker.defaults);

	io18n = {
		i18n: io18n
	};
	oDefaults.i18n = {};
	options.i18n = {};

	apo.setting = $.extend({}, oDefaults, options, io18n);
	apo.tmp = $.extend({}, $.AnyPicker.tempDefaults);

	apo.tmp.overlayClass = "ap-overlay-" + apo.setting.timestamp;
	apo.tmp.overlaySelector = "." + apo.tmp.overlayClass;
	apo.tmp.sOrientation = apo._getDeviceOrientation();

	//----------- Theme-wise Changes In Settings -------------------

	if($.CF.isValid(options.headerTitle))
		apo.tmp.headerTitleDefined = true;

	if($.CF.compareStrings(apo.setting.theme, "Android"))
	{
		if(!$.CF.isValid(options.rowHeight))
			apo.setting.rowHeight = 50;

		if(!$.CF.isValid(options.visibleRows))
			apo.setting.visibleRows = 3;
	}
	else if($.CF.compareStrings(apo.setting.theme, "iOS"))
	{
		if(!$.CF.isValid(options.rowHeight))
			apo.setting.rowHeight = 36;

		if(!$.CF.isValid(options.visibleRows))
			apo.setting.visibleRows = 5;

		if(!$.CF.isValid(options.viewSections))
		{
			apo.setting.viewSections = {
				header: ["cancelButton", "headerTitle", "setButton"],
				contentTop: [],
				contentBottom: [],
				footer: []
			};
		}

		if($.AnyPicker.extra.bIsiPad)
			apo.tmp.bIsiPad = true;
		if(apo.tmp.bIsiPad && $.CF.compareStrings(apo.setting.layout, "popup"))
    		apo.setting.layout = "popover";
	}
	else if($.CF.compareStrings(apo.setting.theme, "Windows"))
	{
		apo.setting.layout = "popup";
		apo.setting.visibleRows = 5;
		apo.setting.rowHeight = 100;

		if(!$.CF.isValid(options.viewSections))
		{
			apo.setting.viewSections = {
				header: ["headerTitle"],
				contentTop: [],
				contentBottom: [],
				footer: ["setButton", "cancelButton"]
			};
		}
	
		if($.CF.isValid(options.setButton))
			apo.tmp.bModified.set = true;
		if($.CF.isValid(options.cancelButton))
			apo.tmp.bModified.cancel = true;
		if($.CF.isValid(options.nowButton))
			apo.tmp.bModified.now = true;
		if($.CF.isValid(options.clearButton))
			apo.tmp.bModified.clear = true;
	}

	//--------------------------------------------------------------

	apo.tmp.iExt = Math.floor(apo.setting.visibleRows / 2);
	apo.tmp.sDir = apo.setting.rtl ? "rtl" : "ltr";

	$.AnyPicker.extra.dToday = apo._getCurrentDate();
	if(apo.tmp.selectedDate === null)
		apo.tmp.selectedDate = $.AnyPicker.extra.dToday;
	if(apo.setting.maxYear === 0)
		apo.setting.maxYear = $.AnyPicker.extra.dToday.getFullYear();
	if($.CF.isValid(apo.setting.components) && apo.tmp.numOfComp === 0)
		apo.tmp.numOfComp = apo.setting.components.length;

   	$.AnyPicker.extra.sStartEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerDown' : 'pointerdown') : ($.AnyPicker.extra.bIsTouchDevice ? 'touchstart' : 'mousedown touchstart'));
    $.AnyPicker.extra.sMoveEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerMove' : 'pointermove') : ($.AnyPicker.extra.bIsTouchDevice ? 'touchmove' : 'mousemove touchmove'));
    $.AnyPicker.extra.sEndEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerUp' : 'pointerup') : ($.AnyPicker.extra.bIsTouchDevice ? 'touchend' : 'mouseup touchend'));
    $.AnyPicker.extra.sLeaveEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerLeave' : 'pointerleave') : ($.AnyPicker.extra.bIsTouchDevice ? null : 'mouseleave'));
    $.AnyPicker.extra.sCancelEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerCancel' : 'pointercancel') : null);
    $.AnyPicker.extra.sOutEv = ($.AnyPicker.extra.bHasPointer ? ($.AnyPicker.extra.bHasIE10Pointer ? 'MSPointerOut' : 'pointerout') : null);

    //alert("Events : " + $.AnyPicker.extra.sStartEv + " " + $.AnyPicker.extra.sMoveEv + " " + $.AnyPicker.extra.sEndEv + " " + $.AnyPicker.extra.sLeaveEv + " " + $.AnyPicker.extra.sCancelEv + " " + $.AnyPicker.extra.sOutEv);
}

// --------------------------------- Functions : AnyPicker.Core Start --------------------------------------

AnyPicker.prototype = {

	// Public Method
	init: function()
	{
		var apo = this;
	
		if($.CF.isValid(apo.elem))
		{
			apo.tmp.sElemTag = $(apo.elem).prop("tagName").toLowerCase() ;
			if(apo.tmp.sElemTag === "input")
				apo.tmp.oElemValid.bIsInput = true;
			else if(apo.tmp.sElemTag === "ul" || apo.tmp.sElemTag === "ol" || apo.tmp.sElemTag === "dl")
				apo.tmp.oElemValid.bIsListItem = true;
			else if(apo.tmp.sElemTag === "select")
				apo.tmp.oElemValid.bIsSelect = true;
		}

		if($.CF.isValid(apo.setting.inputElement))
		{
			apo.tmp.sInputElemTag = $(apo.setting.inputElement).prop("tagName").toLowerCase();
			if(apo.tmp.sInputElemTag === "input")
				apo.tmp.oInputElemValid.bIsInput = true;
			else if(apo.tmp.sInputElemTag === "ul" || apo.tmp.sInputElemTag === "ol" || apo.tmp.sInputElemTag === "dl")
				apo.tmp.oInputElemValid.bIsListItem = true;
			else if(apo.tmp.sInputElemTag === "select")
				apo.tmp.oInputElemValid.bIsSelect = true;
		}
		else if($.CF.isValid(apo.elem))
		{
			apo.setting.inputElement = apo.elem;
			apo.tmp.sInputElemTag = apo.tmp.sElemTag;
			apo.tmp.oInputElemValid = apo.tmp.oElemValid;
		}
	
		if($.CF.compareStrings(apo.setting.mode, "select"))
		{
			apo.__setComponentsOfSelect();
		}
		else if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			apo.__setComponentsOfDateTimePicker();
		}
	
		if(apo.tmp.sInputElemTag !== "" && !(apo.tmp.oInputElemValid.bIsListItem || apo.tmp.oInputElemValid.bIsSelect))
		{
			var $oInput = $(apo.setting.inputElement);
			if(apo.tmp.oInputElemValid.bIsInput)
			{
				$oInput.off("focus." + apo.setting.timestamp);
				$oInput.on("focus." + apo.setting.timestamp, {"apo": apo}, apo._inputElementClicked);
				$oInput.on("blur." + apo.setting.timestamp, function(e)
				{
					if($.AnyPicker.tempDefaults.tabKey)
						apo.showOrHidePicker();
					apo.tmp.prevActive = null;
				});

				$oInput.on("keydown." + apo.setting.timestamp, function(e)
				{
					if((e.keyCode ? e.keyCode : e.which) === "9")
						$.AnyPicker.tempDefaults.tabKey = true;
				});
			}
			else
			{
				$oInput.off("click." + apo.setting.timestamp);
				$oInput.on("click." + apo.setting.timestamp, {"apo": apo}, apo._inputElementClicked);
			}
		}

		if($.CF.isValid(apo.setting.onInit))
			apo.setting.onInit.call(apo);
	},

	_inputElementClicked: function(e)
	{
		e.stopPropagation();
		e.preventDefault();

		var apo = e.data.apo;

		if(document.activeElement === apo.tmp.prevActive && document.activeElement === apo.setting.inputElement)
            return;
        apo.tmp.prevActive = document.activeElement;
	
		// Get Selected Values (Value in the text field or Value set in the inputElement)
		if(apo.tmp.sInputElemTag !== "" && !(apo.tmp.oInputElemValid.bIsListItem || apo.tmp.oInputElemValid.bIsSelect))
		{
			var $oInput = $(apo.setting.inputElement), sElemValue;

			if(apo.tmp.oInputElemValid.bIsInput)
				sElemValue = $oInput.val();
			else
			{
				var sDataVal = $oInput.attr("data-val");
				if($.CF.isValid(sDataVal))
					sElemValue = sDataVal;
				else
					sElemValue = $oInput.text();
			}

			if(!$.AnyPicker.tempDefaults.tabKey)
			{
				apo.showOrHidePicker(sElemValue);
			}
			else
			{
				$.AnyPicker.tempDefaults.tabKey = false;
				setTimeout(function()
				{
					apo.showOrHidePicker(sElemValue);
				}, 500);
			}
		}
		else
			console.log("No InputElement Specified");
	},

	// Public Method
	showOrHidePicker: function(sElemValue)
	{
		var apo = this;

		var iTempIndex, sLabel, sValue,
		sArrValues = [], oArrSelectedValues = [];

		if(sElemValue !== undefined && sElemValue !== null)
		{
			if($.CF.isValid(apo.setting.parseInput))
			{
				if($.CF.compareStrings(apo.setting.mode, "datetime"))
				{
					apo.setting.selectedDate = apo.setting.parseInput.call(apo, sElemValue);
				}
				else if($.CF.compareStrings(apo.setting.mode, "select"))
				{
					sArrValues = apo.setting.parseInput.call(apo, sElemValue);
				
					for(iTempIndex = 0; iTempIndex < sArrValues.length; iTempIndex++)
					{
						sLabel = sArrValues[iTempIndex];
						sValue = apo.__getDataSourceValueFromLabel(sLabel, iTempIndex, true);
						oArrSelectedValues.push(
						{
							component: iTempIndex,
							val: sValue,
							label: sLabel
						});
					}
					apo.tmp.selectedValues.values = oArrSelectedValues;
				}
			}
			else
			{
				if($.CF.compareStrings(apo.setting.mode, "datetime"))
				{
					apo.setting.selectedDate = sElemValue;
				}
				else if($.CF.compareStrings(apo.setting.mode, "select"))
				{
					if(sElemValue !== "")
					{
						sArrValues = []; oArrSelectedValues = [];
						if(apo.tmp.numOfComp > 1)
							sArrValues = sElemValue.split(" ");
						else
							sArrValues.push(sElemValue);
						
						for(iTempIndex = 0; iTempIndex < sArrValues.length; iTempIndex++)
						{
							sLabel = sArrValues[iTempIndex];
							sValue = apo.__getDataSourceValueFromLabel(sLabel, iTempIndex, true);
							oArrSelectedValues.push(
							{
								component: iTempIndex,
								val: sValue,
								label: sLabel
							});
						}
					}
					else
					{
						for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
						{
							var oCompData = apo.setting.dataSource[iTempIndex].data;
							sLabel = oCompData[0].label;
							sValue = oCompData[0].val;
							oArrSelectedValues.push(
							{
								component: iTempIndex,
								val: sValue,
								label: sLabel
							});
						}
					}

					apo.tmp.selectedValues.values = oArrSelectedValues;
				}
			}
		}

		if($(apo.tmp.overlaySelector).length > 0)
			apo._hidePicker();
		else
		{
			if(!$.CF.isValid(apo.setting.onBeforeShowPicker))
				apo._showPicker();
			else
			{
				if(apo.setting.onBeforeShowPicker.call(apo))
					apo._showPicker();
			}
		}
	},

	_showPicker: function()
	{
		var apo = this;

		// if($.CF.isValid(apo.setting.onBeforeShowPicker))
		// 	apo.setting.onBeforeShowPicker.call(apo);

		apo.tmp.sOrientation = apo._getDeviceOrientation();

		var sTemp = "",
		bAddSectionHeader = (($.CF.compareStrings(apo.setting.layout, "popup") || $.CF.compareStrings(apo.setting.layout, "popover")) && apo.setting.viewSections.header.length > 0),
		bAddSectionFooter = (($.CF.compareStrings(apo.setting.layout, "popup") || $.CF.compareStrings(apo.setting.layout, "popover")) && apo.setting.viewSections.footer.length > 0),
		bAddSectionFooterFixedTop = ($.CF.compareStrings(apo.setting.layout, "fixed") && $.CF.compareStrings(apo.setting.vAlign, "bottom") && apo.setting.viewSections.footer.length > 0),
		bAddSectionFooterFixedBottom = ($.CF.compareStrings(apo.setting.layout, "fixed") && $.CF.compareStrings(apo.setting.vAlign, "top") && apo.setting.viewSections.footer.length > 0),
		bIsDateTimeField = ($.CF.compareStrings(apo.setting.mode, "datetime") && apo.tmp.sDateTimeMode === "datetime"),
		sLayout = "ap-layout-" + apo.setting.layout,
		sTheme = "ap-theme-" + apo.setting.theme.toLowerCase(),
		sDir = "ap-dir-" + apo.tmp.sDir;

		if($.CF.compareStrings(apo.setting.layout, "popover"))
		{
			var iBodyScrollTop = $("body").scrollTop(),
			iWinHeight = $(window).height(),
			iMinTop = iBodyScrollTop,
			iMaxTop = iBodyScrollTop + iWinHeight,
			iPopupHeight = $.CF.compareStrings(apo.setting.rowsNavigation, "scroller") ? 300 : 350,
			iTooltipTop = $(apo.setting.inputElement).offset().top - iPopupHeight,
			bTooltipTop = (iTooltipTop < iMinTop) ? false : true,
			iTooltipBottom = $(apo.setting.inputElement).offset().top + $(apo.setting.inputElement).height() + iPopupHeight,
			bTooltipBottom = (iTooltipBottom > iMaxTop) ? false : true;
			apo.tmp.sTooltip = bTooltipBottom ? "bottom" : bTooltipTop ? "top" : apo.setting.rtl ? "right" : "left";
		}

		sTemp += "<div class='ap-overlay " + sLayout + " " + apo.tmp.overlayClass + " " + sTheme + " " + sDir + "'>";

		sTemp += "<div class='ap-bg'>";
	
		sTemp += "<div class='ap-cont' dir='" + apo.tmp.sDir + "'>";

		if($.CF.isValid(apo.tmp.sTooltip))
			sTemp += "<span class='ap-tooltip ap-tooltip-" + apo.tmp.sTooltip + "'></span>";
	
		if(bAddSectionHeader)
		{
			sTemp += "<div class='ap-header'>";

			if(bIsDateTimeField && $.CF.compareStrings(apo.setting.theme, "Windows"))
			{
				sTemp += "<div class='ap-content-switch'>";
				if(apo.setting.rtl)
				{
					sTemp += "<span class='ap-content-switch-tab ap-content-switch-time'>" + apo.setting.i18n.timeSwitch + "</span>";
					sTemp += "<span class='ap-content-switch-tab ap-content-switch-date ap-content-switch-selected'>" + apo.setting.i18n.dateSwitch + "</span>";
				}
				else
				{
					sTemp += "<span class='ap-content-switch-tab ap-content-switch-date ap-content-switch-selected'>" + apo.setting.i18n.dateSwitch + "</span>";
					sTemp += "<span class='ap-content-switch-tab ap-content-switch-time'>" + apo.setting.i18n.timeSwitch + "</span>";
				}
				sTemp += "</div>";
			
				apo.tmp.sDateTimeTab = "time";
			}

			sTemp += "</div>";
		}
	
		if(bAddSectionFooterFixedTop)
		{
			sTemp += "<div class='ap-footer ap-footer-top'>";
			if($.CF.compareStrings(apo.setting.theme, "Default"))
				sTemp += "<div class='ap-button-cont'></div>";
			sTemp += "</div>";
		}

		sTemp += "<div class='ap-content'>";

		if(apo.setting.viewSections.contentTop.length > 0)
			sTemp += "<div class='ap-content-top'></div>";

		if(bIsDateTimeField && !$.CF.compareStrings(apo.setting.theme, "Windows"))
		{
			sTemp += "<div class='ap-content-switch'>";
			if(apo.setting.rtl)
			{
				sTemp += "<span class='ap-content-switch-tab ap-content-switch-time'>" + apo.setting.i18n.timeSwitch + "</span>";
				sTemp += "<span class='ap-content-switch-tab ap-content-switch-date ap-content-switch-selected'>" + apo.setting.i18n.dateSwitch + "</span>";
			}
			else
			{
				sTemp += "<span class='ap-content-switch-tab ap-content-switch-date ap-content-switch-selected'>" + apo.setting.i18n.dateSwitch + "</span>";
				sTemp += "<span class='ap-content-switch-tab ap-content-switch-time'>" + apo.setting.i18n.timeSwitch + "</span>";
			}
			sTemp += "</div>";
		
			apo.tmp.sDateTimeTab = "date";
		}
	
		sTemp += "<div class='ap-content-middle'>";

		sTemp += "<div class='ap-component-section'></div>";

		sTemp += "</div>"; // Close .ap-content-middle

		if(apo.setting.viewSections.contentBottom.length > 0)
			sTemp += "<div class='ap-content-bottom'></div>";
	
		sTemp += "</div>"; // Close .ap-content

		if(bAddSectionFooter || bAddSectionFooterFixedBottom)
		{
			sTemp += "<div class='ap-footer ap-footer-bottom'>";
			if($.CF.compareStrings(apo.setting.theme, "Default"))
				sTemp += "<div class='ap-button-cont'></div>";
			sTemp += "</div>";
		}

		sTemp += "</div>"; // Close .ap-cont

		sTemp += "</div>"; // Close .ap-bg

		sTemp += "</div>"; // Close .ap-overlay

		$(apo.setting.parent).append(sTemp);

		if(apo.setting.layout === "popover")
			$("body").addClass("noscroll");

		if($.AnyPicker.extra.bHasCSSAnimation)
		{
			$(apo.tmp.overlaySelector).addClass("ap-show");
			$(apo.tmp.overlaySelector).css({"display": "block"});
			if($.CF.compareStrings(apo.setting.layout, "fixed"))
			{
				if($.CF.compareStrings(apo.setting.vAlign, "top"))
					$(apo.tmp.overlaySelector).find(".ap-cont").addClass("ap-top-slide-down");
				else if($.CF.compareStrings(apo.setting.vAlign, "bottom"))
					$(apo.tmp.overlaySelector).find(".ap-cont").addClass("ap-bottom-slide-up");
			}
		
			setTimeout(function()
			{
				$(apo.tmp.overlaySelector).css({"opacity": 1});
				$(apo.tmp.overlaySelector).removeClass("ap-show");
				if($.CF.compareStrings(apo.setting.layout, "fixed"))
				{
					if($.CF.compareStrings(apo.setting.vAlign, "top"))
					{
						$(apo.tmp.overlaySelector).find(".ap-cont").removeClass("ap-top-slide-down");
						$(apo.tmp.overlaySelector + " .ap-cont").css({"top": 0});
					}
					else if($.CF.compareStrings(apo.setting.vAlign, "bottom"))
					{
						$(apo.tmp.overlaySelector).find(".ap-cont").removeClass("ap-bottom-slide-up");
						$(apo.tmp.overlaySelector + " .ap-cont").css({"bottom": 0});
					}
				}
			}, apo.setting.animationDuration);
		}
		else
		{
			$(apo.tmp.overlaySelector).show(0);
		}

		if($.CF.isValid(apo.setting.onShowPicker))
			apo.setting.onShowPicker.call(apo);

		apo._adjustPicker();
		apo._addViewSectionComponents();
		apo.__initComponents();
		apo._adjustPicker();

		apo.tmp.bIsManualDraggingAfterShow = false;

		if($.CF.compareStrings(apo.setting.mode, "datetime") && apo.tmp.sDateTimeMode === "datetime")
			apo._setDateTimeTabs(apo.tmp.sDateTimeTab);
	},

	_hidePicker: function()
	{
		var apo = this;
	
		if($(apo.tmp.overlaySelector).length > 0)
		{
			if($.CF.isValid(apo.setting.onBeforeHidePicker))
				apo.setting.onBeforeHidePicker.call(apo);

			if($.AnyPicker.extra.bHasCSSAnimation)
			{
				$(apo.tmp.overlaySelector).addClass("ap-hide");
				if($.CF.compareStrings(apo.setting.layout, "fixed"))
				{
					if($.CF.compareStrings(apo.setting.vAlign, "top"))
						$(apo.tmp.overlaySelector).find(".ap-cont").addClass("ap-top-slide-up");
					else if($.CF.compareStrings(apo.setting.vAlign, "bottom"))
						$(apo.tmp.overlaySelector).find(".ap-cont").addClass("ap-bottom-slide-down");
				}
				setTimeout(function()
				{
					$(apo.tmp.overlaySelector).remove();
				}, apo.setting.animationDuration);
			}
			else
			{
				$(apo.tmp.overlaySelector).hide(0);
				setTimeout(function()
				{
					$(apo.tmp.overlaySelector).remove();
				}, apo.setting.animationDuration);
			}

			if(apo.setting.layout === "popover")
				$("body").removeClass("noscroll");

			apo.tmp.prevActive = null;

			if($.CF.isValid(apo.setting.onHidePicker))
				apo.setting.onHidePicker.call(apo);
		}
	},

	_adjustPicker: function(iNumOfComp)
	{
		var apo = this;
		
		if($.CF.compareStrings(apo.setting.theme, "Windows"))
		{
			iNumOfComp = $.CF.isValid(iNumOfComp) ? parseInt(iNumOfComp) : apo.tmp.numOfComp;

			var iAvailableHeight = $(window).height(),
			iAvailableWidth = $(window).width(),
			bIsPortrait = apo._getDeviceOrientation() === "portrait",
			iPadding = 10, iMaxWidth;

			if(bIsPortrait)
				apo.setting.visibleRows = 5;
			else
				apo.setting.visibleRows = 3;

			if(!apo.setting.componentsCoverFullWidth)
			{
				if(!bIsPortrait)
				{
					iRowWidth = Math.floor(iAvailableHeight / 3);
					iMaxWidth = iRowWidth * iNumOfComp;
					iMaxWidth = (iAvailableHeight > iMaxWidth) ? iMaxWidth : iAvailableHeight;
					iPadding = (iAvailableWidth - iMaxWidth) / 2;
					iAvailableWidth = iAvailableHeight;
				}
				else
				{
					iRowWidth = Math.floor(iAvailableWidth / 3);
					iMaxWidth = iRowWidth * iNumOfComp;
					iPadding = (iAvailableWidth - iMaxWidth) / 2;
				}
				$(apo.tmp.overlaySelector).find(".ap-content-middle").css({"padding-left": iPadding, "padding-right": iPadding});
			}

			iAvailableWidth -= 16;
			var iRowHeight = Math.floor(iAvailableHeight / apo.setting.visibleRows),
			iRowWidth = Math.floor(iAvailableWidth / 3);
		
			if(!apo.setting.componentsCoverFullWidth)
				apo.setting.rowHeight = iRowWidth;
			else
			{
				iRowHeight = Math.floor(iAvailableHeight / apo.setting.visibleRows);
				apo.setting.rowHeight = iRowHeight;
			}

			var iCalculatedHeight = apo.setting.rowHeight * apo.setting.visibleRows,
			iContTop = (iAvailableHeight - iCalculatedHeight) / 2,
			iContentTop, iContentBottom;
			$(apo.tmp.overlaySelector).find(".ap-content").css({"top": iContTop});
		
			iContTop += 2;
			iContentTop = $(apo.tmp.overlaySelector).find(".ap-header").height() - iContTop;
			$(apo.tmp.overlaySelector).find(".ap-content-top").css({"top": iContentTop});
			iContTop -= 2;
			iContentBottom = $(apo.tmp.overlaySelector).find(".ap-footer").height() + iContTop;
			$(apo.tmp.overlaySelector).find(".ap-content-bottom").css({"bottom": iContentBottom});

			apo.tmp.iExt = Math.floor(apo.setting.visibleRows / 2);
		}
	
		var $oRelativeTo = $((apo.setting.relativeTo === null) ? apo.setting.inputElement : apo.setting.relativeTo),
		iTop = $oRelativeTo.offset().top, 
		iLeft = $oRelativeTo.offset().left, 
		iWidth = $oRelativeTo.outerWidth();
		if($.CF.compareStrings(apo.setting.layout, "popover"))
		{
			var iBodyScrollTop = $("body").scrollTop(),
			iWinWidth = $(window).outerWidth(),
			iWinHeight = $(window).outerHeight(),
			iMinTop = iBodyScrollTop,
			iMaxTop = iBodyScrollTop + iWinHeight,
			iInputTop = $(apo.setting.inputElement).offset().top - iBodyScrollTop,
			iInputHeight = $(apo.setting.inputElement).outerHeight(),
			iInputBottom = iInputTop + iInputHeight,
			iInputLeft = $(apo.setting.inputElement).offset().left,
			iInputWidth = $(apo.setting.inputElement).outerWidth(),
			iInputRight = iInputLeft + iInputWidth,
			iPopupWidth = $(apo.tmp.overlaySelector).find(".ap-cont").outerWidth(),
			iPopupHeight = $(apo.tmp.overlaySelector).find(".ap-cont").outerHeight(),
			iPopupTop, iPopupLeft, iPopupBottom,
			iTooltipHeight = 10,
			iTooltipWidth = 10;

			if(apo.tmp.sTooltip === "top")
			{
				iPopupTop = iInputTop - iPopupHeight - iTooltipHeight;				
				iPopupBottom = (iPopupTop < 0) ? 5 : iPopupTop;
				iPopupLeft = iInputLeft + 5;
			}
			else if(apo.tmp.sTooltip === "bottom")
			{
				iPopupTop = iInputBottom + iTooltipHeight;
				iPopupLeft = iInputLeft + 5;
				if(apo.tmp.sDir === "rtl")
					iPopupLeft = iInputRight - iPopupWidth;
			}
			else if(apo.tmp.sTooltip === "left")
			{
				iPopupTop = iInputTop - ((iPopupHeight / 2) - (iInputHeight / 2));
				iPopupTop = (iPopupTop < iMinTop) ? 5 : iPopupTop;
				iPopupLeft = iInputLeft + iInputWidth + 5;
			}
			else if(apo.tmp.sTooltip === "right")
			{
				iPopupTop = iInputTop - ((iPopupHeight / 2) - (iInputHeight / 2));
				iPopupTop = (iPopupTop < iMinTop) ? 5 : iPopupTop;
				iPopupLeft = iInputLeft - (iPopupWidth + iTooltipWidth);
			}
			$(apo.tmp.overlaySelector).find(".ap-cont").css({"position": "absolute", "left": iPopupLeft, "top": iPopupTop});
		}
		else if($.CF.compareStrings(apo.setting.layout, "inline"))
		{
			$(apo.tmp.overlaySelector).find(".ap-cont").css({"position": "absolute", "width": iWidth, "left": iLeft, "top": iTop});
		}
		else if($.CF.compareStrings(apo.setting.layout, "relative"))
		{
			$oRelativeTo = $((apo.setting.relativeTo === null) ? apo.setting.inputElement : apo.setting.relativeTo);
			var iDocLeft = 0, 
			iDocRight = $(document).outerWidth(),
			iContWidth = $(".ap-cont").outerWidth(),
			iRelElemWidth = iWidth;

			iWidth = (iRelElemWidth > iContWidth) ? iContWidth : iRelElemWidth;
			iTop = iTop + $oRelativeTo.outerHeight();

			if($.CF.compareStrings(apo.setting.hAlign, "center"))
				iLeft = (iRelElemWidth > iWidth) ? (iLeft + (iWidth/2)) : ((iRelElemWidth === iWidth) ? iLeft : (iLeft - (iWidth/2)));
			else if($.CF.compareStrings(apo.setting.hAlign, "right"))
				iLeft = iLeft - iWidth;

			iLeft = (iLeft < iDocLeft) ? (iDocLeft + 5) : iLeft;
			var iRight = iLeft + iWidth;

			if(iRight > iDocRight)
			{
				if(iLeft > (iDocLeft + 5))
				{
					iLeft = iLeft - (iRight - (iDocRight + 5));
					iLeft = (iLeft < iDocLeft) ? (iDocLeft + 5) : iLeft;
					iRight = iLeft + iWidth;
					iWidth = (iRight > iDocRight) ? (iDocRight - 10) : iWidth;
				}
				else
				{
					iWidth = iDocRight - 10;
				}
			}
		
			$(apo.tmp.overlaySelector).find(".ap-cont").css({"position": "absolute", "min-width": iWidth, "left": iLeft, "top": iTop});
		}
		else if($.CF.compareStrings(apo.setting.layout, "fixed"))
		{
			if($.CF.compareStrings(apo.setting.vAlign, "top"))
				$(apo.tmp.overlaySelector + " .ap-cont").css({"top": -1000});
			else if($.CF.compareStrings(apo.setting.vAlign, "bottom"))
				$(apo.tmp.overlaySelector + " .ap-cont").css({"bottom": -1000});
		}
	},

	_addViewSectionComponents: function()
	{
		var apo = this;
		var iTempIndex1, iTempIndex2,
		bWindowsTheme = $.CF.compareStrings(apo.setting.theme, "Windows");

		for(iTempIndex1 = 0; iTempIndex1 < $.AnyPicker.extra.sArrViewSections.length; iTempIndex1++)
		{
			var sViewSection = $.AnyPicker.extra.sArrViewSections[iTempIndex1];
			var sArrComponents = apo.setting.viewSections[sViewSection];
			if(sArrComponents.length > 0)
			{
				for(iTempIndex2 = 0; iTempIndex2 < sArrComponents.length; iTempIndex2++)
				{
					var sComp = sArrComponents[iTempIndex2],
					oComp = apo.setting[sComp] || null,
					$oCompElem = $(oComp.markup);
					if(bWindowsTheme && $.CF.isValid(oComp.markupContentWindows))
						$oCompElem.html(oComp.markupContentWindows);

					if(oComp !== undefined && oComp !== null && oComp !== "")
					{
						if($.CF.compareStrings(sViewSection, "header"))
						{
							$(apo.tmp.overlaySelector).find(".ap-header").append($oCompElem); // Append Component
							if($.CF.compareStrings(oComp.type, "Button") && $.CF.compareDataType(oComp.action, "function"))
								$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, oComp.action); // Bind Action
						}
						else if($.CF.compareStrings(sViewSection, "contentTop"))
						{
							$(apo.tmp.overlaySelector).find(".ap-content-top").append($oCompElem); // Append Component
							if($.CF.compareStrings(oComp.type, "Button") && $.CF.compareDataType(oComp.action, "function"))
								$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, oComp.action); // Bind Action
						}
						else if($.CF.compareStrings(sViewSection, "contentBottom"))
						{
							$(apo.tmp.overlaySelector).find(".ap-content-bottom").append($oCompElem); // Append Component
							if($.CF.compareStrings(oComp.type, "Button") && $.CF.compareDataType(oComp.action, "function"))
								$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, oComp.action); // Bind Action
						}
						else if($.CF.compareStrings(sViewSection, "footer"))
						{
							var $oeButtonCont = $(apo.tmp.overlaySelector).find(".ap-button-cont");
							if($oeButtonCont.length > 0)
								$oeButtonCont.append($oCompElem);
							else
								$(apo.tmp.overlaySelector).find(".ap-footer").append($oCompElem); // Append Component
							if($.CF.compareStrings(oComp.type, "Button") && $.CF.compareDataType(oComp.action, "function"))
								$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, oComp.action); // Bind Action
						}

						if($.CF.compareStrings(sComp, "headerTitle") && $.CF.compareStrings(oComp.contentBehaviour, "Static"))
							$(apo.tmp.overlaySelector).find(".ap-header__title").text(apo.setting.i18n.headerTitle);
					
						if($.CF.compareStrings(sComp, "setButton"))
						{
							if(!bWindowsTheme || (bWindowsTheme && apo.tmp.bModified.set))
								$oCompElem.text(apo.setting.i18n.setButton);
							else if(bWindowsTheme && !apo.tmp.bModified.set)
								$oCompElem.find(".ap-button-text").text(apo.setting.i18n.setButton);
						}
						else if($.CF.compareStrings(sComp, "clearButton"))
						{
							if(!bWindowsTheme || (bWindowsTheme && apo.tmp.bModified.clear))
								$oCompElem.text(apo.setting.i18n.clearButton);
							else if(bWindowsTheme && !apo.tmp.bModified.clear)
								$oCompElem.find(".ap-button-text").text(apo.setting.i18n.clearButton);
						}
						else if($.CF.compareStrings(sComp, "nowButton"))
						{
							if(!bWindowsTheme || (bWindowsTheme && apo.tmp.bModified.now))
								$oCompElem.text(apo.setting.i18n.nowButton);
							else if(bWindowsTheme && !apo.tmp.bModified.now)
								$oCompElem.find(".ap-button-text").text(apo.setting.i18n.nowButton);
						}
						else if($.CF.compareStrings(sComp, "cancelButton"))
						{
							if(!bWindowsTheme || (bWindowsTheme && apo.tmp.bModified.cancel))
								$oCompElem.text(apo.setting.i18n.cancelButton);
							else if(bWindowsTheme && !apo.tmp.bModified.cancel)
								$oCompElem.find(".ap-button-text").text(apo.setting.i18n.cancelButton);
						}
					
						if($.CF.compareStrings(oComp.type, "Button"))
						{
							if(!$.CF.compareDataType(oComp.action, "function"))
							{
								if($.CF.compareStrings(sComp, "setButton"))
									$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, apo._setButtonAction);
								else if($.CF.compareStrings(sComp, "clearButton"))
									$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, apo._clearButtonAction);
								else if($.CF.compareStrings(sComp, "nowButton"))
									$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, apo._nowButtonAction);
								else if($.CF.compareStrings(sComp, "cancelButton"))
									$oCompElem.on("click." + apo.setting.timestamp, {"apo": apo}, apo._cancelButtonAction);
							}
						}
					}
				}
			}
		}

		if(bWindowsTheme)
		{
			$(".ap-button-icon, .ap-button-text").click(function(e)
			{
				$(this).closest(".ap-button").trigger("click");
			});
		}
	
		$(apo.tmp.overlaySelector).find(".ap-button")
		.on("mousedown touchstart", function(e)
		{
			//e.stopPropagation();
			//e.preventDefault();
			$(this).addClass("ap-button-active");
		})
		.on("mouseup touchend", function(e)
		{
			//e.stopPropagation();
			//e.preventDefault();
			$(this).removeClass("ap-button-active");
		});
	
		$(window).on("blur." + apo.setting.timestamp, function(e)
		{
            apo.tmp.prevActive = document.activeElement;
    	});
	
    	$(apo.tmp.overlaySelector).off("click." + apo.setting.timestamp);
    
		setTimeout(function()
		{
			$(apo.tmp.overlaySelector).on("click." + apo.setting.timestamp, function(e)
			{
				var iDTDiff = Date.now() - apo.tmp.iCompDragStart;
				if(!apo.setting.bIsTouched && iDTDiff > 1000)
					apo._hidePicker();
			});
		}, 300);
	
		$(apo.tmp.overlaySelector).find(".ap-cont, .ap-cont *").on("click." + apo.setting.timestamp, function(e)
		{
			e.stopPropagation();
		});

		$(apo.tmp.overlaySelector).find(".ap-content-switch-date").click(function(e)
		{
			e.stopPropagation();
			apo._setDateTimeTabs("date");
		});

		$(apo.tmp.overlaySelector).find(".ap-content-switch-time").click(function(e)
		{
			e.stopPropagation();
			apo._setDateTimeTabs("time");
		});
	
		$(window).resize(function()
		{
			apo._adjustOnOrientationChange();
		});
	},

	_setDateTimeTabs: function(sSelectedTab)
	{
		var apo = this;
		var sDisabledTab = (sSelectedTab === "date") ? "time" : "date";
		apo.tmp.sDateTimeTab = sSelectedTab;

		$(apo.tmp.overlaySelector).find(".ap-content-switch-tab").removeClass("ap-content-switch-selected");
		$(apo.tmp.overlaySelector).find(".ap-content-switch-" + sSelectedTab).addClass("ap-content-switch-selected");
		var $oeDisabledTabs = $(apo.tmp.overlaySelector).find("[data-type='" + sDisabledTab + "']"),
		$oeSelectedTabs = $(apo.tmp.overlaySelector).find("[data-type='" + sSelectedTab + "']");
		$oeDisabledTabs.css("display", "none");
		$oeSelectedTabs.css("display", "table-cell");
		
		if($.CF.compareStrings(apo.setting.theme, "Windows"))
			apo._adjustPicker($oeSelectedTabs.length);
	},

	_setOutput: function()
	{
		var apo = this;
		var sOutput = "";

		if($.CF.isValid(apo.setting.formatOutput))
		{
			sOutput = apo.setting.formatOutput.call(apo, apo.tmp.selectedValues, apo.tmp.bIsManualDraggingAfterShow);
		}
		else
		{
			if($.CF.compareStrings(apo.setting.mode, "select"))
			{
				for(var iCompIndex = 0; iCompIndex < apo.tmp.numOfComp; iCompIndex++)
				{
					if(iCompIndex !== 0)
						sOutput += " ";
					sOutput += apo.tmp.selectedValues.values[iCompIndex].label;
				}
			}
			else if($.CF.compareStrings(apo.setting.mode, "datetime"))
			{
				sOutput = apo.formatOutputDates(apo.tmp.selectedValues.date, apo.tmp.bIsManualDraggingAfterShow);
			}
		}

		if(apo.tmp.oElemValid.bIsListItem || apo.tmp.oElemValid.bIsSelect)
		{
			var sChild, $oChildElem;
			if(apo.tmp.oElemValid.bIsListItem)
				sChild = "li";
			else if(apo.tmp.oElemValid.bIsSelect)
				sChild = "option";
			$(apo.elem).find(sChild).each(function()
			{
				$oChildElem = $(this);

				var sValue = $oChildElem.attr("value") || $oChildElem.data("value") || $oChildElem.text();

				if(apo.tmp.selectedValues.values[0].val === sValue)
				{
					if(apo.tmp.oElemValid.bIsSelect)
						$oChildElem.attr("selected", true);
					else if(apo.tmp.oElemValid.bIsListItem)	
						$oChildElem.attr("data-selected", true);
				}
				else
				{
					if(apo.tmp.oElemValid.bIsSelect)
						$oChildElem.attr("selected", false);
					else if(apo.tmp.oElemValid.bIsListItem)
						$oChildElem.attr("data-selected", false);
				}
			});
		}

		if($.CF.isValid(apo.setting.setOutput))
			apo.setting.setOutput.call(apo, sOutput, apo.tmp.selectedValues, apo.tmp.bIsManualDraggingAfterShow);
		else
		{
			if(apo.setting.inputElement !== null)
			{	
				var $oInput = $(apo.setting.inputElement);
				if(apo.tmp.oInputElemValid.bIsInput)
				{
					$oInput.val(sOutput);
				}
				else
				{
					$oInput.text(sOutput);
				}
			}

			if($.CF.isValid(apo.setting.onSetOutput))
				apo.setting.onSetOutput.call(apo, sOutput, apo.tmp.selectedValues, apo.tmp.bIsManualDraggingAfterShow);
		}
	},

	_clearOutput: function()
	{
		var apo = this;

		var $oInput = $(apo.setting.inputElement);
		if(apo.tmp.oInputElemValid.bIsInput)
			$oInput.val("");
		else
			$oInput.text("");
	},

	_setButtonAction: function(e)
	{
		var apo = e.data.apo;

		apo._setOutput();
		apo.showOrHidePicker();
	},

	_clearButtonAction: function(e)
	{
		var apo = e.data.apo;
	
		apo.tmp.selectedDate = $.AnyPicker.extra.dToday;
		if(apo.tmp.sInputElemTag !== "" && !(apo.tmp.oInputElemValid.bIsListItem || apo.tmp.oInputElemValid.bIsSelect))
		{
			var $oInput = $(apo.setting.inputElement);
			
			if(apo.tmp.oInputElemValid.bIsInput)
				$oInput.val("");
			else
				$oInput.text("");
		}
		apo.showOrHidePicker();
	},

	_nowButtonAction: function(e)
	{
		var apo = e.data.apo;
	
		if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			apo.tmp.selectedDate = apo._getCurrentDate();
			apo._setSelectedAndInvalidValuesForRows();
		}
	},

	_cancelButtonAction: function(e)
	{
		var apo = e.data.apo;
		apo.showOrHidePicker();
	},

	_getDeviceOrientation: function()
	{
		var $window = $(window);
		if($window.width() > $window.height())
			return "landscape";
		else
			return "portrait";
	},

	_adjustOnOrientationChange: function()
	{
		var apo = this;

		var sCurrentOrientation = apo._getDeviceOrientation();
		if(sCurrentOrientation !== apo.tmp.sOrientation)
		{
			$("body").prepend("<div class='ap-loading'>Loading</div>");
			apo.tmp.sOrientation = sCurrentOrientation;
			apo._adjustPicker();
			apo.reloadAllComponents();
		}
	}

};

// --------------------------------- Functions : AnyPicker.Core End --------------------------------------




// --------------------------------- Global Variables : AnyPicker.PickerComponent Start -----------------------------------

//"use strict";

$.AnyPicker = $.extend(true, $.AnyPicker, {

	defaults: // Defaults Settings
	{
		components: null,
		dataSource: null,

		showComponentLabel: false,
		componentsCoverFullWidth: false,
		visibleRows: 3,
		maxRows: 0,
		rowHeight: 50,

		rowsNavigation: "scroller",

		//------------------ Callback Functions Start --------------------------

		rowView: null, // (componentNumber, rowNumber, dataSourceRecord)
		onChange: null // (componentNumber, rowNumber, selectedValues)

		//------------------ Callback Functions End ----------------------------
	},

	tempDefaults: // Plugin-level Variables required to maintain state across methods
	{
		numOfComp: 0,
		selectedValues: {},

		bIsManualDraggingAfterShow: true,
		bIsManualDragging: false,
		bIsTouched: false,
		iTS: 0,

		iPos: 0,
		iPosPrev: 0,
		iPosStop: 0,

		iOffset: 0,
		iOffsetPrev: 0,

		iVelocity: 0,
		iAmplitude: 0,

		oVelocityTicker: null,
		oScrollTicker: null,

		iMinTopPos: 0, 
		iMaxTopPos: 0,
		oScrollingComp: null,
		iScrollingComp: -1,

		iTmConst: 100,
		bEnd: false
	},

	extra: // Common Temporary Variables
	{
		sArrRowsNavigation: ["scroller+buttons", "scroller", "buttons"]
	}

});

// --------------------------------- Global Variables : AnyPicker.PickerComponent End --------------------------------------

// --------------------------------- Functions : AnyPicker.PickerComponent Start ------------------------------------

AnyPicker.prototype = $.extend(AnyPicker.prototype, {

	__initComponents: function()
	{
		var apo = this;
	
		if(!apo.tmp.bFirst)
		{
			if($.CF.compareStrings(apo.setting.mode, "select"))
				apo.__setComponentsOfSelect();
			else if($.CF.compareStrings(apo.setting.mode, "datetime"))
				apo.__setComponentsOfDateTimePicker();
		}
		else
			apo.tmp.bFirst = false;
	
		var iNumOfComponents = apo.tmp.numOfComp || apo.setting.components.length;

		if(iNumOfComponents > 0)
		{
			if(apo.setting.components.length > 0) // Length of actual components array
				apo.reloadAllComponents();
			else
				console.log("For apo.setting.mode \n 1. Select - \n Please set apo.setting.components 2. DateTime - \n Please enter a valid outputDateTimeFormat ");
		}
	},

	// Public Method
	reloadAllComponents: function()
	{
		var apo = this;
		var iTempIndex;

		$(apo.setting.parent).find(".ap-component-section").html("");

		$("body").prepend("<div class='ap-loading'></div>");
	
		for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{
			apo.reloadComponent(iTempIndex, false);
		}
	
		apo.adjustComponents();
		apo.setSelectedAndInvalidValuesForRows(true);
	},

	// Public Method
	reloadComponent: function(iComp, bSingleLoad)
	{
		var apo = this;
		var sTemp = "";

		var iNumRows, iRowIndex,
		oSData = apo.setting.dataSource[iComp].data,
		bIsSelected = false, sClassSelectedRow,
		sCompId = "ap-component-" + iComp,
		$oeComp = $(apo.setting.parent).find("#" + sCompId),
		oComp = apo.setting.components[iComp],
		sType = $.CF.isValid(oComp.type) ? oComp.type : oComp.label,
		sWidth = $.CF.isValid(oComp.width) ? ("width: " + oComp.width) : "",
		sAlign = apo.setting.rtl ? ($.CF.compareStrings(oComp.textAlign, "left") ? "right" : $.CF.compareStrings(oComp.textAlign, "right") ? "left" : "") : oComp.textAlign,
		sTextAlign = $.CF.isValid(sAlign) ? ("text-align: " + sAlign) : "";
	
		if($oeComp.length === 0)
			sTemp += "<div class='ap-component' id='" + sCompId + "' data-type='" + sType + "' " + (sWidth !== "" ? ("style='" + sWidth + ";'") : "") + ">";

		if(!$.CF.compareStrings(apo.setting.theme, "Windows"))
		{
			if(apo.setting.showComponentLabel)
				sTemp += "<div class='ap-component-label' " + (sTextAlign !== "" ? ("style='" + sTextAlign + ";'") : "") + ">" + oComp.label + "</div>";
		}

		if($.CF.compareStrings(apo.setting.rowsNavigation, "scroller+buttons") || $.CF.compareStrings(apo.setting.rowsNavigation, "buttons"))
			sTemp += "<div class='ap-component-plus ap-icon-arrow-up-filled' " + (sTextAlign !== "" ? ("style='" + sTextAlign + ";'") : "") + "></div>";

		sTemp += "<div class='ap-component-cont' tabindex='0'>";

		sTemp += "<div class='ap-component-data' role='listbox' aria-label='" + oComp.label + "'>";

		for(iRowIndex = 0; iRowIndex < apo.tmp.iExt; iRowIndex++)
		{
			sTemp += "<div class='ap-row ap-row-ext'></div>";
		}

		for(iRowIndex = 0; iRowIndex < oSData.length; iRowIndex++)
		{
			bIsSelected = ($.CF.isValid(oSData[iRowIndex].selected) ? oSData[iRowIndex].selected : false);
			sClassSelectedRow = bIsSelected ? "ap-row-selected" : "";
			sTemp += "<div class='ap-row " + sClassSelectedRow + "' id='ap-row-" + iComp + "-" + iRowIndex+ "' data-value='" + oSData[iRowIndex].val + "' data-label='" + oSData[iRowIndex].label + "' role='option' aria-selected='" + bIsSelected + "' " + (sTextAlign !== "" ? ("style='" + sTextAlign + ";'") : "") + ">";

			if($.CF.compareStrings(apo.setting.theme, "Windows"))
			{
				sTemp += "<div class='ap-row-bg'>";
				if(!$.CF.isValid(apo.setting.rowView))
					sTemp += "<div class='ap-row-content'>";
			}
		
			if($.CF.isValid(apo.setting.rowView))
				sTemp += apo.setting.rowView.call(apo, iComp, iRowIndex, oSData[iRowIndex]);
			else
				sTemp += oSData[iRowIndex].label;

			if($.CF.compareStrings(apo.setting.theme, "Windows") && !$.CF.isValid(apo.setting.rowView))
			{
				sTemp += "</div>";
				sTemp += "<div class='ap-row-label'>";
				if(apo.setting.showComponentLabel)
					sTemp += oComp.label;
				sTemp += "</div>";
			}

			if($.CF.compareStrings(apo.setting.theme, "Windows"))
				sTemp += "</div>";
		
			sTemp += "</div>";
		}

		for(iRowIndex = 0; iRowIndex < apo.tmp.iExt; iRowIndex++)
		{
			sTemp += "<div class='ap-row ap-row-ext'></div>";
		}

		sTemp += "</div>";

		sTemp += "<div class='ap-component-gradient'></div>";
		sTemp += "<div class='ap-component-selector' id='ap-component-selector-" + iComp + "'></div>";

		sTemp += "</div>";

		if($.CF.compareStrings(apo.setting.rowsNavigation, "scroller+buttons") || $.CF.compareStrings(apo.setting.rowsNavigation, "buttons"))
			sTemp += "<div class='ap-component-minus ap-icon-arrow-down-filled' " + (sTextAlign !== "" ? ("style='" + sTextAlign + ";'") : "") + "></div>";

		if($oeComp.length === 0)
			sTemp += "</div>";
	
		if($oeComp.length > 0)
			$oeComp.html(sTemp);
		else
			$(apo.setting.parent).find(".ap-component-section").append(sTemp);

		apo._bindEventsToComponent(iComp);

		if($oeComp.length > 0 || bSingleLoad)
			apo.adjustComponents();
		if(bSingleLoad)
			apo.setSelectedAndInvalidValuesForRows(true);
	},

	_bindEventsToComponent: function(iComp)
	{
		var apo = this;
		var $oParent = $("#ap-component-" + iComp),
		$oCompCont = $oParent.find(".ap-component-cont"),
		oData = 
		{
			component: iComp,
			apo: apo
		};

		if($.CF.compareStrings(apo.setting.rowsNavigation, "scroller+buttons") || $.CF.compareStrings(apo.setting.rowsNavigation, "scroller"))
		{
			$oCompCont.on($.AnyPicker.extra.sStartEv + "." + apo.setting.timestamp, oData, apo._onStartDrag);
			$oCompCont.on($.AnyPicker.extra.sMoveEv + "." + apo.setting.timestamp, oData, apo._onDrag);
			if($.CF.isValid($.AnyPicker.extra.sEndEv))
				$oCompCont.on($.AnyPicker.extra.sEndEv + "." + apo.setting.timestamp, oData, apo._onEndDrag);
			if($.CF.isValid($.AnyPicker.extra.sOutEv))
				$oCompCont.on($.AnyPicker.extra.sOutEv + "." + apo.setting.timestamp, oData, apo._onEndDrag);
		
			if($.AnyPicker.extra.sMouseWheel.length > 0)
			{
				for(var iEventIndex = 0; iEventIndex < $.AnyPicker.extra.sMouseWheel.length; iEventIndex++)
					$oCompCont.on($.AnyPicker.extra.sMouseWheel[iEventIndex] + "." + apo.setting.timestamp, oData, apo._onMouseWheelScroll);
			}
		}

		if($.CF.compareStrings(apo.setting.rowsNavigation, "scroller+buttons") || $.CF.compareStrings(apo.setting.rowsNavigation, "buttons"))
		{
			$oParent.find(".ap-component-plus").on("click." + apo.setting.timestamp, oData, apo._onClickButtonMinus);
			$oParent.find(".ap-component-minus").on("click." + apo.setting.timestamp, oData, apo._onClickButtonPlus);
		}

		$oCompCont.on("keydown." + apo.setting.timestamp, oData, apo._onKeyDown);
		$oCompCont.on("keyup." + apo.setting.timestamp, oData, apo._onKeyUp);
	},

	// Public Method
	adjustComponents: function()
	{
		var apo = this;
		var $overlaySelector = $(apo.tmp.overlaySelector);
		$overlaySelector.find(".ap-component-cont").css({"height": (apo.setting.rowHeight * apo.setting.visibleRows)});
		$overlaySelector.find(".ap-row, .ap-component-selector").css({"height": apo.setting.rowHeight, "line-height": apo.setting.rowHeight + "px"});
		$overlaySelector.find(".ap-row-bg").css({"height": apo.setting.rowHeight - 8});
	
		if(!$.CF.compareStrings(apo.setting.theme, "Windows"))
		{
			var iContWidth = $(".ap-cont").width(),
			iContHeight = $(".ap-cont").height(),
			iWinWidth = $(window).width(),
			iWinHeight = $(window).height(),
			iWidth = iWinWidth, 
			iHeight = iWinHeight,
			bWidthChanged = false, bHeightChanged = false;

			if(iContWidth > iWinWidth)
			{
				bWidthChanged = true;
				iWidth = iContWidth + 20;
			}
			if(iContHeight > iWinHeight)
			{
				bHeightChanged = true;
				iHeight = iContHeight + 20;
			}

			if(bWidthChanged || bHeightChanged)
			{
				$overlaySelector.css({"position": "absolute", "height": iHeight, "width": iWidth});
				
				if($.CF.compareStrings(apo.setting.layout, "fixed"))
					$(".ap-cont").css({"position": "absolute"});
			}
			
			if($.CF.compareStrings(apo.setting.layout, "relative"))
			{
				var $oRelativeTo = $((apo.setting.relativeTo === null) ? apo.setting.inputElement : apo.setting.relativeTo),
				$oAPCont = $overlaySelector.find(".ap-cont"),
				iTop = $oRelativeTo.offset().top + $oAPCont.height();
				if($.CF.compareStrings(apo.setting.vAlign, "top"))
					$oAPCont.css({"top": iTop});
			}
		}

		setTimeout(function()
		{
			$(".ap-loading").remove();
		}, 0);
	},

	_onStartDrag: function(e)
	{
		var apo = e.data.apo;

		if(!apo.tmp.bIsManualDragging)
		{
			apo.tmp.bIsManualDraggingAfterShow = true;
			apo.tmp.bIsManualDragging = true;
		}
		apo.tmp.bIsTouched = true;
		apo.tmp.bEnd = false;
		apo.tmp.iPos = apo._getTouchPosition(e);
		apo.tmp.bFromTouchStart = true;
		apo._setScrollingData(e);
	
		if($.CF.compareStrings(apo.setting.theme, "Windows"))
		{
			var $oComp = $(apo.tmp.overlaySelector).find("#ap-component-" + apo.tmp.iScrollingComp);
		
			if(apo.tmp.bIsManualDragging)
			{
				$(apo.tmp.overlaySelector).find(".ap-component").removeClass("ap-component-modifying");
				$oComp.addClass("ap-component-modifying");
			}
		}
	
		if(e.type === "mousedown")
		{
			$(document).on("mousemove." + apo.setting.timestamp, e.data, apo._onDrag);
			$(document).on("mouseup." + apo.setting.timestamp, e.data, apo._onEndDrag);
		}

		e.preventDefault();
	    e.stopPropagation();
	    return false;
	},

	_onDrag: function(e)
	{
		var apo = e.data.apo;
		var iPosNew, iDSDelta, iTSDelta, iTSNDelta, iDSTS, iDir, iDSTSDiff,
		iTSNew = Date.now();

		apo._clearScrollTicker();

		if(apo.tmp.bIsTouched && (!$.AnyPicker.extra.bHasPointer || $.AnyPicker.extra.bHasPointer && (apo.tmp.bFromTouchStart || (!apo.tmp.bFromTouchStart && (iTSNew - apo.tmp.iTS > 1000)))))
		{
			iPosNew = apo._getTouchPosition(e);
			iTSNew = Date.now();
			iDSDelta = (apo.tmp.iPos - iPosNew);
			iDir = iDSDelta / Math.abs(iDSDelta);
		
			if(iDSDelta > 2 || iDSDelta < -2)
			{
				if($.CF.compareStrings(apo.setting.theme, "Windows"))
				{
					var $oComp = $(apo.tmp.overlaySelector).find("#ap-component-" + apo.tmp.iScrollingComp),
					$oAllRows =  $oComp.find(".ap-row");
					$oAllRows.attr("aria-selected", "false");
					$oAllRows.removeClass("ap-row-selected");
				}

				apo.tmp.iPosPrev = apo.tmp.iPos;
				apo.tmp.iPos = iPosNew;
				iTSDelta = iTSNew - apo.tmp.iTS;
				apo.tmp.iTS = iTSNew;
				iDSTS = (iDSDelta / iTSDelta);
				apo.tmp.iTotalDS += iDSDelta;
				iDSTSDiff = apo.tmp.iPrevDSTS - iDSTS;
			
				if($.AnyPicker.extra.bHasPointer)
				{
					if($.AnyPicker.extra.bIsTouchDevice)
					{
						if(iDSDelta > 10 || iDSDelta < -10)
						{
							if($.CF.compareStrings(apo.setting.theme, "iOS"))
								iDSDelta = apo.setting.visibleRows * 4 * iDSTS;
							else
							{
								if(Math.abs(apo.tmp.iTotalDS) > 100)
								{
									if(iDSTS > 0.05)
									{
										if($.CF.compareStrings(apo.setting.theme, "Windows"))
											iDSDelta = iDSDelta * iTSDelta * 5;
										else
											iDSDelta = iDSDelta * iTSDelta * 2;
									}
									else
									{
										if(iDir === 1)
											iDSDelta = (iDir * apo.setting.rowHeight/2);
										else
											iDSDelta = (iDir * apo.setting.rowHeight/1.2);
									}
								}
								else if(iDSTS > 0.06 && Math.abs(iDSTSDiff) > 0.08)
								{
									if($.CF.compareStrings(apo.setting.theme, "Windows"))
										iDSDelta = iDSDelta * iTSDelta * 5;
									else
										iDSDelta = iDSDelta * iTSDelta * 2;
								}
								else
								{
									if(iDSDelta > 50 || iDSDelta < -50)
									{
										if($.CF.compareStrings(apo.setting.theme, "Windows"))
											iDSDelta = iDSDelta * iTSDelta * 5;
										else
											iDSDelta = iDSDelta * iTSDelta * 2;
									}
								}
							}
						}
						else
						{
							if(Math.abs(iDSTS) > 0.06 && Math.abs(iDSTSDiff) > 0.08)
							{
								if($.CF.compareStrings(apo.setting.theme, "Windows"))
									iDSDelta = iDSDelta * iTSDelta * 5;
								else
									iDSDelta = iDSDelta * iTSDelta * 2;
							}
							else
							{
								if(iDir === 1)
									iDSDelta = (iDir * apo.setting.rowHeight/2);
								else
									iDSDelta = (iDir * apo.setting.rowHeight/1.2);
							}
						}
					}
					else
					{
						if(iDSDelta < 2 && iDSDelta > -2 && iDSDelta !== 0)
							iDSDelta = (iDir * 5);

						if(iDSDelta > 5 || iDSDelta < -5)
							iDSDelta = (apo.setting.visibleRows / 10) * 320 * iDSTS;
						else
							iDSDelta = iDir * apo.setting.rowHeight;
					}
				}
				else
				{
					if(iDSDelta > 10 || iDSDelta < -10) // 10
						iDSDelta = iDSDelta + apo.setting.visibleRows * 16 * iDSTS; // 80 | 160
				}
				apo.tmp.iPrevDSTS = iDSTS;

				apo._scrollToPosition("drag", (apo.tmp.iOffset + iDSDelta), false, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");
				apo.tmp.bFromTouchStart = false;
			}
		}

		e.preventDefault();
	    e.stopPropagation();
	    return false;
	},

	_onEndDrag: function(e)
	{
		var apo = e.data.apo;
	
		if(!apo.tmp.bEnd)
		{
			apo.tmp.bEnd = true;
			apo.tmp.bIsTouched = false;
		
	   		apo._scrollToPosition("drag", apo.tmp.iOffset, true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");

		    if(e.type === "mouseup")
			{
				$(document).off("mousemove." + apo.setting.timestamp, apo._onDrag);
				$(document).off("mouseup." + apo.setting.timestamp, apo._onEndDrag);
			}
		}

		e.preventDefault();
	    e.stopPropagation();
	    return false;
	},

	_onMouseWheelScroll: function(e)
	{
		var apo = e.data.apo;
		var oData = e.data,
		iDelta;
	  	e = e || window.event; // old IE support

	  	if(oData.component !== apo.tmp.iScrollingComp)
	  		apo._setScrollingData(e);
	  	apo._clearScrollTicker();

		iDelta = e.wheelDelta ? (e.wheelDelta / 3) : (e.originalEvent.wheelDelta ? (e.originalEvent.wheelDelta / 3) : (e.detail ? (-e.detail / 3) : 0));
		apo._scrollToPosition("mouseWheel", (apo.tmp.iOffset - (iDelta)), true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");

		e.preventDefault();
	    e.stopPropagation();
	    return false;
	},

	_onClickButtonPlus: function(e)
	{
		var apo = e.data.apo;

		e.preventDefault();
	    e.stopPropagation();

		apo._setScrollingData(e);
		apo._clearScrollTicker();

		apo._scrollToPosition("button", (apo.tmp.iOffset + apo.setting.rowHeight), true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");
	},

	_onClickButtonMinus: function(e)
	{
		var apo = e.data.apo;

		e.preventDefault();
	    e.stopPropagation();

		apo._setScrollingData(e);
		apo._clearScrollTicker();

		apo._scrollToPosition("button", (apo.tmp.iOffset - apo.setting.rowHeight), true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");
	},

	_onKeyDown: function(e)
	{
		var apo = e.data.apo;

		e.preventDefault();
	    e.stopPropagation();

		apo._setScrollingData(e);
		apo._clearScrollTicker();

		if(e.keyCode === 38) // Up Arrow Key
		{
	        apo._scrollToPosition("key", (apo.tmp.iOffset - apo.setting.rowHeight), true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");
	    }
	    else if(e.keyCode === 40) // Down Arrow Key
	    {
	        apo._scrollToPosition("key", (apo.tmp.iOffset + apo.setting.rowHeight), true, "#ap-component-" + apo.tmp.iScrollingComp + " .ap-component-data");
	    }
	},

	_onKeyUp: function(e)
	{
		var apo = e.data.apo;

		e.preventDefault();
	    e.stopPropagation();

		apo._unsetScrollingData();
	},

	_getTouchPosition: function(e)
	{
		var apo = e.data.apo;

	    e = e.originalEvent || e;
	    return e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
	},

	_setScrollingData: function(e)
	{
		var apo = e.data.apo;

		apo.tmp.iScrollingComp = parseInt(e.data.component);
		apo.tmp.oScrollingComp = $("#ap-component-"+e.data.component).find(".ap-component-data");
		apo.tmp.iMinTopPos = 0;
		apo.tmp.iMaxTopPos = ($(apo.tmp.oScrollingComp).find(".ap-row").length * apo.setting.rowHeight) - $(apo.tmp.oScrollingComp).parent().innerHeight();
		apo.tmp.iTS = Date.now();
		apo.tmp.iCompDragStart = apo.tmp.iTS;
		apo.tmp.iOffsetStart = Math.abs($(apo.tmp.oScrollingComp).position().top);
		apo.tmp.iOffset = apo.tmp.iOffsetStart;
		apo.tmp.iOffsetPrev = apo.tmp.iOffsetStart;
		apo.tmp.iTimeout = 0;
		apo.tmp.iDir = 1;
		apo.tmp.iTotalDS = 0;
		apo.tmp.iPrevDSTS = 0;

		apo._clearScrollTicker();
	},

	_unsetScrollingData: function()
	{
		var apo = this;

		apo.tmp.bIsTouched = false;
		apo.tmp.iPos = 0;
		apo.tmp.iTS = 0;

		apo.tmp.iOffset = 0;
		apo.tmp.iTimeout = 0;

		apo.tmp.iMinTopPos = 0;
		apo.tmp.iMaxTopPos = 0;
		apo.tmp.oScrollingComp = null;
		apo.tmp.iScrollingComp = -1;
		apo.tmp.iDir = 0;

		apo._clearScrollTicker();

		$(document).off("mousemove." + apo.setting.timestamp);
		$(document).off("mouseup." + apo.setting.timestamp);
		$(document).off("touchend." + apo.setting.timestamp);
	},

	_getScrollingData: function()
	{
		var apo = this;
		var oScrollingData = {};

		oScrollingData.iScrollingComp = apo.tmp.iScrollingComp;
		oScrollingData.oScrollingComp = apo.tmp.oScrollingComp;
		oScrollingData.iMinTopPos = apo.tmp.iMinTopPos;
		oScrollingData.iMaxTopPos = apo.tmp.iMaxTopPos;
		oScrollingData.iTS = apo.tmp.iTS;
		oScrollingData.iCompDragStart = apo.tmp.iCompDragStart;
		oScrollingData.iOffsetStart = apo.tmp.iOffsetStart;
		oScrollingData.iOffset = apo.tmp.iOffset;
		oScrollingData.iOffsetPrev = apo.tmp.iOffsetPrev;
		oScrollingData.iTimeout = apo.tmp.iTimeout;
		oScrollingData.iDir = apo.tmp.iDir;

		return oScrollingData;
	},

	_clearScrollTicker: function()
	{
		var apo = this;

		clearTimeout(apo.tmp.oScrollTicker);
		apo.tmp.oScrollTicker = null;
	},

	/*
	
	sSource values can be - 

	1. auto
	2. drag
	3. mousewheel
	4. button
	5. key
	
	*/
	_scrollToPosition: function(sSource, iOffsetNew, bStop, sComp)
	{
		var apo = this;

		var iComp = apo.tmp.iScrollingComp,
		iDir = (iOffsetNew < apo.tmp.iOffset) ? 1 : (iOffsetNew === apo.tmp.iOffset) ? apo.tmp.iDir : -1, // Bottom Up : Top Down
		iPosMod = iOffsetNew % apo.setting.rowHeight,
		iHalfRowHeight = apo.setting.rowHeight / 4,
		iPrevOffset = apo.tmp.iOffset,
		iTime = 0.1;
	
		apo.tmp.iDir = iDir;

		if(bStop)
			iOffsetNew = (iPosMod !== 0) ? ((iPosMod < iHalfRowHeight) ? (iOffsetNew - iPosMod) : (iOffsetNew + (apo.setting.rowHeight - iPosMod))) : iOffsetNew;
	
		var iMinPosBounce = apo.tmp.iMinTopPos - apo.setting.rowHeight,
		iMaxPosBounce = apo.tmp.iMaxTopPos + apo.setting.rowHeight;
	
		apo.tmp.iOffset = (iOffsetNew > apo.tmp.iMaxTopPos) ? iMaxPosBounce : (iOffsetNew < apo.tmp.iMinTopPos) ? iMinPosBounce : iOffsetNew;

		if($.AnyPicker.extra.bHasCSS3D)
		{
			var iDiffOffset = Math.abs(iPrevOffset - apo.tmp.iOffset);

			if(sSource === "drag")
			{
		        if(iDiffOffset < (apo.setting.rowHeight * 6))
					iTime = (iDiffOffset / (apo.setting.rowHeight * 10)); // Increase Divisor value to increase speed
				else
		        {
		        	iTime = (iDiffOffset / (apo.setting.rowHeight * 10)); // Increase Divisor value to increase speed
					iTime = (iTime <= 0.2) ? 0.2 : iTime;
		        }
			}
			else
				iTime = 0.1;

			apo._performTransition(iComp, sComp, apo.tmp.iOffset, (apo.tmp.iTimeout/1000), apo.tmp.iMinTopPos, apo.tmp.iMaxTopPos, iDir, iMinPosBounce, iMaxPosBounce, sSource, bStop);
			apo.tmp.iTimeout = (apo.tmp.iTimeout - (Date.now() - apo.tmp.iTS)) + (iTime * 1000);
		}
		else
			apo._performTransition(iComp, sComp, apo.tmp.iOffset, iTime, apo.tmp.iMinTopPos, apo.tmp.iMaxTopPos, iDir, iMinPosBounce, iMaxPosBounce, sSource, bStop);
	},

	_performTransition: function(iComp, sComp, iOffset, iTime, iMinTopPos, iMaxTopPos, iDir, iMinPosBounce, iMaxPosBounce, sSource, bStop)
	{
		var apo = this;
		var oElem = $(apo.tmp.overlaySelector).find(sComp).get(0),
		iOffsetNew = apo._getOffset(oElem, true),
		iDiffOffset = Math.abs(iOffsetNew - iOffset),
		iExpTime = iDiffOffset / (apo.setting.rowHeight * 10); // Increase Divisor value to increase speed
	
		iTime = (iTime > iExpTime) ? iExpTime : iTime;
		iTime = (iTime < 0.1) ? 0.1 : iTime;
		iTime = ($.AnyPicker.extra.bHasPointer && apo.tmp.bIsTouched && sSource === "auto") ? 0 : iTime;

		if($.AnyPicker.extra.bHasCSS3D)
		{
			oElem.style[$.AnyPicker.extra.sCSSTransition] = $.AnyPicker.extra.sCSSTransformStyle + " " + iTime + "s ease-out";
			oElem.style[$.AnyPicker.extra.sCSSTransform] = "translate3d(0px, "+ -iOffset +"px, 0px)";
		}
		else
			$(oElem).animate({"top": -iOffset}, 100);
	
		apo.tmp.iOffset = iOffset;

		// ---------------------------------------------------------------

		var oScrollingData = apo._getScrollingData();
		apo._performTransitionAfter(oScrollingData, iMaxPosBounce, iMinPosBounce, sSource, iTime, bStop);
		apo._clearScrollTicker();
	},

	_performTransitionAfter: function(oScrollingData, iMaxPosBounce, iMinPosBounce, sSource, iTime, bStop)
	{
		var apo = this;

		setTimeout(function()
		{
			if(bStop && (sSource === "drag" || sSource === "mouseWheel"))
			{
				apo.tmp.oScrollTicker = 1;
				apo._scrollToRow(oScrollingData.iDir, iMaxPosBounce, iMinPosBounce, oScrollingData.iMinTopPos, oScrollingData.iMaxTopPos, sSource);
			}

			var oElem = $(oScrollingData.oScrollingComp).get(0),
			iOffset = (sSource === "auto") ? oScrollingData.iOffset : -apo._getOffset(oElem, false),
		
			bLTMin = (iOffset < oScrollingData.iMinTopPos),
			bGTMax = (iOffset > oScrollingData.iMaxTopPos),
		
			iOffsetNew = Math.abs(iOffset);
		
			if(bLTMin)
				iOffset = oScrollingData.iMinTopPos;
			else if(bGTMax)
				iOffset = oScrollingData.iMaxTopPos;

			if(bLTMin || bGTMax)
			{
				iTime = Math.abs(iOffsetNew - iOffset) / (apo.setting.rowHeight * 10);
				if($.AnyPicker.extra.bHasCSS3D)
				{
					oElem.style[$.AnyPicker.extra.sCSSTransition] = $.AnyPicker.extra.sCSSTransformStyle + " " + iTime + "s ease-out";
					oElem.style[$.AnyPicker.extra.sCSSTransform] = "translate3d(0px, "+ -Math.abs(iOffset) +"px, 0px)";
				}
				else
					$(oElem).animate({"top": -Math.abs(iOffset)}, 100);
			
				oScrollingData.iOffset = iOffset;
				iOffsetNew = iOffset;

				apo._skipDisabledRowAfter(oScrollingData, iOffsetNew, sSource, iTime, bStop);
			}
			else
			{
				if(bStop || (iOffsetNew === oScrollingData.iMinTopPos || iOffsetNew === oScrollingData.iMaxTopPos))
					apo._skipDisabledRow(sSource, oScrollingData.iScrollingComp, iOffsetNew, oScrollingData.iDir);
			}
		}, (iTime * 1000));
	},

	_skipDisabledRowAfter: function(oScrollingData, iOffsetNew, sSource, iTime, bStop)
	{
		var apo = this;

		setTimeout(function()
		{
			var iOffsetVal = (sSource === "auto") ? iOffsetNew : oScrollingData.iOffset;
			if(bStop || (iOffsetVal === oScrollingData.iMinTopPos || iOffsetVal === oScrollingData.iMaxTopPos))
				apo._skipDisabledRow(sSource, oScrollingData.iScrollingComp, iOffsetVal, oScrollingData.iDir);
		}, (iTime * 1000));
	},

	_getOffset: function(oElem, bAbs)
	{
		var sMatrix = $(oElem).hasClass("ap-component-data") ? $(oElem).css("transform") : $(oElem).find(".ap-component-data").css("transform"),
		iOffset = 0;

		if($.CF.isValid(sMatrix))
		{
			if(sMatrix === "none")
				iOffset = 0;
			else
			{
				sMatrix = sMatrix.replace("matrix(", "");
				sMatrix = sMatrix.replace(")", "");
				var iArrMatrix = sMatrix.split(", ");
				iOffset = (iArrMatrix.length > 6) ? parseInt(iArrMatrix[13]) : parseInt(iArrMatrix[5]);
			}
		}
	
		if(bAbs)
			return Math.abs(iOffset);
		else
			return iOffset;
	},

	_scrollToRow: function(iDir, iMaxPosBounce, iMinPosBounce, iMinTopPos, iMaxTopPos, sSource)
	{
		var apo = this;

		var iPosMod, iOffset, iTime;
		if(apo.tmp.oScrollTicker !== null)
		{
			var oElem = $(apo.tmp.oScrollingComp).get(0);
			iOffset = apo._getOffset(oElem, false);
			iPosMod = iOffset % apo.setting.rowHeight;
		
			if(iPosMod !== 0 || (iPosMod === 0 && (iOffset > iMinTopPos || iOffset < -iMaxTopPos)))
			{
				iOffset = Math.abs(iOffset);
				iOffset = (iDir === -1) ? (iOffset + (apo.setting.rowHeight - Math.abs(iPosMod))) : (iOffset + iPosMod);
				iOffset = (iOffset > iMaxTopPos) ? iMaxTopPos : (iOffset < iMinTopPos) ? iMinTopPos : iOffset;
			
				iTime = 0.4;
				if($.AnyPicker.extra.bHasCSS3D)
				{
					oElem.style[$.AnyPicker.extra.sCSSTransition] = $.AnyPicker.extra.sCSSTransformStyle + " " + iTime + "s ease-out";
					oElem.style[$.AnyPicker.extra.sCSSTransform] = "translate3d(0px, "+ -Math.abs(iOffset) +"px, 0px)";
				}
				else
					$(oElem).animate({"top": -Math.abs(iOffset)}, 100);
				apo.tmp.iOffset = iOffset;
			}
		}
	},

	__scrollToSelectedRow: function()
	{
		var apo = this;
		var iTempIndex;
		var e = {}, iTimeout = 0;

		if($.CF.compareStrings(apo.setting.mode, "datetime"))
			apo.__setSelectedDateTimeInComponent();
		for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
		{
			var oArrSelected = $(apo.tmp.overlaySelector).find("#ap-component-" + iTempIndex + " .ap-row-selected"),
			oElemSelected = (oArrSelected.length > 0) ? oArrSelected[0] : null;
			if(oElemSelected !== null)
			{
				var iPosTop = $(oElemSelected).position().top,
				iExtraHeight = (apo.tmp.iExt * apo.setting.rowHeight);
				iPosTop = (iPosTop === 0) ? iPosTop : (iPosTop - iExtraHeight);
			
				apo.callScrollToPosition(iTempIndex, apo, iPosTop, iTimeout);
				iTimeout += 200;
			}
		}
	},

	callScrollToPosition: function(iComp, oAPO, iPosTop, iTimeout)
	{
		var apo = this;
		var e = {};
		//setTimeout(function()
		//{
			e.data = { component: iComp, apo: oAPO };
			apo._setScrollingData(e);
			apo._scrollToPosition("auto", iPosTop, true, "#ap-component-" + iComp + " .ap-component-data");
		//}, iTimeout);
	},

	// Public Method
	setSelectedAndInvalidValuesForRows: function(bSetSelected)
	{
		var apo = this;

		if($.CF.compareStrings(apo.setting.mode, "select"))
			apo.__disableInvalidRowsOfSelect();
		else if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			if(bSetSelected)
				apo.__setSelectedDateTimeInComponent();
		
			$(apo.tmp.overlaySelector).find(".ap-row").removeClass("ap-row-disabled ap-row-invalid ap-row-hidden");
			apo.__disableInvalidRowsOfDateTimePicker();
			apo.__setDaysOfMonthInDatePicker();
		}

		if(bSetSelected)
			apo.__scrollToSelectedRow();
	},

	/*

	After the component stops scrolling, 

	Unset the values of the non-selected components in -

	1. apo.setting.dataSource
	2. Set aria-selected attribute as false

	set the value of the selected component in -

	1. apo.setting.dataSource
	2. aria-selected attribute of the selected DOM element

	*/
	__changeComponentValue: function(iComp, sNewValue)
	{
		var apo = this;
		var oComp = apo.setting.components[iComp],
		oDataSource = apo.setting.dataSource[iComp].data,
		iTempIndex, sElemId, $oElem;

		for(iTempIndex = 0; iTempIndex < oDataSource.length; iTempIndex++)
		{
			sElemId = "#ap-row-" + iComp + "-" + iTempIndex;
			$oElem = $(apo.tmp.overlaySelector).find(sElemId);
		
			if(oDataSource[iTempIndex].val === sNewValue)
			{
				oDataSource[iTempIndex].selected = true;
				$oElem.attr("aria-selected", "true");
				$oElem.addClass("ap-row-selected");
			}
			else
			{
				oDataSource[iTempIndex].selected = false;
				$oElem.attr("aria-selected", "false");
				$oElem.removeClass("ap-row-selected");
			}
		}
	},

	/*

	If picker component rests on the disabled row after scrolling, 

	1. Find the next enabled row to be selected in direction of scrolling.
	2. If enabled row cannot be found then search for enabled row in the opposite direction 

	Once row is found call _scrollToPosition()

	*/
	_skipDisabledRow: function(sSource, iComp, iOffset, iDir)
	{
		var apo = this;
		var sElemSel = "#ap-component-" + iComp + " .ap-component-data",
		oElem = $(apo.tmp.overlaySelector).find(sElemSel).get(0),
		iRow = Math.floor(iOffset / apo.setting.rowHeight),
		sPartialId = "#ap-row-" + iComp + "-",
		sRowId = sPartialId + iRow,
		iTotalRows = $(oElem).find(".ap-row").length - (2 * apo.tmp.iExt),
		bIsRowDisabled = $(oElem).find(sRowId).hasClass("ap-row-disabled"),
		iEnabledRow = -1,
		iDirPrev = 0, e = {},
		bSkippedRow = false;

		if($.CF.isValid(oElem) && bIsRowDisabled)
		{
			if(iDir === 1)
			{
				iEnabledRow = apo._findRows(iComp, iRow, iTotalRows, oElem, iDir);
				if(iEnabledRow === -1)
				{
					iDir = -1;
					iDirPrev = 1;
				}
			}
		
			if(iDir === -1)
			{
				iEnabledRow = apo._findRows(iComp, iRow, iTotalRows, oElem, iDir);
				if(iEnabledRow === -1 && iDirPrev === 0)
				{
					iDir = 1;
					iEnabledRow = apo._findRows(iComp, iRow, iTotalRows, oElem, iDir);
				}
			}

			var iNewOffset = (iEnabledRow !== -1) ? ($(oElem).find(sPartialId + iEnabledRow).position().top - (apo.tmp.iExt * apo.setting.rowHeight)) : -1;
			if(iEnabledRow !== -1 && iOffset !== iNewOffset)
			{
				bSkippedRow = true;
				e.data = { component: iComp, apo: apo };
				apo._setScrollingData(e);
				apo._scrollToPosition("auto", iNewOffset, true, sElemSel);
			}
			else
			{
				setTimeout(function()
				{
					apo._actionsOnComponentStop(sSource, iComp, iRow, iOffset, iDir);
				}, 200);
			}
		}
		else
		{
			setTimeout(function()
			{
				apo._actionsOnComponentStop(sSource, iComp, iRow, iOffset, iDir);
			}, 200);
		}
	},

	_actionsOnComponentStop: function(sSource, iComp, iRow, iOffset, iDir)
	{
		var apo = this;
		var iTempIndex, bReloaded = false, sHeaderTitle = "";
	
		apo.__setAriaSelectedForRowElement(iComp, iOffset, iDir);
		apo._getSelectedValueInComponent(null);
	
		if($.CF.compareStrings(apo.setting.inputChangeEvent, "onChange"))
			apo._setOutput();

		if(apo.tmp.sHeaderTitleType === "DynamicFunction")
		{
			sHeaderTitle = apo.setting.headerTitle.format.call(apo.tmp.selectedValues);
			$(apo.tmp.overlaySelector).find(".ap-header__title").text(sHeaderTitle);
		}
		else if(apo.tmp.sHeaderTitleType === "DynamicString")
		{
			if($.CF.compareStrings(apo.setting.mode, "select"))
			{
				for(var iCompIndex = 0; iCompIndex < apo.tmp.numOfComp; iCompIndex++)
				{
					if(iCompIndex !== 0)
						sHeaderTitle += " ";
					sHeaderTitle += apo.tmp.selectedValues.values[iCompIndex].label;
				}
			}
			else if($.CF.compareStrings(apo.setting.mode, "datetime"))
			{
				sHeaderTitle = apo.formatOutputDates(apo.tmp.selectedValues.date, apo.tmp.sArrHeaderTitleFormat);
			}

			var bSetHeaderTitle = true;
			if(!apo.tmp.bIsManualDragging) // !$.CF.compareStrings(apo.setting.theme, "iOS") && 
				bSetHeaderTitle = false;
			if(bSetHeaderTitle)
				$(apo.tmp.overlaySelector).find(".ap-header__title").text(sHeaderTitle);
		}
	
		if(sSource !== "auto" && $.CF.isValid(apo.setting.onChange))
			apo.setting.onChange.call(apo, iComp, iRow, apo.tmp.selectedValues, sSource);

		if(!bReloaded)
			apo.setSelectedAndInvalidValuesForRows(false);
	},

	/*

	Find rows in the scrolling component before/after a specified Row in a specified direction.
	
	*/
	_findRows: function(iComp, iRow, iTotalRows, oElem, iDir)
	{
		var apo = this;
		var iTempIndex;

		if(iDir === -1)
		{
			for(iTempIndex = (iRow + 1); iTempIndex < iTotalRows; iTempIndex++)
			{
				if(! $(oElem).find("#ap-row-" + iComp + "-" + iTempIndex).hasClass("ap-row-disabled"))
					return iTempIndex;
			}
		}
		else if(iDir === 1)
		{
			for(iTempIndex = (iRow - 1); iTempIndex > 0; iTempIndex--)
			{
				if(! $(oElem).find("#ap-row-" + iComp + "-" + iTempIndex).hasClass("ap-row-disabled"))
					return iTempIndex;
			}
		}

		return -1;
	},

	/*

	Validate selected values to ensure that the values are not specified as disabled values or they do not fall in the disabled values range.
	
	*/
	_validateSelectedValues: function()
	{
		var apo = this;

		if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			var dNewSelectedDate = apo.__getSelectedDate(false);
			apo.__validateSelectedDate(dNewSelectedDate, false);
		}
	},

	__setAriaSelectedForRowElement: function(iComp, iOffset, iDir)
	{
		var apo = this;
		var $oElemComp = $(apo.tmp.overlaySelector).find("#ap-component-" + iComp),
		iElementIndex;

		if(iOffset === 0)
			iOffset = apo._getOffset($oElemComp, true);
	
		if(iDir === 1)
			iElementIndex = Math.floor(iOffset / apo.setting.rowHeight);
		else if(iDir === -1)
			iElementIndex = Math.ceil(iOffset / apo.setting.rowHeight);

		var $oAllRows = $oElemComp.find(".ap-row"),
		$oThisRow = $oElemComp.find("#ap-row-" + iComp + "-" + iElementIndex);

		$oAllRows.attr("aria-selected", "false");
		$oAllRows.removeClass("ap-row-selected");
	
		$oThisRow.attr("aria-selected", "true");
		$oThisRow.addClass("ap-row-selected");
	},

	_getSelectedValueInComponent: function(iComp)
	{
		var apo = this;
		var iTempIndex, 
		$oSelectedElem, sSelectedValue, sSelectedDisplayValue, 
		oArrSelectedValues = [];

		apo.tmp.selectedValues = {};

		if($.CF.isValid(iComp))
		{
			$oSelectedElem = $(apo.tmp.overlaySelector).find("#ap-component-" + iComp + " .ap-row-selected");

			oArrSelectedValues.push(
			{
				component: iComp,
				val: $oSelectedElem.data("value"),
				label: $oSelectedElem.data("label")
			});
		}
		else
		{
			for(iTempIndex = 0; iTempIndex < apo.tmp.numOfComp; iTempIndex++)
			{
				$oSelectedElem = $(apo.tmp.overlaySelector).find("#ap-component-" + iTempIndex + " .ap-row-selected");
				
				oArrSelectedValues.push(
				{
					component: iTempIndex,
					val: $oSelectedElem.data("value"),
					label: $oSelectedElem.data("label")
				});
			}
		}

		apo.tmp.selectedValues.values = oArrSelectedValues;

		if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			apo.tmp.selectedValues.date = apo.__getSelectedDate(false);
			apo.tmp.selectedDate = apo.tmp.selectedValues.date;
		}
	},

	__getDataSourceValueFromLabel: function(sLabel, iInCompIndex, bSetSelected)
	{
		var apo = this;
		var iCompIndex, iTempIndex,
		oCompData, oData, sValue = "";

		if($.CF.isValid(iInCompIndex))
		{
			oCompData = apo.setting.dataSource[iInCompIndex].data;
			for(iTempIndex = 0; iTempIndex < oCompData.length; iTempIndex++)
			{
				oData = oCompData[iTempIndex];
				if($.CF.compareStrings(oData.label, sLabel))
				{
					sValue = oData.val;
					if(bSetSelected)
						oData.selected = true;
				}
				else
				{
					if(bSetSelected)
						oData.selected = false;
				}
				apo.setting.dataSource[iInCompIndex].data[iTempIndex] = oData;
			}
		}
		else
		{
			for(iCompIndex = 0; iCompIndex < apo.tmp.numOfComp; iCompIndex++)
			{
				oCompData = apo.setting.dataSource[iCompIndex].data;
				for(iTempIndex = 0; iTempIndex < oCompData.length; iTempIndex++)
				{
					oData = oCompData[iTempIndex];
					if($.CF.compareStrings(oData.label, sLabel))
					{
						if(bSetSelected)
							oData.selected = true;
						sValue = oData.val;
					}
					else
					{
						if(bSetSelected)
							oData.selected = false;
					}
				}
			}
		}

		return sValue;
	},

	__getValuesOfComponent: function(sValueOf, iComp)
	{
		var apo = this;
		var oValue = null, iCompIndex;

		if(sValueOf === "component")
		{
			if(apo.setting.components[iComp].component === iComp)
				oValue = apo.setting.components[iComp];
			else
			{
				for(iCompIndex = 0; iCompIndex < apo.tmp.numOfComp; iCompIndex++)
				{
					if(apo.setting.components[iCompIndex].component === iComp)
						oValue = apo.setting.components[iCompIndex];
				}
			}
		}
		else if(sValueOf === "datasource")
		{
			if(apo.setting.dataSource[iComp].component === iComp)
				oValue = apo.setting.dataSource[iComp];
			else
			{
				for(iCompIndex = 0; iCompIndex < apo.tmp.numOfComp; iCompIndex++)
				{
					if(apo.setting.dataSource[iCompIndex].component === iComp)
						oValue = apo.setting.dataSource[iCompIndex];
				}
			}
		}
	
		return oValue;
	}

});

// --------------------------------- Functions : AnyPicker.PickerComponent End --------------------------------------




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
			else
				sArrFormat = oFormat;
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


}());

