
"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	/*id: String,
	isHidden: Boolean*/
});

module.exports = mongoose.model("DndTreeReportItem", schema);

module.exports.baseFields = {
	id: String,
	pid: String,
	name: String,
	description: String,
	type: Number,
	level: Number,
	position: Number,
	sourceName: String,
	sourceDescription: String,
	isHidden: {
		type: Boolean,
		default: false
	}
};