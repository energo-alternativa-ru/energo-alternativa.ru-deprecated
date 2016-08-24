
"use strict";

const mssql = require("mssql");

module.exports = class MssqlConnection {
	
	static init(config) {
		this.config = config;
		this.isConnected = false;
	}
	
	static connect() {
		if (this.isConnected) {
			return Promise.resolve(mssql);
		} else {
			return mssql.connect(this.config).then(fn => {
				this.isConnected = true;
				return mssql;
			});
		}
	}
	
	/*static createConnection(config) {
		this.isConnected = false;
		this.connection = new mssql.Connection(config);
		this.connection.on("connect", fn => {
			this.isConnected = true;
		});
		
		
		this.connectionPromise = new Promise((resolve, reject) => {
			this.connection = new mssql.Connection(config, function(err) {
				if (err) reject(err); else resolve(mssql);
			});
		}).then(fn => {
			
		});

		
		
	}
	
	static getConnection() {
		return this.connection;
	}
	
	static onReady(callback) {
		if (this.isConnected) {
			callback(mssql)
		} else {
			
		}
	}*/
	
};