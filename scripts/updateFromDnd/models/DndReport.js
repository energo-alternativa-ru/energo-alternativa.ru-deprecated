
"use strict";

const Dnd = require("./Dnd");
const mongoose = require("mongoose");
const DndTreeReportItem = require("./DndTreeReportItem");

const schema = new mongoose.Schema({
	customer: String,
	object: String,
	created: Date,
	testPurpose: String,
	protocols: Array
});

schema.add(DndTreeReportItem.baseFields);

schema.static("updateDif", function(reports) {
	return Dnd.updateRecords(this, reports, "Техотчеты");
});

module.exports = mongoose.model("DndReport", schema);