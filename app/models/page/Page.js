
"use strict";

let _ = require("lodash");
let path = require("path");

module.exports = class Page {
	
	get site() {
		return this._site;
	}
	
	set site(site) {
		this._site = site;
	}
	
	get view() {
		return path.join("page", this._data.view || "index");
	}
	
	get data() {
		return this._data;
	}
	
	get title() {
		return this._data.title;
	}
	
	get h1() {
		return this._data.h1 || this._data.title;
	}
	
	get content() {
		return this._data.content;
	}
	
	constructor(site, data) {
		this._site = site;
		this._data = data;
		this._processDataPublic();
	}
	
	_processDataPublic() {
		if (this._data.public) {
			this._data.public.forEach(key => {
				let node = this._data[key];
				this[key] = _.isFunction(node) ? node.bind(this._data) : node;
			});
		}
	}
	
	render(res) {
		res.render(this.view, {
			page: this,
			site: this.site
		});
	}
	
};