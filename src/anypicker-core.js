/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

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
		onSetOutput: null,

		buttonClicked: null 

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
			if($.CF.compareStrings(apo.setting.layout, "fixed"))
			{
				apo.setting.viewSections = {
					header: [],
					contentTop: [],
					contentBottom: [],
					footer: ["cancelButton", "headerTitle", "setButton"]
				};
			}
			else
			{
				apo.setting.viewSections = {
					header: ["cancelButton", "headerTitle", "setButton"],
					contentTop: [],
					contentBottom: [],
					footer: []
				};
			}
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

		if($.CF.isValid(apo.setting.buttonClicked))
			apo.setting.buttonClicked.call(apo, "set");
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

		if($.CF.isValid(apo.setting.buttonClicked))
			apo.setting.buttonClicked.call(apo, "clear");
	},

	_nowButtonAction: function(e)
	{
		var apo = e.data.apo;
	
		if($.CF.compareStrings(apo.setting.mode, "datetime"))
		{
			apo.tmp.selectedDate = apo._getCurrentDate();
			apo._setSelectedAndInvalidValuesForRows();
		}

		if($.CF.isValid(apo.setting.buttonClicked))
			apo.setting.buttonClicked.call(apo, "now");
	},

	_cancelButtonAction: function(e)
	{
		var apo = e.data.apo;
		apo.showOrHidePicker();

		if($.CF.isValid(apo.setting.buttonClicked))
			apo.setting.buttonClicked.call(apo, "cancel");
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
