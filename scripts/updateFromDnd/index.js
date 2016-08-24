
"use strict";

const config = require("./config");
const MssqlConnection = require("./models/MssqlConnection");
const Dnd = require("./models/Dnd");

MssqlConnection.init(config.mssql);
Dnd.init(config.mongoose);

const divider = result => { console.log(""); return result; };

const updateController = require("./controllers/update");
const processController = require("./controllers/process");
const geocoderController = require("./controllers/geocoder");
const publishController = require("./controllers/publish");

/*geocoderController.geocode().then(fn => {
	console.log("Завершение скрипта.");
	process.exit(0);
}).catch(err => {
	console.log("");
	console.error("Фатальная ошибка:");
	console.error(err);
	process.exit(1);
});*/

publishController.publishObjects().then(fn => {
	console.log("Завершение скрипта.");
	process.exit(0);
}).catch(err => {
	console.log("");
	console.error("Фатальная ошибка:");
	console.error(err);
	process.exit(1);
});


/*updateController.updateReportsAndObjectsAndCustomers()
	.then(divider)
	.then(updateController.updateProtocols.bind(updateController))
	.then(divider)
	.then(processController.processCustomers.bind(processController))
	.then(divider)
	.then(processController.processObjects.bind(processController))
	.then(divider)
	.then(processController.processReports.bind(processController))
	.then(divider)
	.then(geocoderController.geocode.bind(geocoderController))
	.then(divider)
	.then(publishController.publishObjects.bind(publishController))
	.then(divider)
	.then(fn => {
		console.log("Завершение скрипта.");
		process.exit(0);
	}).catch(err => {
		console.log("");
		console.error("Фатальная ошибка:");
		console.error(err);
		process.exit(1);
	});*/