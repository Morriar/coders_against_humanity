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

var db = require('mongoskin').db('mongodb://localhost:27017/csg_cah');
db.bind('cards');

// Load all cards and callback(cards);
exports.find = function(req, callback) {
	db.cards.find(req).toArray(function(err, cards) {
		if(err) {
			console.log(err);
			cards = [];
		}
		callback(cards);
	});
}

// Load a card by its id and callback(card);
exports.findOne = function(card_id, callback) {
	db.cards.findOne({id: card_id}, function(err, card) {
		callback(card);
	});
}
