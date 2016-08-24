
"use strict";

const Dnd = require("./Dnd");
const mongoose = require("mongoose");
const DndTreeReportItem = require("./DndTreeReportItem");

const schema = new mongoose.Schema({
	isIndividual: Boolean,
	customer: String
});

schema.add(DndTreeReportItem.baseFields);

schema.static("updateDif", function(objects) {
	return Dnd.updateRecords(this, objects, "Объекты");
});

schema.static("getAllObjects", function(select) {
	return this.find().select(select.join(" ")).exec();
});

module.exports = mongoose.model("DndObject", schema);