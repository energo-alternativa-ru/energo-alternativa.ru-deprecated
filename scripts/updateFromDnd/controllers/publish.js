
"use strict";

const DndGeocoder = require("../models/DndGeocoder");
const DndCustomer = require("../models/DndCustomer");
const DndObject = require("../models/DndObject");
const DndReport = require("../models/DndReport");
const DndPublish = require("../models/DndPublish");

module.exports = class Geocoder {
	
	static publishObjects() {
		console.log("Публикация объектов на карте.");
		console.log("Загружаем точки, объекты, заказчиков и отчеты...");
		return Promise.all([
			DndGeocoder.find().exec(),
			DndObject.find().exec(),
			DndCustomer.find().exec(),
			DndReport.find().exec(),
			DndPublish.remove().exec()
		]).then(([points, objects, customers, reports]) => {
			console.log("Готово. Объединяем данные для публикации...");
			return Promise.all(points.map(point => {
				let object = objects.filter(object => object.id == point.object)[0].toObject();
				let customer = customers.filter(customer => customer.id == object.customer)[0].toObject();
				return {
					longitude: point.get("longitude"),
					latitude: point.get("latitude"),
					reports: reports.filter(report => report.object == point.object && !report.isHidden).map(report => report.toObject()),
					object,
					customer
				};
			}));
		}).then(points => {
			console.log("Готово. Отправляем в базу на сайте...");
			return DndPublish.insertMany(points);
		}).then(fn => {
			console.log("Готово.");
		});
	}
	
};