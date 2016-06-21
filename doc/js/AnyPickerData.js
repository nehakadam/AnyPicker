/* ----------------------------------------------------------------------------- 

  AnyPicker - Customizable Picker for Mobile OS
  Version 2.0.5
  Copyright (c)2016 Curious Solutions LLP
  https://curioussolutions.in/libraries/anypicker/
  This file is not licensed for commercial use.

 ----------------------------------------------------------------------------- */
 
var documentation = {

    tags:
    [
        "Basic",
        "Component",
        "DateTime",
        "Select",
        "i18n"
    ],

    parameters: 
    [
        {
            "name": "mode",
            "tags": ["Basic"],
            "default": "\"datetime\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"select\"</li>\n  <li>\"datetime\"</li>\n</ul>",
            "description": "<code>mode</code> defines the purpose for which you want to use AnyPicker. It can can be used as a simple select or datetime picker."
        },
        {
            "name": "parent",
            "tags": ["UI"],
            "default": "\"body\"",
            "datatype": "String (Element Selector)",
            "options": "",
            "description": "<code>parent</code> is the selector of the element in which you want to append AnyPicker view. By default AnyPicker view will be appended in the document \"body\"."
        },
        {
            "name": "layout",
            "tags": ["UI"],
            "default": "\"popup\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"popup\"</li>\n  <li>\"relative\"</li>\n  <li>\"fixed\"</li>\n  <li>\"inline\"</li>\n</ul>",
            "description": "<p><code>layout</code> defines the way in which you want to add AnyPicker view. The description of the way in which AnyPicker view will be added is given below - </p>\n\n<p>\"popup\" - AnyPicker Overlay will be appended inside <a class=\"parameter-link icon-link\" href=\"#link-parent\"><code>parent</code></a> element and AnyPicker Container(\".ap-cont\") will be aligned to the center of the screen both vertically and horizontally.</p>\n\n<p>\"relative\" - AnyPicker Overlay will be appended inside <a class=\"parameter-link icon-link\" href=\"#link-parent\"><code>parent</code></a> element and AnyPicker Container(\".ap-cont\") will be positioned relative to the <a class=\"parameter-link icon-link\" href=\"#link-relativeTo\"><code>relativeTo</code></a> element and aligned according to <a class=\"parameter-link icon-link\" href=\"#link-vAlign\"><code>vAlign</code></a> and <a class=\"parameter-link icon-link\" href=\"#link-hAlign\"><code>hAlign</code></a> parameters.</p>\n\n<p>\"fixed\" - AnyPicker Overlay will be appended inside <a class=\"parameter-link icon-link\" href=\"#link-parent\"><code>parent</code></a> element and AnyPicker Container(\".ap-cont\") will be aligned based on \"<a class=\"parameter-link icon-link\" href=\"#link-vAlign\"><code>vAlign</code></a> either to \"top\" or \"bottom\" of the AnyPicker Overlay.</p>\n\n<p>\"inline\" - AnyPicker Overlay will be appended inside <a class=\"parameter-link icon-link\" href=\"#link-parent\"><code>parent</code></a> element and AnyPicker Container(\".ap-cont\") will be positioned to appear inside \"relativeTo\" element. Width of AnyPicker Container(\".ap-cont\") will be set equal to width of <a class=\"parameter-link icon-link\" href=\"#link-relativeTo\"><code>relativeTo</code></a> element and height will be calculated based on <a class=\"parameter-link icon-link\" href=\"#link-rowHeight\"><code>rowHeight</code></a>.</p>\n\n<p>For \"Windows\" <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a>, only \"popup\" <code>layout</code> can be displayed. So even if you specify any other value of <code>layout</code> in Initialization code, it will be set only as a \"popup\".</p>\n<p>For iPad, when you set <code>layout</code> as a popup, AnyPicker View is displayed like UIPickerView inside UIPopoverController like in case of iOS.</p>",
            "examples": ["../demo/AnyPicker-Layout-Fixed.htm", "../demo/AnyPicker-Layout-Inline.htm", "../demo/AnyPicker-Layout-Popup.htm", "../demo/AnyPicker-Layout-Relative.htm"]
        },
        {
            "name": "hAlign",
            "tags": ["UI"],
            "default": "\"left\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"left\"</li>\n  <li>\"center\"</li>\n  <li>\"right\"</li>\n</ul>",
            "description": "<code>hAlign</code> can be used to specify horizontal alignment of the AnyPicker Container(\".ap-cont\") for \"relative\" and \"fixed\" <a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a>.",
            "examples": ["../demo/AnyPicker-Layout-Relative.htm"]
        },
        {
            "name": "vAlign",
            "tags": ["UI"],
            "default": "\"bottom\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"top\"</li>\n  <li>\"middle\"</li>\n  <li>\"bottom\"</li>\n</ul>",
            "description": "<code>vAlign</code> can be used to specify vertical alignment of the AnyPicker Container(\".ap-cont\") for \"relative\" and \"fixed\" <a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a>.",
            "examples": ["../demo/AnyPicker-Layout-Relative.htm"]
        },
        {
            "name": "relativeTo",
            "tags": ["UI"],
            "default": "null",
            "datatype": "String (Element Selector)",
            "options": "",
            "description": "While using \"relative\" or \"inline\" <a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a>, AnyPicker Container(\".ap-cont\") will be aligned based on <code>relativeTo</code> element. For \"inline\" <a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a>, AnyPicker Container(\".ap-cont\") will be placed in the way that it appears to be included inside <code>relativeTo</code> element.",
            "examples": ["../demo/AnyPicker-Layout-Inline.htm"]
        },
        {
            "name": "inputElement",
            "tags": ["Basic"],
            "default": "null",
            "datatype": "String (Element Selector)",
            "options": "",
            "description": "<code>inputElement</code> should be specified when AnyPicker is called on &lt;select&gt;, &lt;ul&gt; or &lt;ol&gt; elements, so that AnyPicker can be be invoked on <code>inputElement</code> focus/click, it can read input from <code>inputElement</code> and write newly set output to <code>inputElement</code>.\nThe default value of <code>inputElement</code> is null, but internally it is assigned as an element on which AnyPicker is invoked, if it is not &lt;select&gt;, &lt;ul&gt; or &lt;ol&gt;.",
            "examples": ["../demo/AnyPicker-Select-HTML-List.htm", "../demo/AnyPicker-Select-HTML-Select.htm"]
        },
        {
            "name": "inputChangeEvent",
            "tags": ["Basic"],
            "default": "\"onSet\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"onSet\"</li>\n  <li>\"onChange\"</li>\n</ul>",
            "description": "<code>inputChangeEvent</code> defines the event on which to change the value in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> to the value selected in the AnyPicker view.",
            "examples": ["../demo/AnyPicker-DateTime-ReflectChanges.htm", "../demo/AnyPicker-DateTime-HumanReadable.htm"]
        },
        {
            "name": "lang",
            "tags": ["i18n"],
            "default": "\"\"",
            "datatype": "String (Language Code)",
            "options": "",
            "description": "<code>lang</code> defines language for which i18n strings are specified in \"anypicker-i18n.js\".\nFor example, \"en\" or \"de\".",
            "examples": ["../demo/AnyPicker-Common-Internationalization.htm"]
        },
        {
            "name": "rtl",
            "tags": ["UI"],
            "default": "false",
            "datatype": "Boolean",
            "options": "<ul>\n  <li>true</li>\n  <li>false</li>\n</ul>",
            "description": "<code>rtl</code> defines whether text direction is right-to-left.",
            "examples": ["../demo/AnyPicker-Common-DirectionRTL.htm"]
        },
        {
            "name": "animationDuration",
            "tags": ["UI"],
            "default": "500",
            "datatype": "Number",
            "options": "",
            "description": "<code>animationDuration</code> for showPicker and hidePicker animations. It is specified in milliseconds."
        },
        {
            "name": "setButton",
            "tags": ["UI"],
            "default": "<pre>\n{\n    markup: \"&lt;a id='ap-button-set' class='ap-button'&gt;Set&lt;/a&gt;\",\n    markupContentWindows: \"&lt;span class='ap-button-icon ap-icon-set'&gt;&lt;/span&gt;&lt;span class='ap-button-text'&gt;set&lt;/span&gt;\",\n    type: \"Button\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>This a View Section Component. You can define markup, markup content for Windows <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a>, type for each component. If component type is button then you can define action: function(){} which will be called on click of the component rather than calling predefined function. Text content of the component should be set in setButton parameter of <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n</code></a>.</p>\n<p>By default <code>setButton</code> will be used to set selected value in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> and then hide AnyPicker view.</p>",
            "examples": ["../demo/AnyPicker-Common-Theme.htm"]
        },
        {
            "name": "clearButton",
            "tags": ["UI"],
            "default": "<pre>\n{\n    markup: \"&lt;a id='ap-button-clear' class='ap-button'&gt;Clear&lt;/a&gt;\",\n    markupContentWindows: \"&lt;span class='ap-button-icon ap-icon-clear'&gt;&lt;/span&gt;&lt;span class='ap-button-text'&gt;clear&lt;/span&gt;\",\n    type: \"Button\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>This a View Section Component. You can define markup, markup content for Windows <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a>, type for each component. If component type is button then you can define action: function(){} which will be called on click of the component rather than calling predefined function. Text content of the component should be set in clearButton parameter of <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n</code></a>.</p>\n<p>By default <code>clearButton</code> will be used to clear value in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> and then hide AnyPicker view.</p>",
            "examples": ["../demo/AnyPicker-Layout-Fixed.htm"]
        },
        {
            "name": "nowButton",
            "tags": ["UI"],
            "default": "<pre>\n{\n    markup: \"&lt;a id='ap-button-now' class='ap-button'&gt;Now&lt;/a&gt;\",\n    markupContentWindows: \"&lt;span class='ap-button-icon ap-icon-now'&gt;&lt;/span&gt;&lt;span class='ap-button-text'&gt;now&lt;/span&gt;\",\n    type: \"Button\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>This a View Section Component. You can define markup, markup content for Windows <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a>, type for each component. If component type is button then you can define action: function(){} which will be called on click of the component rather than calling predefined function. Text content of the component should be set in nowButton parameter of <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n</code></a>.</p>\n<p><code>nowButton</code> should be used with \"datetime\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a>.</p>\n<p>By default, <code>nowButton</code> will be used to set current datetime value in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> and then hide AnyPicker view.</p>"
        },
        {
            "name": "closeButton",
            "tags": ["UI"],
            "default": "<pre>\n{\n    markup: \"&lt;a id='ap-button-close' class='ap-button'&gt;Close&lt;/a&gt;\",\n    markupContentWindows: \"&lt;span class='ap-button-icon ap-icon-cancel'&gt;&lt;/span&gt;&lt;span class='ap-button-text'&gt;cancel&lt;/span&gt;\",\n    type: \"Button\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>This a View Section Component. You can define markup, markup content for Windows <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a>, type for each component. If component type is button then you can define action: function(){} which will be called on click of the component rather than calling predefined function. Text content of the component should be set in closeButton parameter of <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n</code></a>.</p>\n<p>By default, <code>closeButton</code> will be used to hide AnyPicker view.</p>"
        },
        {
            "name": "headerTitle",
            "tags": ["UI"],
            "default": "<pre>\n{\n    markup: \"&lt;span class='ap-header__title'&gt;SELECT&lt;/span&gt;\",\n    type: \"Text\",\n    contentBehaviour: \"Static\",\n    format: \"\"\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<p>This a View Section Component. You can define markup, type for each component. If component type is button then you can define action: function(){} which will be called on click of the component rather than calling predefined function. Text content of the component should be set in headerTitle parameter of <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n</code></a>.</p>\n<p>contentBehaviour value can be set as \"Static\" or \"Dynamic\". When contentBehaviour value is set as \"Static\", <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.headerTitle</code></a> value will be set in the headerTitle. When contentBehaviour value is set as \"Dynamic\", you can specify format parameter which can be a DateTime Format String or a function returning Formatted string to be set as headerTitle. headerTitle value will be updated on change of component value.</p>",
            "examples": ["../demo/AnyPicker-Common-Theme.htm"]
        },
        {
            "name": "viewSections",
            "tags": ["UI"],
            "default": "<pre>\n{\n    header: [\"headerTitle\"],\n    contentTop: [],\n    contentBottom: [],\n    footer: [\"clearButton\", \"setButton\"]\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<code>viewSections</code> can be used to define components to be included in each section of AnyPicker view.",
            "examples": ["../demo/AnyPicker-DateTime-MMMMYYYY.htm"]        
        },
        {
            "name": "i18n",
            "tags": ["i18n"],
            "default": "<pre>\n{\n    headerTitle: \"SELECT\",\n    setButton: \"SET\",\n    clearButton: \"CLEAR\",\n    nowButton: \"NOW\",\n    closeButton: \"CLOSE\",\n    veryShortDays: [\"Su\", \"Mo\", \"Tu\", \"We\", \"Th\", \"Fr\", \"Sa\"],\n    shortDays: [\"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\"],\n    fullDays: [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"],\n    shortMonths: [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"],\n    fullMonths: [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\"],\n    numbers: [\"0\", \"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\"],\n    meridiem: \n    {\n        a: [\"a\", \"p\"],\n        aa: [\"am\", \"pm\"],\n        A: [\"A\", \"P\"],\n        AA: [\"AM\", \"PM\"]\n    }\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<code>i18n</code> contains a list of locale specific string. The strings listed in <code>i18n</code> should be specified in the \"anypicker-i18n.js\".",
            "examples": ["../demo/AnyPicker-Common-Theme.htm"]
        },
        {
            "name": "theme",
            "tags": ["UI"],
            "default": "\"Default\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"Default\"</li>\n  <li>\"iOS\"</li>\n  <li>\"Android\"</li>\n</ul>",
            "description": "<p>\n  \tSet theme of AnyPicker View. You will have to add \"anypicker-ios.css\", \"anypicker-android.css\" or \"anypicker-windows.css\", based on theme you want to use i.e. iOS, Android or Windows. These themes will provide you with Native Visual Experience. You can have a look at visuals differences from Demo Images showcased on <a href=\"https://curioussolutions.in/libraries/anypicker/\">AnyPicker Portal</a> or Working Demo provided in the Distribution File. \n</p>\n<p>\n  While using themes, you will have to set value of <code>theme</code> settings parameter to the theme you want to use. You can also apply theme based on device. Working Demo contains \"DeviceDetection\" example, which demonstrates how to set themes based on Device.\n</p>\n\n<p>\n\tApart from visual changes like colors, fonts, etc. of each element, other theme-wise changes made in the code are described below. You can override some changes simply by setting values of parameter in the initialization code, while some changes can only be overridden by making changes in the javascript code. Simple changes that can be made by modifying value of settings parameter are tagged with API.  \n</p>\n\n<p>\n\t<div><b>Default Theme -</b></div>\n\tFor Default Theme, values specified in setting will be used to create AnyPicker View and Functionality.\n</p>\n\n<p>\n  <b>iOS Theme -</b>\n  <ol>\n    <li><a class=\"parameter-link icon-link\" href=\"#link-rowHeight\"><code>rowHeight</code></a> is set to 36px. <span class=\"tag-api\">API</span></li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a> is set to 5. <span class=\"tag-api\">API</span></li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-viewSections\"><code>viewSections</code></a> setting parameter is customized to display buttons in the header section. The sequence of buttons is also different for iOS theme. <span class=\"tag-api\">API</span></li>\n\t<li>On iPad <a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a>: \"popup\", will be converted to \"popover\" and displayed as iOS UIPopoverController.</li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-headerTitle\"><code>headerTitle</code></a> is a fixed string, so headerTitle is not changed in case of iOS theme. If user specifies headerTitle.contentBehaviour to be dynamic then only headerTitle string is modified on scroll of AnyPicker component.</li>\n\t<li>For \"MMMM-dd-YYYY\" format, custom <a class=\"parameter-link icon-link\" href=\"#link-components\"><code>components</code></a> width and text alignment is set. \"width\" is specified as 46%, 24% & 30% and textAlign as left, right & right for MMMM, dd and YYYY respectively.</li>\n  </ol>\n</p>\n  \n<p>\n  <b>Android Theme -</b>\n  <ol>\n    <li><a class=\"parameter-link icon-link\" href=\"#link-rowHeight\"><code>rowHeight</code></a> is set to 50px. <span class=\"tag-api\">API</span></li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a> is set to 3. <span class=\"tag-api\">API</span></li>\n  </ol>\n</p>\n\n<p>\n  <b>Windows Theme -</b>\n  <ol>\n    <li><a class=\"parameter-link icon-link\" href=\"#link-rowHeight\"><code>rowHeight</code></a> is calculated based on the value of <a class=\"parameter-link icon-link\" href=\"#link-componentsCoverFullWidth\"><code>componentsCoverFullWidth</code></a> setting parameter. If it is set to true, row will be rectangular else row will be square. <a class=\"parameter-link icon-link\" href=\"#link-rowHeight\"><code>rowHeight</code></a> will be set as a division of available height to <a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a></li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a> is calculated based on device orientation. <a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a> will be 5 for portrait and 3 for landscape.</li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-layout\"><code>layout</code></a> is set as \"popup\", even if you set it to any different value.</li>\n\t<li><a class=\"parameter-link icon-link\" href=\"#link-viewSections\"><code>viewSections</code></a> is changed to alter the sequence of set and cancel buttons. <span class=\"tag-api\">API</span></li>\n\t<li>Button Content is markup which contains icon and text, which is set as \"markupContentWindows\" parameter inside <a class=\"parameter-link icon-link\" href=\"#link-components\"><code>components</code></a>. <span class=\"tag-api\">API</span></li>\n\t<li>For datetime format, date and time segmented tab is added in the Header.</li>\n\t<li>If <a class=\"parameter-link icon-link\" href=\"#link-showComponentLabel\"><code>showComponentLabel</code></a> is set to true, component label will be added in the bottom of the row and not above component like other themes.</li>\n  </ol>\n</p>",
            "examples": ["../demo/AnyPicker-Common-Theme.htm"]
        },
        {
            "name": "components",
            "tags": ["Component", "Select"],
            "default": "null",
            "datatype": "Array",
            "options": "",
            "description": "<p><code>components</code> array is used to define the components of AnyPicker. For \"datetime\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a>, components will be defined by AnyPicker code. AnyPicker will not work if you don't specify <code>components</code> while using \"select\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a>.</p>\n\n<div>\ncomponents can be specified as-\n<pre>\n[\n    {\n        component: 0,\n        name: \"day\",\n        label: \"Days\",\n        width: \"50%\",\n        textAlign: \"left\"\n    },\n    {\n        component: 1,\n        name: \"hours\",\n        label: \"Hours\",\n        width: \"20%\",\n        textAlign: \"right\"\n    }\n]\n</pre>\n</div>\n<p>\"component\" is the index of the component.</p>\n<p>\"name\" is unique name of the component. It can act as an identifier. For DateTime mode of the AnyPicker, name is used to identify the component while parsing, setting and validating values from dataSource or a particular input field.</p>\n<p>\"label\" value will be set as Component Label when <a class=\"parameter-link icon-link\" href=\"#link-showComponentLabel\"><code>showComponentLabel</code></a> is set to true.</p>\n<p>By default, all components will be rendered as equal-width components. You can can specify width of the component in \"width\" parameter. Please specify unit with width value e.g. % or px.</p>\n<p>By default text alignment for the row will be \"center\". You can change it by setting value of \"textAlign\".</p>",
            "examples": ["../demo/AnyPicker-Select-Basic.htm"]
        },
        {
            "name": "dataSource",
            "tags": ["Component", "Select"],
            "default": "null",
            "datatype": "Array",
            "options": "",
            "description": "<code>dataSource</code> is used to define data for each component of AnyPicker. For \"datetime\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a>, component data will be defined by AnyPicker code. AnyPicker will not work if you don't specify <a class=\"parameter-link icon-link\" href=\"#link-components\"><code>components</code></a> while using \"select\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a>.",
            "examples": ["../demo/AnyPicker-Select-Basic.htm"]
        },
        {
            "name": "showComponentLabel",
            "tags": ["UI", "Component"],
            "default": "false",
            "datatype": "Boolean",
            "options": "<ul>\n  <li>true</li>\n  <li>false</li>\n</ul>",
            "description": "<code>showComponentLabel</code> defines whether to show component label specified in <a class=\"parameter-link icon-link\" href=\"#link-components\"><code>components</code></a> on the AnyPicker view above the component view.",
            "examples": ["../demo/AnyPicker-DateTime-DateTime.htm", "../demo/AnyPicker-Select-Multi-Component.htm"]
        },
        {
            "name": "visibleRows",
            "tags": ["UI", "Component"],
            "default": "3",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>visibleRows</code> defines number of rows visible in AnyPicker view. It should be an odd integer.</p>\n\n<p>Default values of <code>visibleRows</code> for <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a> are - </p>\n<ul>\n\t<li>Default - 3</li>\n\t<li>iOS - 5</li>\n\t<li>Android - 3</li>\n\t<li>Windows (Portrait Orientation) - 5</li>\n\t<li>Windows (Landscape Orientation) - 3</li>\n</ul>"
        },
        {
            "name": "maxRows",
            "tags": ["Component", "DateTime"],
            "default": "0",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>maxRows</code> defines maximum number of rows to add in a component.</p>\n<p>Value of <code>maxRows</code> can be used where no limiting parameter is set for possible data values that can be added in the component. \nFor example, for year component \"maxRows\" value is set to 50.</p>"
        },
        {
            "name": "rowHeight",
            "tags": ["UI", "Component"],
            "default": "50",
            "datatype": "Integer",
            "options": "",
            "description": "<p><code>rowHeight</code> defines height of the row in AnyPicker component. The height of AnyPicker view will vary if <code>rowHeight</code> or <a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a> parameters are changed.</p>\n\n<p>Default values of <code>rowHeight</code> for <a class=\"parameter-link icon-link\" href=\"#link-theme\"><code>theme</code></a> are - </p>\n<ul>\n\t<li>Default - 50</li>\n\t<li>iOS - 36</li>\n\t<li>Android - 50</li>\n\t<li>Windows - <code>rowHeight</code> will be set as a division of available height to <a class=\"parameter-link icon-link\" href=\"#link-visibleRows\"><code>visibleRows</code></a></li>\n</ul>"
        },
        {
            "name": "rowsNavigation",
            "tags": ["UI", "Component"],
            "default": "\"scroller\"",
            "datatype": "String",
            "options": "<ul>\n  <li>\"scroller\"</li>\n  <li>\"buttons\"</li>\n  <li>\"scroller+buttons\"</li>\n</ul>",
            "description": "<code>rowsNavigation</code> defines how rows will be navigated to change the selected value.",
            "examples": ["../demo/AnyPicker-Common-Navigation.htm"]
        },
        {
            "name": "selectedDate",
            "tags": ["DateTime"],
            "default": "Current Date",
            "datatype": "Date Object or Date String",
            "options": "",
            "description": "<code>selectedDate</code> is the default date which you want to display on the Picker Components, before you set a new date.\n<code>selectedDate</code> can be specified as a Date or Date String in <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a>.",
            "examples": ["../demo/AnyPicker-DateTime-MMMMYYYY.htm"]
        },
        {
            "name": "dateTimeFormat",
            "tags": ["DateTime"],
            "default": "\"dd-MM-yyyy hh:mm AA\"",
            "datatype": "String",
            "options": "",
            "description": "<p>\n<code>dateTimeFormat</code> specifies the format in which AnyPicker components will be added in the view. \nIf <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> is not set, then value of <code>dateTimeFormat</code> will be assigned to it and \n<a class=\"parameter-link icon-link\" href=\"#link-selectedDate\"><code>selectedDate</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-minValue\"><code>minValue</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-maxValue\"><code>maxValue</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a> and values set in input elements will be formatted in <code>dateTimeFormat</code>. \n</p>\n\n<p><code>dateTimeFormat</code> can be any combination of following components separated by a delimiter - </p>\n<ul>\n  <li><b>d</b> - Day Of Month</li>\n  <li><b>dd</b> - Day Of Month (2-digit)</li>\n  <li><b>DD</b> - Very Short Day Name (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.veryShortDays</code></a>)</li>\n  <li><b>DDD</b> - Short Day Name (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.shortDays</code></a>)</li>\n  <li><b>DDDD</b> - Full Day Name (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.fullDays</code></a>)</li>\n  <li><b>M</b> - Month Number</li>\n  <li><b>MM</b> - Month Number (2-digit)</li>\n  <li><b>MMM</b> - Short Month Name (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.shortMonths</code></a>)</li>\n  <li><b>MMMM</b> - Full Month Name (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.fullMonths</code></a>)</li>\n  <li><b>y</b> - Year (4-digit)</li>\n  <li><b>yyyy</b> - Year (4-digit)</li>\n  <li><b>yy</b> - Year (two-digit)</li>\n  <li><b>h</b> - Hours (12-Hours Format)</li>\n  <li><b>hh</b> - Hours (12-Hours Format; 2-digit)</li>\n  <li><b>H</b> - Hours (24-Hours Format)</li>\n  <li><b>HH</b> - Hours (24-Hours Format; 2-digit)</li>\n  <li><b>m</b> - Minutes</li>\n  <li><b>mm</b> - Minutes (2-digit)</li>\n  <li><b>s</b> - Seconds</li>\n  <li><b>ss</b> - Seconds (2-digit)</li>\n  <li><b>a</b> - Meridiem (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.meridiem.a</code></a>)</li>\n  <li><b>aa</b> - Meridiem (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.meridiem.aa</code></a>)</li>\n  <li><b>A</b> - Meridiem (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.meridiem.A</code></a>)</li>\n  <li><b>AA</b> - Meridiem (specified in <a class=\"parameter-link icon-link\" href=\"#link-i18n\"><code>i18n.meridiem.AA</code></a>)</li>\n</ul>\n  \n<p>Following delimiter can be used -</p>\n<ul>\n\t<li><b>\"-\"</b> (dash)</li>\n  \t<li><b>\".\"</b> (period)</li>\n  \t<li><b>\"/\"</b> (forward slash)</li>\n  \t<li><b>\" \"</b> (space)</li>\n  \t<li><b>\":\"</b> (colon)</li>\n  \t<li><b>\",\"</b> (comma)</li>\n</ul>\n",
            "examples": ["../demo/AnyPicker-DateTime-DateTime.htm"]
        },
        {
            "name": "inputDateTimeFormat",
            "tags": ["DateTime"],
            "default": "\"\"",
            "datatype": "String",
            "options": "",
            "description": "<p>\n<code>inputDateTimeFormat</code> specifies the format in which <a class=\"parameter-link icon-link\" href=\"#link-selectedDate\"><code>selectedDate</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-minValue\"><code>minValue</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-maxValue\"><code>maxValue</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a> and values set in the input element should be specified.\nIf <code>inputDateTimeFormat</code> is not set then, value of <a class=\"parameter-link icon-link\" href=\"#link-dateTimeFormat\"><code>dateTimeFormat</code></a> will be assigned to it.\n</p>\n<p>\n  <code>inputDateTimeFormat</code> should be built with the same components specified in <a class=\"parameter-link icon-link\" href=\"#link-dateTimeFormat\"><code>dateTimeFormat</code></a>.\n</p>\n",
            "examples": ["../demo/AnyPicker-DateTime-DiffFormats.htm"]
        },
        {
            "name": "tzOffset",
            "tags": ["DateTime"],
            "default": "\"\"",
            "datatype": "String (TZD - Time Zone Designator)",
            "options": "",
            "description": "<code>tzOffset</code> is the Time Zone Designator of the timezone in which output datetime should be displayed and input datetime should be specified in the settings of AnyPicker. <code>tzOffset</code> value is used in the function which returns Current DateTime to convert current datetime in browser's timezone to the <code>tzOffset</code> specified, so that user gets correct values of current time."
        },
        {
            "name": "maxValue",
            "tags": ["DateTime"],
            "default": "null",
            "datatype": "Date Object or Date String",
            "options": "",
            "description": "<code>maxValue</code> is the maximum value of the datetime which you want to accept as an input.\n<code>maxValue</code> can be specified as a Date or Date String in <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a>.",
            "examples": ["../demo/AnyPicker-DateTime-MMYYYY.htm"]
        },
        {
            "name": "minValue",
            "tags": ["DateTime"],
            "default": "null",
            "datatype": "Date Object or Date String",
            "options": "",
            "description": "<code>minValue</code> is the minimum value of the datetime which you want to accept as an input.\n<code>minValue</code> can be specified as a Date or Date String in <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a>.",
            "examples": ["../demo/AnyPicker-DateTime-MMYYYY.htm"]
        },
        {
            "name": "maxYear",
            "tags": ["DateTime"],
            "default": "0",
            "datatype": "Integer",
            "options": "",
            "description": "<code>maxYear</code> is maximum year which you want to display on AnyPicker. <code>maxYear</code> should be set when you want to display year in \"YY\" i.e. 2-digit format. The value of minYear will be calculated based on maxYear and 100 values will be displayed in the Picker Component.\nFor example, If maxYear = 2025, then minYear = 1926. So \"YY\" values will be [26, 27, 28,....., 23, 24, 25]."
        },
        {
            "name": "disableValues",
            "tags": ["DateTime"],
            "default": "{}",
            "datatype": "Object",
            "options": "",
            "description": "<p>\n<code>disableValues</code> is an object of values to be displayed as disabled and non-selectable on AnyPicker.\n<code>disableValues</code> can have 4 types of arrays - \"day\", \"date\", \"time\", \"datetime\".\n</p>\n\n<ul>\n  \n<li>  \nday - It is an array of disabled days. Values of days can 0 to 6 from Sunday to Saturday.\nFor example, [0, 6]\n</li>\n  \n<li>\ndate - It is an array of rules specified to disable date values. These dates can be specified as - {\"val\": <datevalue> or {\"start\": <datevalue>, \"end\": <datevalue>}\nFor example, \n<pre>\ndate: [\n    {\n        val: \"01-01-2015\"\n    },\n    {\n        start: \"01-03-2015\",\n        end: \"31-03-2015\"    \n    }\n]\n</pre>\n</li>\n\n<li>\ntime - It is an array of rules specified to disable time values. Time values can be specified as - {\"val\": <timevalue> or {\"start\": <timevalue>, \"end\": <timevalue>}\nFor example,\n<pre>\ntime: [\n    {\n        day: [5],\n        val: [\n            {\n                val: \"10:00\"\n            }, \n            {\n                start: \"17:00\", \n                end: \"18:00\"\n            }\n        ]\n    },    \n    {\n        val: [\n            {\n                start: \"13:00\",\n                end: \"13:30\"\n            }\n        ]\n    }\n]\n</pre>\n</li>\n\n<li>\ndatetime - It is an array of rules specified to disable datetime values. Time values can be specified as - {\"val\": <datetimevalue> or {\"start\": <datetimevalue>, \"end\": <datetimevalue>}\nFor example,\n<pre>\ndatetime: [\n    {\n        val: \"31-12-2015 23:00\"\n    },\n    {\n        start: \"01-03-2015 10:00\",\n        end: \"01-03-2015 15:00\"    \n    }\n]\n</pre>\n</li>",
            "examples": ["../demo/AnyPicker-DateTime-Invalid_SelectedDate.htm"]
        },
        {
            "name": "intervals",
            "tags": ["DateTime"],
            "default": "<pre>\n{\n    h: 1,\n    m: 1,\n    s: 1\n}\n</pre>",
            "datatype": "Object",
            "options": "",
            "description": "<ul>\n<code>intervals</code> is object containing intervals between hours, minutes and seconds values to be added in the Picker Component. Values of intervals should be -\n  \n<li>intervals.h - must be evenly divided between 0 to 23 or 12 to 11.</li>\n<li>intervals.m - must be evenly divided between 0 to 59.</li>\n<li>intervals.s - must be evenly divided between 0 to 59.</li>\n\n</ul>",
            "examples": ["../demo/AnyPicker-DateTime-Interval.htm"]
        },
        {
            "name": "roundOff",
            "tags": ["DateTime"],
            "default": "true",
            "datatype": "Boolean",
            "options": "<ul>\n  <li>true</li>\n  <li>false</li>\n</ul>",
            "description": "When the value of <code>roundOff</code> is set to true, hours, minutes or seconds will be rounded off to the nearest integer divisible by <a class=\"parameter-link icon-link\" href=\"#link-intervals\"><code>intervals</code></a>(i.e. intervals.h, intervals.m and intervals.s).",
            "examples": ["../demo/AnyPicker-DateTime-Interval.htm"]
        }
    ],

    callbackfunctions:
    [
        {
            "name": "onInit",
            "tags": ["Basic"],
            "parameters": "",
            "returnvalue": "",
            "description": "Called after AnyPicker plugin initialization.",
            "examples": ["../demo/AnyPicker-Select-DataVal.htm"]
        },
        {
            "name": "onBeforeShowPicker",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "Called before showing AnyPicker View."
        },
        {
            "name": "onShowPicker",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "Called after showing AnyPicker View."
        },
        {
            "name": "onBeforeHidePicker",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "Called before hiding AnyPicker View."
        },
        {
            "name": "onHidePicker",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "Called after hiding AnyPicker View."
        },
        {
            "name": "parseInput",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>Element Value</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Array of Selected Values</li>\n</ul>",
            "description": "<p>Called before showing AnyPicker View. Element Value supplied as an input (value in the input field) will be passed as a parameter.</p>\n<p><code>parseInput</code> function should return selected string for each component of the picker. This string should match label specified in object of <a class=\"parameter-link icon-link\" href=\"#link-dataSource\"><code>dataSource</code></a>. This array of values will be parsed to find out selected value(val in object of dataSource).</p>",
            "examples": ["../demo/AnyPicker-Select-ParseInput.htm", "../demo/AnyPicker-DateTime-HumanReadable.htm"]
        },
        {
            "name": "formatOutput",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>Array of Selected Values</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Formatted Output String</li>\n</ul>",
            "description": "<p>Called before setting output in the input field. <code>formatOutput</code> should be used when you want to customize output string.</p>\n<p>For \"select\" <a class=\"parameter-link icon-link\" href=\"#link-mode\"><code>mode</code></a> of AnyPicker, output for multicomponent picker is formatted as a \" \"(space)-separated string.</p>\n\n<p>Format in which Array of Selected Values is displayed - </p>\n<pre>\n{\n    values:\n    [\n        {\n            component: 0,\n            val: \"20\",\n            label: \"20\"\n        },\n        {\n            component: 1,\n            val: \"10\",\n            label: \"10\"\n        },\n        {\n            component: 2,\n            val: \"2015\",\n            label: \"2015\"\n        }\n    ],\n    \n    date: [Date Object] // For mode: \"datetime\"\n}\n</pre>",
            "examples": ["../demo/AnyPicker-Select-ParseInput.htm", "../demo/AnyPicker-DateTime-HumanReadable.htm"]
        },
        {
            "name": "setOutput",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>Output Label</li>\n  <li>Array of Selected Values</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>\n  After formatted output string is built either using <a class=\"parameter-link icon-link\" href=\"#link-formatOutput\"><code>formatOutput</code></a> callback or by plugin itself, <code>setOutput</code> will be called to enable you set output string in the view you want.\n</p>\n<p>\n  While using <code>setOutput</code>, you can skip <a class=\"parameter-link icon-link\" href=\"#link-formatOutput\"><code>formatOutput</code></a> and write a code to format output string in the <code>setOutput</code> function.\n</p>  \n<p>\n  <code>setOutput</code> and <a class=\"parameter-link icon-link\" href=\"#link-onSetOutput\"><code>onSetOutput</code></a> should not be used together.\n  In <code>setOutput</code>, you set output string in the view and <a class=\"parameter-link icon-link\" href=\"#link-onSetOutput\"><code>onSetOutput</code></a> is called after setting output string in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> by plugin.\n  So, calling <a class=\"parameter-link icon-link\" href=\"#link-onSetOutput\"><code>onSetOutput</code></a> after <code>setOutput</code> is not required, since you know when you set value in the view.\n</p>\n<p>Array of Selected Values is displayed in following format - </p>\n<pre>\n{\n    values:\n    [\n        {\n            component: 0,\n            val: \"20\",\n            label: \"20\"\n        },\n        {\n            component: 1,\n            val: \"10\",\n            label: \"10\"\n        },\n        {\n            component: 2,\n            val: \"2015\",\n            label: \"2015\"\n        }\n    ],\n    \n    date: [Date Object] // For mode: \"datetime\"\n}\n</pre>",
            "examples": ["../demo/AnyPicker-Select-DataVal.htm"]
        },
        {
            "name": "onSetOutput",
            "tags": ["Basic"],
            "parameters": "<ul>\n  <li>Output Label</li>\n  <li>Array of Selected Values</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>\n  After formatted output string is built either using <a class=\"parameter-link icon-link\" href=\"#link-formatOutput\"><code>formatOutput</code></a> callback or by plugin itself, output string is set in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> and then <code>onSetOutput</code> will be called.\n</p>\n<p>\n  <a class=\"parameter-link icon-link\" href=\"#link-setOutput\"><code>setOutput</code></a> and <code>onSetOutput</code> should not be used together.\n  In <a class=\"parameter-link icon-link\" href=\"#link-setOutput\"><code>setOutput</code></a>, you set output string in the view and <code>onSetOutput</code> is called after setting output string in the <a class=\"parameter-link icon-link\" href=\"#link-inputElement\"><code>inputElement</code></a> by plugin.\n  So, calling <code>onSetOutput</code> after <a class=\"parameter-link icon-link\" href=\"#link-setOutput\"><code>setOutput</code></a> is not required, since you know when you set value in the view.\n</p>\n<p>Array of Selected Values is displayed in following format - </p>\n<pre>\n{\n    values:\n    [\n        {\n            component: 0,\n            val: \"20\",\n            label: \"20\"\n        },\n        {\n            component: 1,\n            val: \"10\",\n            label: \"10\"\n        },\n        {\n            component: 2,\n            val: \"2015\",\n            label: \"2015\"\n        }\n    ],\n    \n    date: [Date Object] // For mode: \"datetime\"\n}\n</pre>\n",
            "examples": ["../demo/AnyPicker-Common-NonInputElement.htm", "../demo/AnyPicker-DateTime-StartEnd.htm"]
        },
        {
            "name": "rowView",
            "tags": ["UI", "Component"],
            "parameters": "<ul>\n  <li>Component Index</li>\n  <li>Row Index</li>\n  <li>Data Object for Row</li>\n</ul>",
            "returnvalue": "HTML String",
            "description": "Called while in creating row view in <a class=\"parameter-link icon-link\" href=\"#link-reloadComponent\"><code>reloadComponent</code></a> function. HTML string for a row view should be returned from this callback function.",
            "examples": ["../demo/AnyPicker-Select-CustomRowView.htm"]
        },
        {
            "name": "onChange",
            "tags": ["Basic", "Component"],
            "parameters": "<ul>\n  <li>Component Index</li>\n  <li>Row Index</li>\n  <li>Array of Selected Values</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Called when selected value in the Picker Component is changed.</p>\n\n<p>Format in which Array of Selected Values is displayed - </p>\n<pre>\n{\n    values:\n    [\n        {\n            component: 0,\n            val: \"20\",\n            label: \"20\"\n        },\n        {\n            component: 1,\n            val: \"10\",\n            label: \"10\"\n        },\n        {\n            component: 2,\n            val: \"2015\",\n            label: \"2015\"\n        }\n    ],\n    \n    date: [Date Object] // For mode: \"datetime\"\n}\n</pre>",
            "examples": ["../demo/AnyPicker-DateTime-ReflectChanges.htm"]
        }
    ],

    functions:
    [
        {
            "name": "showOrHidePicker",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>Value Of Element</li>\n</ul>",
            "returnvalue": "",
            "description": "Shows AnyPicker if it is hidden and hides AnyPicker if it is visible. You have to pass selected value of the element as a parameter if you are using this method to show AnyPicker.",
            "examples": ["../demo/AnyPicker-Common-NonInputElement.htm"]
        },
        {
            "name": "reloadAllComponents",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "Reloads all components of AnyPicker. This function can be used to load components after dataSource is changed."
        },
        {
            "name": "reloadComponent",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>Component Index</li>\n  <li>Whether single Component Is Loaded?</li>\n</ul>",
            "returnvalue": "",
            "description": "Loads a specified component. Component Index is the index of the component as specified in <a class=\"parameter-link icon-link\" href=\"#link-components\"><code>components</code></a>. bSingleLoad parameter can be set to true when you want to reload a single component so that after reloading a component, a function to adjust component view and set selected and disabled values will be called.",
            "examples": ["../demo/AnyPicker-Select-Conditions.htm"]
        },
        {
            "name": "adjustComponents",
            "tags": ["UI"],
            "parameters": "",
            "returnvalue": "",
            "description": "<code>adjustComponents</code> function can be called, if you change the setting parameter to alter rowHeight. Height of the Row, Component Selector and Component Container will be set in <code>adjustComponents</code> function."
        },
        {
            "name": "setSelectedAndInvalidValuesForRows",
            "tags": ["UI"],
            "parameters": "<ul>\n  <li>Set Selected Date?</li>\n</ul>",
            "returnvalue": "",
            "description": "<code>setSelectedAndInvalidValuesForRows</code> function can be used to visually set selected and disabled values on AnyPicker view. This function can be used after altering <a class=\"parameter-link icon-link\" href=\"#link-dataSource\"><code>dataSource</code></a>, <a class=\"parameter-link icon-link\" href=\"#link-selectedDate\"><code>selectedDate</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a> to visually reload selected and disabled values. bSetSelected parameter specified whether to set selected values as selected values should not be changed when the only <a class=\"parameter-link icon-link\" href=\"#link-dataSource\"><code>dataSource</code></a> or <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a> are modified."
        },
        {
            "name": "formatOutputDates",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n</ul>",
            "returnvalue": "",
            "description": "<code>formatOutputDates</code> function can be used to format date into <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> settings parameter. This function can be used while initializing form fields.",
            "examples": ["../demo/AnyPicker-DateTime-StartEnd.htm"]
        },
        {
            "name": "setSelectedDate",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>Date Object or Date String</li>\n</ul>",
            "returnvalue": "",
            "description": "<code>setSelectedDate</code> function can be used to set <a class=\"parameter-link icon-link\" href=\"#link-selectedDate\"><code>selectedDate</code></a> as a Date Object or Date String formatted in a <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> and set the formatted date in input element.",
            "examples": ["../demo/AnyPicker-DateTime-StartEnd.htm"]
        },
        {
            "name": "setMinimumDate",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>Date Object or Date String</li>\n</ul>",
            "returnvalue": "",
            "description": "<code>setMinimumDate</code> function can be used to set <a class=\"parameter-link icon-link\" href=\"#link-minValue\"><code>minValue</code></a> as a Date Object or Date String formatted in a <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> and call <a class=\"parameter-link icon-link\" href=\"#link-parseDisableValues\"><code>parseDisableValues</code></a> function to modify disable values array.",
            "examples": ["../demo/AnyPicker-DateTime-StartEnd.htm"]
        },
        {
            "name": "setMaximumDate",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>Date Object or Date String</li>\n</ul>",
            "returnvalue": "",
            "description": "<code>setMaximumDate</code> function can be used to set <a class=\"parameter-link icon-link\" href=\"#link-maxValue\"><code>maxValue</code></a> as a Date Object or Date String formatted in a <a class=\"parameter-link icon-link\" href=\"#link-inputDateTimeFormat\"><code>inputDateTimeFormat</code></a> and call <a class=\"parameter-link icon-link\" href=\"#link-parseDisableValues\"><code>parseDisableValues</code></a> function to modify disable values array.",
            "examples": ["../demo/AnyPicker-DateTime-StartEnd.htm"]
        },
        {
            "name": "parseDisableValues",
            "tags": ["DateTime"],
            "parameters": "",
            "returnvalue": "",
            "description": "<code>parseDisableValues</code> function is used to parse disable values specified in the <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a>. This function is called on plugin initialization but after initialization if you change <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a>, you will have to call <code>parseDisableValues</code> function. Otherwise disabled values will be displayed based on <a class=\"parameter-link icon-link\" href=\"#link-disableValues\"><code>disableValues</code></a> provided during plugin initialization."
        },
        {
            "name": "setDateInFormat",
            "tags": ["UI", "DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>Format (\"START\", \"END\" or \"\")</li>\n</ul>",
            "returnvalue": "",
            "description": "<p>Returns a date object in format specified \"START\", \"END\" or default.</p>\n<p>Input Date can be added as date or iDate object. iDate object should be in following format - </p>\n<pre>\nvar dToday = new Date();\n{\n    D: dToday.getDay(),\n    d: dToday.getDate(),\n    M: dToday.getMonth(),\n    y: dToday.getFullYear(),\n    H: dToday.getHours(),\n    h: (dToday.getHours() > 12) ? (dToday.getHours() - 12) : dToday.getHours(),\n    m: dToday.getMinutes(),\n    s: dToday.getSeconds(),\n    ms: dToday.getMilliseconds(),\n    me: (dToday.getHours() < 12) ? \"am\" : \"pm\",\n    sm: (dToday.getHours() < 12) ? \"a\" : \"p\"\n}\n</pre>\n    \n<p>Depending on format specified a new date is created.</p>\n<p>If format is \"START\" then hours, minutes, seconds and milliseconds will be set to 0.</p>\n<p>If format is \"END\" then hours, minutes, seconds and milliseconds will be set to 23, 59, 59 and 999 respectively.</p>\n<p>If format is \"\" or undefined then hours, minutes, seconds and milliseconds are set from input \"date\" or \"iDate\".</p>"
        },
        {
            "name": "convertToUTC",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>TZD String of Input Date Object</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Date Object</li>\n</ul>",
            "description": "Convert input Date to UTC Date. If TZD string for output timezone is set to \"\", date is converted to timezone of the browser."
        },
        {
            "name": "getDateByAddingOutputTZOffset",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>TZD String of Output Date Object</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Date Object</li>\n</ul>",
            "description": "Returns date converted in timezone for which TZD string is specified. If TZD string for output timezone is set to \"\", date is converted to timezone of the browser."
        },
        {
            "name": "normalizeDateTimeWithOffset",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n  <li>TZD String of Input Date Object</li>\n  <li>TZD String of Output Date Object</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Date Object</li>\n</ul>",
            "description": "Returns date converted to output timezone from input timezone."
        },
        {
            "name": "compareDates",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>date1(Date Object)</li>\n  <li>date2(Date Object)</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>less than 0 - date1 is less than date2</li>\n  <li>0 - date1 is equal to date2</li>\n  <li>greater than 0 - date1 is greater than date2</li>\n</ul>",
            "description": "Date Comparison"
        },
        {
            "name": "compareTimes",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>time1(Date Object)</li>\n  <li>time2(Date Object)</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>less than 0 - time1 is less than time2</li>\n  <li>0 - time1 is equal to time2</li>\n  <li>greater than 0 - time1 is greater than time2</li>\n</ul>",
            "description": "Time Comparison"
        },
        {
            "name": "compareDateTimes",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>datetime1(Date Object)</li>\n  <li>datetime2(Date Object)</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>less than 0 - datetime1 is less than datetime2</li>\n  <li>0 - datetime1 is equal to datetime2</li>\n  <li>greater than 0 - datetime1 is greater than datetime2</li>\n</ul>",
            "description": "DateTime Comparison"
        },
        {
            "name": "getNumberStringInFormat",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Number</li>\n  <li>Number of Characters</li>\n  <li>Localized?</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>Formatted Number</li>\n</ul>",
            "description": "<p>Returns Formatted Number.</p>\n\n<p>When value of number of characters is set to 0, number of characters of input number are returned. Else string will be formatted to return specified number of characters.</p>\n<p>isLocalized defines whether output should be localized. If set to true output datetime string will be returned in the language specified.</p>"
        },
        {
            "name": "getDateObject",
            "tags": ["DateTime"],
            "parameters": "<ul>\n  <li>Date Object</li>\n</ul>",
            "returnvalue": "<ul>\n  <li>iDate Object</li>\n</ul>",
            "description": "Returns iDate object in following format - \n<pre>\nvar dToday = new Date();\n{\n    D: dToday.getDay(),\n    d: dToday.getDate(),\n    M: dToday.getMonth(),\n    y: dToday.getFullYear(),\n    H: dToday.getHours(),\n    h: (dToday.getHours() > 12) ? (dToday.getHours() - 12) : ((dToday.getHours() === 0) ? 12 : dToday.getHours()),\n    m: dToday.getMinutes(),\n    s: dToday.getSeconds(),\n    ms: dToday.getMilliseconds(),\n    me: (dToday.getHours() < 12) ? \"am\" : \"pm\",\n    sm: (dToday.getHours() < 12) ? \"a\" : \"p\"\n}\n</pre>"
        }
    ],

    changelog:
    [
        {
            "version": "1.0.0",
            "date": "Aug 15, 2015",
            "description": "Initial Release"
        },
        {
            "version": "2.0.0",
            "date": "Jan 25, 2016",
            "description": "Made AnyPicker free for personal use."
        },
        {
            "version": "2.0.1",
            "date": "Feb 20, 2016",
            "description": "Fixed a bug in minValue and maxValue functionality. Added examples for minValue and maxValue functionality."
        },
        {
            "version": "2.0.2",
            "date": "Mar 14, 2016",
            "description": "Slight improvement in scrolling experience on Windows Phone 10. Improved button click functionality when rowsNavigation is set to buttons or scroller+buttons."
        },
        {
            "version": "2.0.3",
            "date": "May 7, 2016",
            "description": "Fixed a bug in minValue and maxValue functionality."
        },
        {
            "version": "2.0.4",
            "date": "June 13, 2016",
            "description": "Added Norwegian Bokmål Locale File"
        },
        {
            "version": "2.0.5",
            "date": "June 22, 2016",
            "description": "Fixed a bug(#8) in Month values display for M and MM formats which was caused while fixing a bug in minValue and maxValue functionality in Version 2.0.3."
        }
    ]
};
