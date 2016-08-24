
"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	longitude: Number,
	latitude: Number,
	reports: Array,
	object: Object,
	customer: Object
});

module.exports = mongoose.model("DndPublish", schema);