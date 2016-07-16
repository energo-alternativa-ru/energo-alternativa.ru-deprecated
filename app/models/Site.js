
/* global Model */

"use strict";

let fs = require("fs");
let path = require("path");
let _ = require("lodash");

module.exports = class Site {
	
	/**
	 * Найти первый существующий файл.
	 * Возвращает путь к файлу или null.
	 */
	static findFirstExistingFile(filename) {
		let found = null;
		filename = Array.isArray(filename) ? filename : [filename];
		let files = [];
		filename.forEach(filename => files.push(Site.fileExists(filename)));
		return Promise.all(files).then(result => {
			result.forEach((exists, index) => {
				if (exists && !found) found = filename[index];
			});
			return found;
		});
	}
	
	/**
	 * Определить, существует ли файл.
	 * Если файл не является файлом, то результат = false.
	 */
	static fileExists(filename) {
		return new Promise((resolve, reject) => {
			fs.stat(filename, (err, stats) => {
				if (err) {
					if (err.code == "ENOENT") {
						resolve(false);
					} else {
						reject(err);
					}
				} else {
					resolve(stats.isFile());
				}
			});
		});
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	
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
	
	constructor(homedir) {
		let me = this, yaml = Model.Site.yaml;
		me._homedir = homedir;
		let configPath = path.join(homedir, "site.yaml");
		return new Promise((resolve, reject) => {
			fs.readFile(configPath, "utf8", (err, data) => {
				if (err) reject(err); else resolve(data);
			});
		})
		.then(data => {
			me._data = yaml.safeLoad(data, {
				schema: yaml.MY_SCHEMA
			});
			me._processDataPublic();
			return me;
		})
		.then(site => {
			return me.loadPageByUri("/").then(page => {
				me._root = page;
				//global._root = page;
				//console.log(me)
				return site;
			});
		});
	}
	
	_processDataPublic() {
		if (this._data.public) {
			this._data.public.forEach(key => {
				let node = this._data[key];
				this[key] = _.isFunction(node) ? node.bind(this._data) : node;
			});
		}
	}
	
	createErrorPage(data) {
		return this.createPage(data, "ErrorPage");
	}
	
	/**
	 * Загружает страницу.
	 * На выходе страница или null, если страница не найдена.
	 */
	loadPageByUri(uri) {
		let me = this;
		
		//console.log("loadPageByUri", uri)
		
		//me._loadedPages = me._loadedPages ? me._loadedPages : {};
		//if (me._loadedPages[uri]) return Promise.resolve(me._loadedPages[uri]);
		
		
		
		
		
		return Site.findFirstExistingFile([
			path.join(me.pagesdir, `${uri}.yaml`),
			path.join(me.pagesdir, uri, "index.yaml")
		])
		.then(filename => {
			
			//console.log('Site.findFirstExistingFile===',filename)
			
			return filename ? me.loadPage(filename) : null;
			
		})
		/*.then(page => {
			me._loadedPages[uri] = page;
			return page;
		})*/;
	}
	
	loadPage(filename) {
		let me = this;
		
		//console.log('loadPage===',filename)
		
		return new Model.page.YamlPage(me, filename).then(page => {
			return me.preparePage(page);
		});
	}
	
	createPage(filename, type) {
		let me = this, Page = Model.page[type || "Page"];
		let page = new Page(me, filename);
		return me.preparePage(page);
	}
	
	preparePage(page) {
		//let me = this;
		//page.site = me;
		
		//console.log('preparePage===',page)
		
		return page;
	}
	
};