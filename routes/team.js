var express = require('express');
var router = express.Router();

/* GET wait teams. */
router.get('/', function(req, res, next) {
  res.render('join_room', {});
});

/* next is show scores */
router.get('/wait_teams', function(req, res, next) {
		res.render('wait_teams', { session: req.session, room: room});
});

/* next is white_cards or end game */
router.get('/show_scores', function(req, res, next) {
		res.render('show_scores', { session: req.session, room: room});
});

/* next is show results */
router.get('/show_white_cards', function(req, res, next) {
		res.render('show_white_cards', { session: req.session, room: room, team: team});
});

/* next is show scores */
router.get('/show_results', function(req, res, next) {
		res.render('show_results', { session: req.session, room: room});
});

/* next is home */
router.get('/end_game', function(req, res, next) {
		res.render('end_game', { session: req.session, room: room});
});

module.exports = router;
