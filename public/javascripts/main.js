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
			if(data.status != currentStatus) {
				window.location.href = "/" + data.status;
			} else {
				redirectPlayer(roomId, currentStatus);
			}
		});
	}, 1000);
}

function updateTeamList(roomId, currentTeam, div) {
	window.setTimeout(function() {
		$.get( "/get_room/" + roomId, function(data) {
			div.empty();
			Object.keys(data.teams).forEach(function(key){
				var team = data.teams[key]
				div.append($("<div>").addClass("col-xs-6")
					.append($("<div>").addClass(currentTeam == team.name? "slot slot-success": "slot slot-primary")
						.append($("<strong>").text(team.name))
						.append($("<p>").addClass("score").text(team.score))
					)
				);
			})
			updateTeamList(roomId, currentTeam, div);
		});
	}, 2000);
}

function updateTeamStatus(roomId, tr) {
	window.setTimeout(function() {
		$.get( "/get_room/" + roomId, function(data) {
			tr.empty();
			Object.keys(data.teams).forEach(function(key){
				var team = data.teams[key]
				tr.append(
					$("<th>")
					.css("width", "25%")
					.addClass("text-center")
					.addClass(data.current_round.hands[team.name]? "success": "danger")
					.text(team.name)
				);
			})
			updateTeamStatus(roomId, tr);
		});
	}, 2000);
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
		updateTeamList(body.data("roomid"), body.data("currentteam"), $("#teams"));
		updateTeamStatus(body.data("roomid"), $("#teams-status"));
	}

	$(".click-room").click(function() {
		$("input[name='room']").val($(this).data("room"));
		return false;
	})
});
