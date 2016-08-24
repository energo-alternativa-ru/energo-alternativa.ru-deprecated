
"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = class Dnd {
	
	static init(config) {
		mongoose.connect(config.uri, config.options);
	}
	
	/**
	 * Вспомогательная функция обновления записей.
	 * Обновляются только те записи, чьи id не найдены в базе монго сайта.
	 */
	static updateRecords(Model, records, caption) {
		let allLength = records.length;
		console.log(`Ищем новые записи из таблицы ${caption}...`);
		return Model.find().select("id").exec().then(result => {
			let ids = [];
			for (let item in result) ids.push(result[item].id);
			return ids;
		}).then(ids => {
			return records.filter(record => ids.indexOf(record.id) == -1);
		}).then(records => {
			if (records.length) {
				console.log(`Найдены новые ${caption}: ${records.length == allLength ? records.length : `${records.length} из ${allLength}`}`);
				console.log(`Отправляем новые ${caption} в базу сайта...`);
				return Model.insertMany(records).then(fn => {
					console.log(`Новые ${caption} успешно отправлены в базу сайта.`);
					return records;
				});
			} else {
				console.log(`Новые ${caption} не найдены.`);
				return records;
			}
		});
	}
	
	/**
	 * Вспомогательная функция обработки записей.
	 */
	static processRecords(Model, caption, fields, fn) {
		console.log(`Обработка таблицы ${caption} на сайте...`);
		return Model.find().select(fields.join(" ")).exec().then(records => {
			return records.map(fn);
		}).then(records => {
			let updates = [];
			records.forEach(record => {
				let $set = {};
				fields.forEach(field => {
					$set[field] = record[field];
				});
				updates.push(Model.findByIdAndUpdate(record._id, {
					$set: $set
				}).exec());
			});
			return Promise.all(updates).then(result => {
				console.log(`Обработка таблицы ${caption} завершена. Обработано: ${result.length}`);
			});
		});
	}

};