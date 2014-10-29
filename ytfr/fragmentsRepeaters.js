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
			var startTime = 0,\
				timeUnit = 60,\
				endTime = Number(ytplayer.config.args.length_seconds);\
			if (document.getElementById('shouldHaveEnd').checked) {\
				var userEndTime = Number(document.getElementById('repeatEndHours').value) * timeUnit * timeUnit +\
					Number(document.getElementById('repeatEndMins').value) * timeUnit +\
					Number(document.getElementById('repeatEndSecs').value);\
				if (userEndTime < endTime) {\
					ytplayer.config.args.end = userEndTime;\
					endTime = userEndTime;\
				}\
			}\
			if (document.getElementById('shouldHaveStart').checked) {\
				var userStartTime = Number(document.getElementById('repeatStartHours').value) * timeUnit * timeUnit +\
					Number(document.getElementById('repeatStartMins').value) * timeUnit +\
					Number(document.getElementById('repeatStartSecs').value);\
				if (userStartTime > startTime && userStartTime < endTime) {\
					ytplayer.config.args.start = userStartTime;\
				}\
			}\
			repeatInterval = setInterval(function() {\
				if (document.getElementById(\"movie_player\").getCurrentTime() >= endTime) {\
					ytplayer.load();\
				}\
			}, 1000);\
			ytplayer.load();\
		}\
	}\
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