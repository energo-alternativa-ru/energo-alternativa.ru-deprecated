
"use strict";

const Dnd = require("./Dnd");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	id: Number,
	priority: Number,
	testPurpose: String,
	name: String,
	number: String,
	created: Date,
	tested: Date,
	isWithoutNumber: Boolean,
	note: String,
	conclusion: String,
	report: String,
	reportType: Number,
	isTitle: {
		type: Boolean,
		default: false
	}
});

schema.static("updateDif", function(protocols) {
	return Dnd.updateRecords(this, protocols, "Протоколы");
});

module.exports = mongoose.model("DndProtocol", schema);