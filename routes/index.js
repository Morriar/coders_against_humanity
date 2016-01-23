/*
 * Copyright 2016 Alexandre Terrasa <alexandre@moz-code.org>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var cards = require('../model/cards');
var rooms = require('../model/rooms');
var router = express.Router();

/* PUBLIC ROUTES */

router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/create_room', function(req, res, next) {
	res.render('create_room', {});
});

router.get('/join_room', function(req, res, next) {
	res.render('join_room', {});
});

router.post('/join_room', function(req, res, next) {
	var room_id = req.body.room;
	var room_code = req.body.code;
	var team_name = req.body.team;

	if(!room_id || !room_code || !team_name) {
		res.redirect('/join_room');
		return;
	}

	rooms.findOne(room_id, function(room) {
		if(!room || room.code != room_code) {
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
		if(room.status != "wait_teams") {
			res.redirect('/' + room.status);
			return;
		}
		res.render('wait_teams', { session: req.session, room: room });
	});
});

router.get('/play_round', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		if(room.status != "play_round") {
			res.redirect('/' + room.status);
			return;
		}
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
	if(!Array.isArray(cards)) {
		cards = [cards];
	}
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		if(room.status != "play_round") {
			res.redirect('/' + room.status);
			return;
		}
		var team_name = req.session.team_name;
		var team_hand = room.teams[team_name].hand;

		// remove cards from team hand
		cards.forEach(function(card) {
			team_hand.forEach(function(team_card, index) {
				if(team_card.word == card) {
					team_hand.splice(index, 1)
				}
			});
		});
		room.current_round.hands[team_name] = cards;
		rooms.save(room);
		res.redirect('/play_round');
	});
});

router.get('/show_results', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		if(room.status != "show_results") {
			res.redirect('/' + room.status);
			return;
		}
		res.render('show_results', { session: req.session, room: room });
	});
});

router.get('/end_game', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		if(room.status != "end_game") {
			res.redirect('/' + room.status);
			return;
		}
		res.render('end_game', {room: room});
	});
});

router.post('/quit_game', function(req, res, next) {
	delete req.session.room_id;
	delete req.session.admin;
	delete req.session.team_name;
	res.redirect('/');
});

/* ADMIN ROUTES */

router.post('/create_room', function(req, res, next) {
	var code = req.body["code"];
	if(!code) {
		res.redirect('/create_room');
		return;
	}
	cards.find({color: "white"}, function(whites) {
		cards.find({color: "black"}, function(blacks) {
			var room = rooms.create(code, blacks, whites);
			req.session.admin = true;
			req.session.room_id = room.id;
			res.redirect('/wait_teams');
		});
	});
});

router.post('/new_round', function(req, res, next) {
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		var card = room.deck.black.pop();
		var round_number = room.current_round? room.current_round.round + 1 : 1;
		room.status = "play_round";
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

router.post('/end_round', function(req, res, next) {
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		room.status = "show_results";
		rooms.save(room);
		res.redirect('/show_results');
	});
});

router.post('/vote_round', function(req, res, next) {
	var team_name = req.body["team"];
	if(!team_name) {
		res.redirect('/show_results');
		return;
	}
	if(!req.session.room_id || !req.session.admin) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		var team = room.teams[team_name];
		team.score += room.current_round.black_card.words;
		room.status = "wait_teams";
		rooms.save(room);
		res.redirect('/wait_teams');
	});
});

router.post('/end_game', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		room.status = "end_game";
		rooms.save(room);
		res.redirect("/end_game");
	});
});

module.exports = router;
