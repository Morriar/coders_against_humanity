var express = require('express');
var router = express.Router();

/* GET wait teams. */
router.get('/', function(req, res, next) {
  res.render('team/index', {});
});

/* next is show scores */
router.get('/wait_teams', function(req, res, next) {
  res.render('team/wait_teams', {});
});

/* next is white_cards or end game */
router.get('/show_scores', function(req, res, next) {
  res.render('team/show_scores', {});
});

/* next is show results */
router.get('/show_white_cards', function(req, res, next) {
  res.render('team/show_white_cards', {});
});

/* next is show scores */
router.get('/show_results', function(req, res, next) {
  res.render('team/show_results', {});
});

/* next is home */
router.get('/end_game', function(req, res, next) {
  res.render('team/end_game', {});
});

module.exports = router;
