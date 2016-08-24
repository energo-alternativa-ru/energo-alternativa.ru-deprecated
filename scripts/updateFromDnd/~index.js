
"use strict";

const
	TYPE_CUSTOMER = 1, // Заказчик
	TYPE_LOT = 3, // Участок
	TYPE_OBJ = 5, // Объект
	TYPE_INST = 7, // Электроустановка
	TYPE_REPORT = 9, // Техотчет
	TYPE_FOLDER = 10; // Папка

const mssql = require("mssql"); // https://www.npmjs.com/package/mssql
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
 
const config = {
	mssql: {
		user: "sa",
		password: "N2k7B6v34M5p6P8bZ3b5A7q9",
		server: "92.63.99.213", 
		database: 'Alternativa',
		port: 49121
	},
	mongoose: {
		uri: "mongodb://ds040489.mlab.com:40489/khusamov-test",
		options: {
			user: "khusamov",
			pass: "Bbalrasck1976"
		}
	}
};

const fields = `
	[ИД] as id, 
	[ИДЭлемента] as pid, 
	[Имя] as name, 
	[Описание] as description, 
	[ИДКартинки] as type, 
	[Уровень] as level, 
	[Порядок] as position
`;

const sql = {
	reports: `
		SELECT ${fields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДКартинки] = ${TYPE_REPORT}
	`,
	customers: `
		SELECT ${fields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДКартинки] = ${TYPE_CUSTOMER}
	`,
	childs: `
		SELECT ${fields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДЭлемента] = @pid
	`,
	parent: `
		SELECT ${fields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИД] = @pid
	`,
	protocols: `
		
	`
};

/**
 * Модель данных (заказчики, объекты, техотчеты, протоколы) в базе Монго.
 */

mongoose.connect(config.mongoose.uri, config.mongoose.options);

const commonFields = {
	id: String,
	pid: String,
	name: String,
	sourceName: String,
	description: String,
	type: Number,
	level: Number,
	position: Number
};

// Заказчик

const сustomerSchema = new Schema({
	isIndividual: Boolean
});
сustomerSchema.add(commonFields);

const Сustomer = mongoose.model("Сustomer", сustomerSchema);

// Объект

const objectSchema = new Schema({
	isIndividual: Boolean,
	customer: String
});
objectSchema.add(commonFields);

const СustomerObject = mongoose.model("СustomerObject", objectSchema);

// Техотчет

const reportSchema = new Schema({
	customer: String,
	object: String,
	created: Date,
	protocols: Array
});
reportSchema.add(commonFields);

const СustomerReport = mongoose.model("СustomerReport", reportSchema);

// Протокол

const protocolSchema = new Schema({
	
});

const СustomerProtocol = mongoose.model("СustomerProtocol", protocolSchema);



/**
 * Обработка данных о заказчиках в базе Монго сайта.
 */
function processCustomers() {
	const fields = ["name", "sourceName", "isIndividual"];
	return processRecords(Сustomer, "Заказчики", fields, customer => {
		if (!customer.sourceName) customer.sourceName = customer.name;
		customer.isIndividual = isIndividual(customer);
		if (!customer.isIndividual) customer.name = changeQuotes(customer.sourceName);
		return customer;
	});
}

function changeQuotes(str) {
	str = str.trim();
	str = str.replace(/\.$/, "");
	if (str.indexOf("»") == -1 && (str.indexOf('"') != -1 || str.indexOf('“') != -1)) {
		if (str.indexOf('"') != -1) {
			str = str.replace('"', "«");
			if (str.indexOf('"') != -1) {
				str = str.substring(0, str.lastIndexOf('"')) + "»" + str.substring(str.lastIndexOf('"') + 1);
			} else {
				str += "»";
			}
		}
		if (str.indexOf('“') != -1) {
			str = str.replace('“', "«");
			str = str.replace('”', "«");
		}
		str = str.replace(/«\s*/, "«");
		str = str.replace(/\s*»/, "»");
	}
	return str;
}



