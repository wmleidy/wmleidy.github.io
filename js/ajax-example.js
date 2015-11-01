$(function() {
	$("#ajax-button").on("submit", function(e) {
		e.preventDefault();
		$("#ajax-button input").val("Clicked!");
		$("#ajax-button input").attr("disabled", "disabled");
	})
})