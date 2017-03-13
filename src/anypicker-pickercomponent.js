/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

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
