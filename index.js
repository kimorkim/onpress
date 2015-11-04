var marked = require('marked');
var JsDiff = require('diff');
$(function () {
	var nowView = "";
	$(".mdEditor").on("keyup", function () {
		$this = $(this);
		$editor = $("#present");
		
		var newView = marked($this.val());
		
		
		var result = JsDiff.structuredPatch("a", "b", nowView, newView, "c", "d");
		
		console.log(result);
		if(result.hunks.length > 0) {
			result.hunks[0].lines.forEach(function (value) {
				if(value[0] === "-") {
//					$editor.replace();
				}
			});
		}
		
		nowView = newView;
		
		
		
		$("#present").html(nowView);
	});
});

