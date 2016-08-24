
"use strict";

const
	TYPE_CUSTOMER = 1, // Заказчик
	TYPE_LOT = 3, // Участок
	TYPE_OBJ = 5, // Объект
	TYPE_INST = 7, // Электроустановка
	TYPE_REPORT = 9, // Техотчет
	TYPE_FOLDER = 10; // Папка

var mssql = require("mssql"); // https://www.npmjs.com/package/mssql
 
var config = {
	user: 'sa',
	password: 'N2k7B6v34M5p6P8bZ3b5A7q9',
	server: '92.63.99.213', 
	database: 'Alternativa',
	port: 49121
};

let fields = `
	[ИД] as id, 
	[ИДЭлемента] as pid, 
	[Имя] as name, 
	[Описание] as description, 
	[ИДКартинки] as type, 
	[Уровень] as level, 
	[Порядок] as position
`;

var sql = {
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

function getAncestor(item, type) {
	return item ? new mssql.Request().input("pid", mssql.NVarChar, item.pid).query(sql.parent).then(([parent]) => {
		return parent ? (parent.type == type ? parent : getAncestor(parent, type)) : null;
	}) : Promise.resolve(null);
}

function getAlternativaData() {
	return mssql.connect(config).then(function() {
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
				reports.forEach(report => {
					if (report.object) {
						if (!objects[report.object.id]) {
							objects[report.object.id] = report.object;
							objects[report.object.id].reports = [];
							objects[report.object.id].customer = report.customer;
						}
						objects[report.object.id].reports.push(report);
						delete report.object;
						delete report.customer;
					}
				});
				return { reports, objects };
			}).then(data => {
				let objects = [];
				for (let object in data.objects) objects.push(data.objects[object]);
				data.objects = objects;
				return data;
			});
		});
	});
}



getAlternativaData().then(data => {
	getAlternativaData.data = data;
	console.log("Техотчетов:", data.reports.length);
	console.log("Объектов:", data.objects.length);
	console.log("Первый объект:", data.objects[0]);
});

module.exports = getAlternativaData;