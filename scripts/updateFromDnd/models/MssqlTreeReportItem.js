
"use strict";

const mssql = require("mssql");

const DndCustomer = require("./DndCustomer");
const MssqlConnection = require("./MssqlConnection");
const MssqlBase = require("./MssqlBase");

module.exports = class MssqlTreeReportItem {
	
	static getAncestor(item, type) {
		return item ? new mssql.Request().input("pid", mssql.NVarChar, item.pid).query(MssqlBase.sqlTemplates.parent).then(([parent]) => {
			return parent ? (parent.type == type ? parent : this.getAncestor(parent, type)) : null;
		}) : Promise.resolve(null);
	}
	
	static getReportsAndObjectsAndCustomers() {
		return MssqlConnection.connect().then(mssql => {
			return new mssql.Request().query(MssqlBase.sqlTemplates.reports).then(reports => {
				let reportProcess = [];
				reports.forEach(report => {
					reportProcess.push(this.getAncestor(report, MssqlBase.TYPE_OBJ).then(object => {
						report.object = object;
						return this.getAncestor(object, MssqlBase.TYPE_CUSTOMER).then(customer => {
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
							objects[report.object.id].isIndividual = DndCustomer.isIndividual(report.customer);
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
				}).then(([reports, objects, customers]) => {
					// Отфильтровать левые объекты.
					objects = objects.filter(object => object.name.toLowerCase().indexOf("шаблон") == -1);
					return [reports, objects, customers];
				});
			});
		});
	}
	
};