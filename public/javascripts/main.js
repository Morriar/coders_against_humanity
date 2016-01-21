function decrementTimer(id) {
	window.setTimeout(function() {
		var p = $(id).width() / $(id).parent().width() * 100
		console.log(p);
		$(id).css("width", (p - 1) + "%");
		decrementTimer(id);
	}, 1000);
}

$(document).ready(function() {
	decrementTimer("#timer");
});
