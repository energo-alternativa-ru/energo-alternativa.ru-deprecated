
"use strict";

const Dnd = require("./Dnd");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	object: String,
	address: String,
	longitude: Number,
	latitude: Number,
	coordinates: Object,
	results: Object
});

module.exports = mongoose.model("DndGeocoder", schema);