function decrementTimer(id) {
	window.setTimeout(function() {
		var p = $(id).width() / $(id).parent().width() * 100
		$(id).css("width", (p - 1) + "%");
		decrementTimer(id);
	}, 1000);
}

$(document).ready(function() {
	decrementTimer("#timer");

	$(".card-white").click(function() {
		var form = $("#pickCards")

		var max = form.data("words");
		var count = form.find("input:checkbox:checked").length;

		if($(this).find("input:checkbox").prop("checked")) {
			$(this).removeClass("active");
			$(this).find("input:checkbox").prop("checked", false);
		} else {
			if(count >= max) {
				return;
			}
			$(this).addClass("active");
			$(this).find("input:checkbox").prop("checked", true);
		}
	});
});
