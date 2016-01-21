var express = require('express');
var cards = require('../model/cards');
var rooms = require('../model/rooms');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/create_room', function(req, res, next) {
	if(req.session.room_id) {
		res.redirect('/wait_teams');
	} else {
		cards.find({color: "white"}, function(whites) {
			cards.find({color: "black"}, function(blacks) {
				var room = rooms.create(blacks, whites);
				req.session.admin = true;
				req.session.room_id = room.id;
				res.redirect('/wait_teams');
			});
		});
	}
});

router.get('/join_room', function(req, res, next) {
	res.render('join_room', {});
});

router.post('/join_room', function(req, res, next) {
	var room_id = req.body.room;
	var team_name = req.body.team;

	if(!room_id || !team_name) {
		res.redirect('/join_room');
		return;
	}

	rooms.findOne(room_id, function(room) {
		if(!room) {
			res.redirect('/');
			return;
		}

		var team = {
			name: team_name,
			score: 0,
			hand: []
		}
		req.session.room_id = room_id;
		req.session.team_name = team_name;
		room.teams[team_name] = team
		rooms.save(room);
		res.redirect('/wait_teams');
	});
});

router.get('/wait_teams', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('wait_teams', { session: req.session, room: room });
	});
});

router.get('/new_round', function(req, res, next) {
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		var card = room.deck.black.pop();
		var round_number = room.current_round? room.current_round.round + 1 : 1;
		room.current_round = {
			round: round_number,
			black_card: card,
			status: "open",
			hands: {}
		}
		rooms.save(room);
		res.redirect('/play_round');
	});
});

router.get('/play_round', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		if(req.session.team_name) {
			var team = room.teams[req.session.team_name];
			if(!team) {
				res.redirect('/');
				return;
			}
			while(team.hand.length < 5) {
				team.hand.push(room.deck.white.pop())
			}
			rooms.save(room);
		}
		res.render('play_round', { session: req.session, room: room });
	});
});

router.post('/play_round', function(req, res, next) {
	var cards = req.body["cards[]"];
	if(!cards) {
		res.redirect('/play_round');
		return;
	}
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		room.current_round.hands[req.session.team_name] = cards;
		rooms.save(room);
		res.redirect('/play_round');
	});
});

router.get('/end_round', function(req, res, next) {
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		room.current_round.status = "closed";
		res.redirect('/show_results');
	});
});

router.get('/show_results', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('show_results', { session: req.session, room: room });
	});
});

router.get('/vote_round', function(req, res, next) {
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.redirect('/wait_teams');
	});
});

router.get('/end_game', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		delete req.session.room_id;
		delete req.session.admin;
		delete req.session.team_name;
		res.render('end_game', {room: room});
	});
});

module.exports = router;
