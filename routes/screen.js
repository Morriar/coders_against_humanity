var express = require('express');
var session = require('express-session')
var cards = require('../model/cards');
var rooms = require('../model/rooms');

var router = express.Router();

/* wait teams and go to show_score */
router.get('/', function(req, res, next) {
	if(req.session.room_id) {
		rooms.findOne(req.session.room_id, function(room) {
			res.render('wait_teams', { session: req.session, room: room });
		});
	} else {
		cards.find({color: "white"}, function(whites) {
			cards.find({color: "black"}, function(blacks) {
				var room = rooms.create(blacks, whites);
				req.session.admin = true;
				req.session.room_id = room.id;
				res.render('wait_teams', { session: req.session, room: room });
			});
		});
	}
});

/* next is black_card or end game */
router.get('/show_scores', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('show_scores', { session: req.session, room: room});
	});
});

/* next is show results */
router.get('/show_black_card', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		var card = room.deck.black.pop();
		room.current_round = {
			round: 1,
			black_card: card,
			hands: {
				"team1": [{word: "wordOO"}, {word: "wordZZZ"}],
				"team2": [{word: "wordBB"}, {word: "wordHH"}],
			}
		}
		rooms.save(room);
		res.render('show_black_card', { session: req.session, room: room });
	});
});

/* next is show scores */
router.get('/show_results', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('show_results', { session: req.session, room: room });
	});
});

/* next is home */
router.get('/end_game', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		delete req.session.admin;
		delete req.session.room_id;
		res.render('end_game', {room: room});
	});
});

module.exports = router;
