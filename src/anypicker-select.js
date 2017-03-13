/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.9
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/AnyPicker/contributors
  Repository : https://github.com/nehakadam/AnyPicker
  Homepage : https://nehakadam.github.io/AnyPicker

 ----------------------------------------------------------------------------- */

// --------------------------------- Functions : AnyPicker.Select Start ------------------------------------

//"use strict";

AnyPicker.prototype = $.extend(AnyPicker.prototype, {

	__setComponentsOfSelect: function()
	{
		var apo = this;

		if(apo.setting.dataSource === null)
		{
			if(apo.tmp.oElemValid.bIsListItem || apo.tmp.oElemValid.bIsSelect)
			{
				var sChild, $oChildElem;
				apo.setting.components = [];

				var oComponent = {};
				oComponent.component = 1;
				oComponent.name = $(apo.elem).data("name");
				oComponent.label = $(apo.elem).data("label");
				apo.setting.components.push(oComponent);

				var oArrData = [];

				if(apo.tmp.oElemValid.bIsListItem)
					sChild = "li";
				else if(apo.tmp.oElemValid.bIsSelect)
					sChild = "option";

				$(apo.elem).find(sChild).each(function()
				{
					$oChildElem = $(this);

					var oSelectData = {

						val: $oChildElem.attr("value") || $oChildElem.data("value") || $oChildElem.text(),
						label: $oChildElem.text(),
						selected: function()
						{
							if($oChildElem.attr("selected") || $oChildElem.attr("data-selected") !== undefined && $oChildElem.attr("data-selected") === "true")
								return true;
							else
								return false;
						},
						disabled: function()
						{
							if($oChildElem.attr("disabled") || $oChildElem.data("disabled") !== undefined && $oChildElem.data("disabled") === "true")
								return true;
							else
								return false;
						}
					};

					if(oSelectData.disabled)
					{
						oSelectData.selected = false;						
					}
					else if(oSelectData.selected)
					{
						apo.tmp.selected = {
							val: oSelectData.val,
							displayVal: oSelectData.displayVal
						};
					}

					oArrData.push(oSelectData);
				});

				apo.setting.dataSource = [];
				var oData = {};
				oData.component = 1;
				oData.data = oArrData;
				apo.setting.dataSource.push(oData);

				apo.tmp.numOfComp = 1;

				if($.CF.compareStrings(apo.setting.headerTitle.contentBehaviour, "Dynamic") && $.CF.isValid(apo.setting.headerTitle.format))
				{
					if(typeof apo.setting.headerTitle.format === "function")
						apo.tmp.sHeaderTitleType = "DynamicFunction";
					else if(typeof apo.setting.headerTitle.format === "string")
					{
						apo.tmp.sHeaderTitleType = "DynamicString";
					}
				}
			}
			else
				console.log("You will have to specify dataSource either as a JSON object or as <ul>, <ol>, <dl> or <select>");
		}
	},

	__disableInvalidRowsOfSelect: function()
	{
		var apo = this;
		var iTempIndex1, bIsInvalidRow,
		oData = apo.setting.dataSource[0].data;

		for(iTempIndex1 = 0; iTempIndex1 < oData.length; iTempIndex1++)
		{
			bIsInvalidRow = $.CF.isValid(oData[iTempIndex1].disabled);

			if(bIsInvalidRow && oData[iTempIndex1].disabled === true)
			{
				$(apo.elem).find("#ap-row-0-" + iTempIndex1).addClass("ap-row-disabled");
			}
		}
	}

});

// --------------------------------- Functions : AnyPicker.Select End --------------------------------------
