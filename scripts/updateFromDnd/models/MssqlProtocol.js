
"use strict";

const MssqlConnection = require("./MssqlConnection");
const MssqlBase = require("./MssqlBase");

module.exports = class MssqlProtocol {
	
	static getProtocols() {
		return MssqlConnection.connect().then(mssql => {
			return new mssql.Request().query(MssqlBase.sqlTemplates.protocols).then(protocols => {
				return protocols.map(protocol => {
					if (typeof protocol.note == "string") protocol.note = protocol.note.trim() ? protocol.note : null;
					if (typeof protocol.conclusion == "string") protocol.conclusion = protocol.conclusion.trim() ? protocol.conclusion : null;
					protocol.name = protocol.name.replace(/^\d*\.\s*/, "");
					if (protocol.number.indexOf("нет") != -1) protocol.number = null;
					if (protocol.name.toLowerCase().indexOf("титульный") != -1) {
						protocol.isTitle = true;
						protocol.name = "Титульный лист";
					}
					return protocol;
				});
			});
		});
	}
	
};