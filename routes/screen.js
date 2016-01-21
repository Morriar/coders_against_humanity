var express = require('express');
var session = require('express-session')
var rooms = require('../model/rooms');

var router = express.Router();

function createRoom() {
	var room = {
		id: Math.floor((Math.random() * 10) + 1),
		teams: [
			{
				name: "team1",
				score: 10
			}, {
				name: "team2",
				score: 20
			}
		]
	}
	rooms.insert(room);
	return room;
}

/* wait teams and go to show_score */
router.get('/', function(req, res, next) {
	if(req.session.room_id) {
		rooms.findOne(req.session.room_id, function(room) {
			res.render('screen/index', { session: req.session, room: room });
		});
	} else {
		var room = createRoom();
		req.session.admin = true;
		req.session.room_id = room.id;
		res.render('screen/index', { session: req.session, room: room });
	}
});

/* next is black_card or end game */
router.get('/show_scores', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('screen/show_scores', { session: req.session, room: room});
	});
});

/* next is show results */
router.get('/show_black_card', function(req, res, next) {
  res.render('screen/show_black_card', {});
});

/* next is show scores */
router.get('/show_results', function(req, res, next) {
  res.render('screen/show_results', {});
});

/* next is home */
router.get('/end_game', function(req, res, next) {
	if(!req.session.room_id) {
		res.redirect('/');
		return;
	}
	rooms.findOne(req.session.room_id, function(room) {
		res.render('screen/end_game', {room: room});
	});
});

module.exports = router;
