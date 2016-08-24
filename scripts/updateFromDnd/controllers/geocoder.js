
"use strict";

const MultiGeocoder = require("multi-geocoder");
const DndGeocoder = require("../models/DndGeocoder");
const DndObject = require("../models/DndObject");
var colors = require("colors/safe");

const geocoder = new MultiGeocoder({ lang: "ru-RU", coordorder: "latlong" });

module.exports = class Geocoder {
	
	static geocode() {
		console.log("Загружаем объекты для геокодирования...");
		return DndObject.getAllObjects(["id", "name", "description"]).then(objects => {
			console.log(`Загружено объектов: ${objects.length}`);
			const addresses = objects.map(object => object.description);
			console.log("Запускаем геокодирование...");
			let geocodes = [];
			geocodes.push(new Promise((resolve, reject) => geocoder.geocode(addresses, { provider: "yandex" }).then(resolve).fail(reject)));
			geocodes.push(new Promise((resolve, reject) => geocoder.geocode(addresses, { provider: "google" }).then(resolve).fail(reject)));
			return Promise.all(geocodes).then(([yandex, google]) => {
				console.log("Геокодирование завершено.");
				// Вывод ошибок геокодирования, если они есть, для уведомления.
				this.logErrors(yandex, "Яндекс", objects);
				this.logErrors(google, "Google", objects);
				// Если ошибки есть, то не найденные объекты надо отфильтровать.
				let indexes = yandex.errors.map(error => error.index).concat(google.errors.map(error => error.index));
				if (indexes.length) objects = objects.filter((object, index) => indexes.indexOf(index) == -1);
				return objects.map((object, index) => {
					return {
						object: object.id,
						address: object.description,
						latitude: yandex.result.features[index].geometry.coordinates[0],
						longitude: yandex.result.features[index].geometry.coordinates[1],
						coordinates: {
							yandex: yandex.result.features[index].geometry.coordinates,
							google: google.result.features[index].geometry.coordinates
						},
						results: {
							yandex: yandex.result.features[index],
							google: google.result.features[index]
						}
					};
				});
			}).then(objects => {
				console.log("Отправляем данные геокодирования в базу сайта...");
				return DndGeocoder.insertMany(objects).then(fn => objects.length);
			}).then(length => {
				console.log(`Готово, отправлено записей: ${length}`);
			});
		});
	}
	
	static logErrors(result, providerName, objects) {
		if (result.errors.length) {
			console.error(colors.red(`Найдено ошибок ${providerName}-геокодирования: ${result.errors.length}`));
			result.errors.forEach((error, index) => {
				let obj = objects[error.index];
				console.error(colors.red(`${index + 1}. ${obj.name} (${obj.id}) — ${error.reason}: '${error.request}'.`));
			});
		}
	}
	
};