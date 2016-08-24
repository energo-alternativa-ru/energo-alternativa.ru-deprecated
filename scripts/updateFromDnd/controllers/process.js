
"use strict";

const Dnd = require("../models/Dnd");
const DndReport = require("../models/DndReport");
const DndObject = require("../models/DndObject");
const DndCustomer = require("../models/DndCustomer");
const DndTreeReportItem = require("../models/DndCustomer");

module.exports = class Update {
	
	static processReports() {
		const fields = ["isHidden", "name", "sourceName"];
		return Dnd.processRecords(DndReport, "Отчеты", fields, obj => {
			if (obj.name.indexOf(" ") == -1) {
				if (!obj.sourceName) obj.sourceName = obj.name;
				obj.name = this.changeReportName(obj.sourceName);
			} else {
				obj.isHidden = true;
			}
			return obj;
		});
	}
	
	static changeReportName(name) {
		name = this.changeString(name);
		return name;
	}
	
	static processObjects() {
		const fields = ["name", "sourceName", "description", "sourceDescription", "isIndividual"];
		return Dnd.processRecords(DndObject, "Объекты", fields, obj => {
			if (!obj.sourceName) obj.sourceName = obj.name;
			if (!obj.sourceDescription) obj.sourceDescription = obj.description;
			if (obj.isIndividual) {
				obj.name = this.changeIndividualName(obj.sourceName);
				obj.description = this.changeIndividualDesc(obj.sourceDescription);
			} else {
				obj.name = this.changeLegalName(obj.sourceName);
				obj.description = this.changeLegalDesc(obj.sourceDescription);
			}
			return obj;
		});
	}
	
	static changeLegalName(name) {
		name = this.changeString(name);
		name = this.changeQuotes(name);
		return name;
	}
	
	static changeLegalDesc(name) {
		name = this.changeString(name);
		name = this.changeQuotes(name);
		return name;
	}
	
	static changeIndividualName(name) {
		name = name.replace("№", "");
		name = name.replace(/\d/g, "");
		name = this.changeString(name);
		name = this.changeQuotes(name);
		return name;
	}
	
	static changeIndividualDesc(name) {
		name = name.replace(/[^а-я](кв\.?)(\s*)(№?)(\s*)\d*/g, "");
		name = this.changeString(name);
		name = this.changeQuotes(name);
		return name;
	}
	
	static processCustomers() {
		const fields = ["name", "sourceName", "isIndividual"];
		return Dnd.processRecords(DndCustomer, "Заказчики", fields, customer => {
			if (!customer.sourceName) customer.sourceName = customer.name;
			customer.isIndividual = DndCustomer.isIndividual(customer);
			if (!customer.isIndividual) customer.name = this.changeCustomerName(customer.sourceName);
			return customer;
		});
	}
	
	static changeCustomerName(name) {
		name = this.changeString(name);
		name = this.changeQuotes(name);
		return name;
	}
	
	static changeQuotes(str) {
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
	
	/**
	 * Общие обработки строк.
	 */
	static changeString(str) {
		str = str.trim();
		str = str.replace(/[,\.]*$/, "");
		return str;
	}
	
};