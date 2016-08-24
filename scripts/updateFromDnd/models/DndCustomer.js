
"use strict";

const Dnd = require("./Dnd");
const mongoose = require("mongoose");
const DndTreeReportItem = require("./DndTreeReportItem");

const schema = new mongoose.Schema({
	isIndividual: Boolean
});

schema.add(DndTreeReportItem.baseFields);

schema.static("isIndividual", function(customer) {
	const n = customer.name;
	return ["ГКУ", "больница", "ЦКБ", "“", "Клиника", "ФГБУ", "СОШ", "Достоевская",
	"ГБОУ", "казначейства", "ФБУ", "ГБПОУ", "ИП", "ООО", "«", '"'].map(i => n.indexOf(i) == -1).reduce((a, b) => a && b);
	//return n.indexOf("ИП") == -1 && n.indexOf("ООО") == -1 && n.indexOf("«") == -1 && n.indexOf('"') == -1;
});

schema.static("updateDif", function(objects) {
	return Dnd.updateRecords(this, objects, "Объекты");
});

module.exports = mongoose.model("DndСustomer", schema);