var express = require('express');
var cards = require('../model/cards');
var rooms = require('../model/rooms');
var router = express.Router();

/* GET wait teams. */
router.get('/', function(req, res, next) {
  res.render('join_room', {});
});

router.post('/join_room', function(req, res, next) {
	var room_id = req.body.room;
	var team_name = req.body.team;

	if(!room_id || !team_name) {
		res.redirect('/team');
		return;
	}
	rooms.findOne(room_id, function(room) {
		if(!room) {
			res.redirect('/team');
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
		res.redirect('/team/wait_teams');
	});
});

/* next is show scores */
router.get('/wait_teams', function(req, res, next) {
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('wait_teams', { session: req.session, room: room});
	});
});

/* next is white_cards or end game */
router.get('/show_scores', function(req, res, next) {
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('show_scores', { session: req.session, room: room});
	});
});

/* next is show results */
router.get('/show_black_card', function(req, res, next) {
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		// load team
		var team = room.teams[req.session.team_name];
		if(!team) {
			res.redirect('/');
			return;
		}
		// build team deck
		while(team.hand.length < 5) {
			team.hand.push(room.deck.white.pop())
		}
		rooms.save(room);
		res.render('show_black_card', { session: req.session, room: room });
	});
});

router.post('/pick_white_cards', function(req, res, next) {
	var cards = req.body["cards[]"];
	if(!cards) {
		res.redirect('/team/show_black_card');
		return;
	}
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		room.current_round.hands[req.session.team_name] = cards;
		rooms.save(room);
		res.redirect('/team/show_results');
	});
});

/* next is show scores */
router.get('/show_results', function(req, res, next) {
		res.render('show_results', { session: req.session, room: room});
});

/* next is home */
router.get('/end_game', function(req, res, next) {
	if(!req.session.room_id || !req.session.team_name) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		delete req.session.room_id;
		delete req.session.team;
		res.render('end_game', { session: req.session, room: room });
	});
});

module.exports = router;
