/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <spacanowski> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return SPacanowski
 * ----------------------------------------------------------------------------
 */

var ytfrScriptCode = "\
	function handleHidingCheckboxClick(source, target) {\
		document.getElementById(target).style.display = source.checked ? 'block' : 'none';\
	}\
	function makeFragmentRepeat(source) {\
		var repeatInterval;\
		if (!source.checked) {\
			clearInterval(repeatInterval);\
			delete ytplayer.config.args.end;\
			delete ytplayer.config.args.start;\
			ytplayer.load();\
		} else {\
			var endTime = calculateAndSetTimesFromFields();\
			repeatInterval = setInterval(function() {\
				if (document.getElementById(\"movie_player\").getCurrentTime() >= endTime) {\
					ytplayer.load();\
				}\
			}, 1000);\
			ytplayer.load();\
		}\
	}\
	function calculateAndSetTimesFromFields() {\
		var startTime = 0,\
			timeUnit = 60,\
			endTime = Number(ytplayer.config.args.length_seconds);\
		if (document.getElementById('shouldHaveEnd').checked) {\
			var userEndTime = getNumericRepeatValueFromField('repeatEndHours') * timeUnit * timeUnit +\
				getNumericRepeatValueFromField('repeatEndMins') * timeUnit +\
				getNumericRepeatValueFromField('repeatEndSecs');\
			if (userEndTime < endTime) {\
				ytplayer.config.args.end = userEndTime;\
				endTime = userEndTime;\
			}\
		}\
		if (document.getElementById('shouldHaveStart').checked) {\
			var userStartTime = getNumericRepeatValueFromField('repeatStartHours') * timeUnit * timeUnit +\
				getNumericRepeatValueFromField('repeatStartMins') * timeUnit +\
				getNumericRepeatValueFromField('repeatStartSecs');\
			if (userStartTime > startTime && userStartTime < endTime) {\
				ytplayer.config.args.start = userStartTime;\
			}\
		}\
		return endTime;\
	}\
	function getNumericRepeatValueFromField(fieldName) {\
		return Number(document.getElementById(fieldName).value);\
	}\
	function setNumericRepeatValueInField(fieldName, newValue) {\
		return document.getElementById(fieldName).value = newValue;\
	}\
	function setRepValues(initialValue, which) {\
		document.getElementById('shouldHave'+which).click();\
		initialValue = Number(initialValue);\
		var sec = initialValue%60;\
		if (sec < 60) {\
			initialValue -= sec;\
			setNumericRepeatValueInField('repeat'+which+'Secs', sec);\
		}\
		var min = initialValue%3600;\
		if (min < 3600) {\
			initialValue -= min;\
			setNumericRepeatValueInField('repeat'+which+'Mins', min/60);\
		}\
		setNumericRepeatValueInField('repeat'+which+'Hours', initialValue/3600);\
	}\
	(function() {\
		var params = window.location.search.substring(1),\
			getURLParameter = function(name) {\
					var value = new RegExp(name + '=([^&]+)').exec(params);\
					if (value)\
						return decodeURIComponent(value[1]);\
					else\
						return null;\
				},\
			repStart = getURLParameter('repStart'),\
			repEnd = getURLParameter('repEnd');\
		if (repStart || repEnd) {\
			document.getElementById('repeatCheckbox').click();\
			if (!repStart) {\
				repStart = 0;\
			}\
			setRepValues(repStart, 'Start');\
			if (!repEnd || repEnd > Number(ytplayer.config.args.length_seconds))\
				repEnd = Number(ytplayer.config.args.length_seconds);\
			setRepValues(repEnd, 'End');\
			calculateAndSetTimesFromFields();\
			ytplayer.load();\
		}\
	})();\
";
var ytfrHtmlCode = "\
<div>\
	<label for=\"repeatCheckbox\">Repeat fragment</label>\
	<input id=\"repeatCheckbox\" type=\"checkbox\" onClick=\"handleHidingCheckboxClick(this, 'repeatFragmentTimeSection')\" /><br>\
	<div id=\"repeatFragmentTimeSection\" style=\"display: none;\">\
		<div>\
			<label for=\"shouldHaveStart\">Define repeat start</label>\
			<input id=\"shouldHaveStart\" type=\"checkbox\" onClick=\"handleHidingCheckboxClick(this, 'defineRepeatStartSection')\" />\
			<div id=\"defineRepeatStartSection\" style=\"display: none;\">\
				<label for=\"repeatStartHours\">h</label><input id=\"repeatStartHours\" value=\"0\" type=\"number\" style=\"width: 40px;margin-left: 3px;\"/>\
				<label for=\"repeatStartMins\">m</label><input id=\"repeatStartMins\" value=\"0\" type=\"number\" min=\"0\" max=\"59\" style=\"width: 40px;margin-left: 3px;\"/>\
				<label for=\"repeatStartSecs\">s</label><input id=\"repeatStartSecs\" value=\"0\" type=\"number\" min=\"0\" max=\"59\" style=\"width: 40px;margin-left: 3px;\"/>\
			</div>\
		</div>\
		<div>\
			<label for=\"shouldHaveEnd\">Define repeat end</label>\
			<input id=\"shouldHaveEnd\" type=\"checkbox\" onClick=\"handleHidingCheckboxClick(this, 'defineRepeatEndSection')\" />\
			<div id=\"defineRepeatEndSection\" style=\"display: none;\">\
				<label for=\"repeatEndHours\">h</label><input id=\"repeatEndHours\" value=\"0\" type=\"number\" min=\"0\" style=\"width: 40px;margin-left: 3px;\"/>\
				<label for=\"repeatEndMins\">m</label><input id=\"repeatEndMins\" value=\"0\" type=\"number\" min=\"0\" max=\"59\" style=\"width: 40px;margin-left: 3px;\"/>\
				<label for=\"repeatEndSecs\">s</label><input id=\"repeatEndSecs\" value=\"0\" type=\"number\" min=\"0\" max=\"59\" style=\"width: 40px;margin-left: 3px;\"/>\
			</div>\
		</div><br>\
		<label for=\"repeatFragmentButton\">Repeat</label>\
		<input id=\"repeatFragmentButton\" type=\"checkbox\" onClick=\"makeFragmentRepeat(this)\" />\
	</div>\
	</div>\
";
var frAddIntervalVar = setInterval(function() {
		var watchHeader = document.getElementById('watch-header');
		if (watchHeader) {
			var diver = document.createElement('div'),
				innerDiv = document.createElement('div');
			innerDiv.innerHTML = ytfrHtmlCode;
			diver.appendChild(innerDiv);
			diver.setAttribute("id", "ytfr");
			document.getElementById('watch7-content').insertBefore(diver, watchHeader);
			
			var script = document.createElement('script');
			script.appendChild(document.createTextNode(ytfrScriptCode));
			script.setAttribute("id", "ytfr-script");
			document.head.appendChild(script);
			
			clearInterval(frAddIntervalVar);
		}
	}, 500);