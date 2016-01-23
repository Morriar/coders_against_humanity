function decrementTimer(id) {
	window.setTimeout(function() {
		var p = $(id).width() / $(id).parent().width() * 100
		$(id).css("width", (p - 1) + "%");
		decrementTimer(id);
	}, 1000);
}

function redirectPlayer(roomId, currentStatus) {
	window.setTimeout(function() {
		$.get( "/get_room/" + roomId, function(data) {
			console.log(data.status);
			if(data.status != currentStatus) {
				window.location.href = "/" + data.status;
			} else {
				redirectPlayer(roomId, currentStatus);
			}
		});
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

	var body = $("body");
	if(body.data("roomid")) {
		redirectPlayer(body.data("roomid"), body.data("currentstatus"));
	}
});
