
"use strict";

const MssqlProtocol = require("../models/MssqlProtocol");
const MssqlTreeReportItem = require("../models/MssqlTreeReportItem");
const DndReport = require("../models/DndReport");
const DndObject = require("../models/DndObject");
const DndCustomer = require("../models/DndCustomer");
const DndProtocol = require("../models/DndProtocol");

module.exports = class Update {
	
	static updateReportsAndObjectsAndCustomers() {
		const divider = result => { console.log(""); return result; };
		console.log("Получение данных об отчетах, объектах и заказчиках...");
		return MssqlTreeReportItem.getReportsAndObjectsAndCustomers().then(([reports, objects, customers]) => {
			console.log("Данные получены.");
			console.log("");
			return DndReport.updateDif(reports).then(divider).then(fn => {
				return DndObject.updateDif(objects);
			}).then(divider).then(fn => {
				return DndCustomer.updateDif(customers);
			});
		});
	}
	
	static updateProtocols() {
		console.log("Получение данных о протоколах...");
		return MssqlProtocol.getProtocols().then(protocols => {
			console.log("Данные получены.");
			console.log("");
			return DndProtocol.updateDif(protocols);
		}).then(protocols => {
			console.log("");
			console.log("Размещаем протоколы в отчетах...");
			return DndReport.find().cursor().eachAsync(report => {
				let reportProtocols = protocols.filter(protocol => protocol.report == report.id);
				if (reportProtocols.length) {
					let title = reportProtocols.filter(protocol => protocol.isTitle)[0];
					let created = title ? title.created : null;
					let testPurpose = title ? title.testPurpose : null;
					return DndReport.update({ id: report.id }, { $set: { created, testPurpose, protocols: reportProtocols } });
				}
			}).then(fn => {
				console.log("Готово.");
			});
		});
	}
	
};