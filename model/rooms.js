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
db.bind('rooms');

exports.create = function(code, blacks, whites) {
	var room = {
		id: new Date().getTime().toString(),
		code: code,
		max_rounds: 5,
		teams: {},
		deck: {
			black: blacks,
			white: whites
		},
		status: "wait_teams",
		current_round: {
			round: 1,
			hands: {}
		}
	}
	db.rooms.insert(room);
	return room;
}

exports.find = function(req, callback) {
	db.rooms.find(req).toArray(function(err, rooms) {
		if(err) {
			console.log(err);
			rooms = [];
		}
		callback(rooms);
	});
}

exports.findOne = function(room_id, callback) {
	db.rooms.findOne({id: room_id}, function(err, room) {
		callback(room);
	});
}

exports.save = function(room) {
	db.rooms.update({'id': room.id}, room);
}

exports.insert = function(room) {
	db.rooms.insert(room);
}

exports.remove = function(room) {
	db.rooms.remove({id: room.id});
}
