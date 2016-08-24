
"use strict";

/**
 * Ресурс для получения данных об объектах компании.
 */

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://khusamov:Bbalrasck1976@ds040489.mlab.com:40489/khusamov-test';
var geodata = null;

console.log("Загружаем геоданные объектов...");
MongoClient.connect(url).then(db => {
	var dndpublishes = db.collection("dndpublishes");
	dndpublishes.find().toArray().then(result => {
		geodata = result;
		console.log("Геоданные объектов загружены.");
		db.close();
	});
});

exports.index = function(req, res) {
	res.json({
		success: true,
		points: geodata
	});
};