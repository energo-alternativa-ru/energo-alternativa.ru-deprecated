
"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const punycode = require("punycode");

const models = require("./index");
const page = require("./page");
const fn = require("./functions");

const yaml = models.getYaml();

const site = module.exports = {};

/**
 * Конструктор сайта.
 */
site.createSite = homedir => {
	return new Site(homedir);
};


/**
 * Класс сайта.
 */
class Site {
	
	get id() {
		return path.basename(this.homedir);
	}
	
	get title() {
		return this._data.title;
	}
	
	get homedir() {
		return this._homedir;
	}
	
	get pagesdir() {
		return path.join(this.homedir, "pages");
	}
	
	get root() {
		return this._root;
	}
	
	get hostnames() {
		return (this._data.hostnames ? this._data.hostnames : []).map(hostname => punycode.toASCII(hostname));
	}
	
	constructor(homedir) {
		let me = this;
		me._homedir = homedir;
		let configPath = path.join(homedir, "site.yaml");
		return new Promise((resolve, reject) => {
			fs.readFile(configPath, "utf8", (err, data) => {
				if (err) reject(err); else resolve(data);
			});
		})
		.then(data => {
			me._data = yaml.convert(data);
			fn.publicProperties(me._data, me);
			return me;
		})
		.then(site => {
			return me.loadPageByUri("/").then(page => {
				me._root = page;
				return site;
			});
		});
	}
	
	/**
	 * Загружает страницу.
	 * На выходе страница или null, если страница не найдена.
	 */
	loadPageByUri(uri) {
		return page.loadPageByUri(this, uri);
	}
	
	getNotFoundPage() {
		return this.find(page => page instanceof page.NotFoundPage);
	}
	
	getErrorPage() {
		return this.find(page => page instanceof page.ErrorPage);
	}
	
	filter(page, fn) {
		let me = this;
		if (arguments.length == 1) {
			fn = page;
			page = this.root;
		}
		let result = page.pages.filter(page => fn);
		page.pages.filter(page => page.hasChildPages()).forEach(page => {
			result.concat(me.filter(page, fn));
		});
		return result;
	}
	
	find(fn) {
		return this.filter(fn)[0];
	}
	
}