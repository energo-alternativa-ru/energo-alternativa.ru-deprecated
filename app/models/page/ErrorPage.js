
/* global Model */

"use strict";

module.exports = class ErrorPage extends Model.page.Page {
	
	get view() {
		return this._data.view || "error";
	}
	
	get message() {
		return this._data.message;
	}
	
	get error() {
		return this._data.error;
	}
	
};