function isIndividual(customer) {
	const n = customer.name;
	return ["ГКУ", "больница", "ЦКБ", "“", "Клиника", "ФГБУ", "СОШ", "Достоевская",
	"ГБОУ", "казначейства", "ФБУ", "ГБПОУ", "ИП", "ООО", "«", '"'].map(i => n.indexOf(i) == -1).reduce((a, b) => a && b);
	//return n.indexOf("ИП") == -1 && n.indexOf("ООО") == -1 && n.indexOf("«") == -1 && n.indexOf('"') == -1;
}

/**
 * Обработка данных об объектах в базе Монго сайта.
 */
function processObjects() {
	const fields = ["name", "sourceName"];
	return processRecords(СustomerObject, "Объекты", fields, obj => {
		if (!obj.sourceName) obj.sourceName = obj.name;
		obj.name = changeQuotes(obj.sourceName);
		return obj;
	});
}

/**
 * Получение данных об объекта и техотчетов из MS SQL базы ДНД.
 */

function getAncestor(item, type) {
	return item ? new mssql.Request().input("pid", mssql.NVarChar, item.pid).query(sql.parent).then(([parent]) => {
		return parent ? (parent.type == type ? parent : getAncestor(parent, type)) : null;
	}) : Promise.resolve(null);
}

function getReportsAndObjectsAndCustomers() {
	return mssql.connect(config.mssql).then(function() {
		return new mssql.Request().query(sql.reports).then(reports => {
			let reportProcess = [];
			reports.forEach(report => {
				reportProcess.push(getAncestor(report, TYPE_OBJ).then(object => {
					report.object = object;
					return getAncestor(object, TYPE_CUSTOMER).then(customer => {
						report.customer = customer;
						return report;
					});
				}));
			});
			return Promise.all(reportProcess).then(reports => {
				let objects = {};
				let customers = {};
				reports = reports.filter(report => report.object);
				reports.forEach(report => {
					if (!objects[report.object.id]) {
						objects[report.object.id] = report.object;
						objects[report.object.id].customer = report.customer.id;
						objects[report.object.id].isIndividual = isIndividual(report.customer);
					}
					if (!customers[report.customer.id]) {
						customers[report.customer.id] = report.customer;
					}
					report.object = report.object.id;
					report.customer = report.customer.id;
				});
				return [reports, objects, customers];
			}).then(([reports, objects, customers]) => {
				let _objects = [];
				let _customers = [];
				for (let object in objects) _objects.push(objects[object]);
				for (let customer in customers) _customers.push(customers[customer]);
				return [reports, _objects, _customers];
			});
		});
	});
}

function updateReportsAndObjectsAndCustomers() {
	console.log("Получение данных об отчетах, объектах и заказчиках...");
	return getReportsAndObjectsAndCustomers().then(([reports, objects, customers]) => {
		console.log("Данные получены.");
		console.log("");
		return updateRecords(СustomerReport, reports, "Техотчеты").then(fn => [reports, objects, customers]);
	}).then(divider).then(([reports, objects, customers]) => {
		return updateRecords(СustomerObject, objects, "Объекты").then(fn => [reports, objects, customers]);
	}).then(divider).then(([reports, objects, customers]) => {
		return updateRecords(Сustomer, customers, "Заказчики");
	});
}



/**
 * Вспомогательная функция обновления записей.
 * Обновляются только те записи, чьи id не найдены в базе монго сайта.
 */
function updateRecords(Model, records, caption) {
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
			});
		} else {
			console.log(`Новые ${caption} не найдены.`);
			return;
		}
	});
}

/**
 * Вспомогательная функция обработки записей.
 */
function processRecords(Model, caption, fields, fn) {
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














/**
 * Основные скриты.
 */


/*processCustomers().then(fn => {
	console.log("Завершение скрипта.");
	process.exit(0);
}).catch(err => {
	console.log("");
	console.error("Фатальная ошибка:");
	console.error(err);
	process.exit(1);
});*/


function divider(result) {
	console.log("");
	return result;
}

updateReportsAndObjectsAndCustomers()
	.then(divider)
	.then(processCustomers)
	.then(divider)
	.then(processObjects)
	.then(divider)
	.then(fn => {
		console.log("Завершение скрипта.");
		process.exit(0);
	}).catch(err => {
		console.log("");
		console.error("Фатальная ошибка:");
		console.error(err);
		process.exit(1);
	});



