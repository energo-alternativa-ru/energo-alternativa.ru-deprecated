
"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const models = require("./index");
const fn = require("./functions");





const yaml = models.getYaml();

const pageModel = module.exports = {};

/**
 * Массив загруженных страниц.
 */
const loadedPages = {};

/**
 * Загрузить страницу по ее адресу.
 * На выходе страница или null, если страница не найдена.
 * @param {String} uri Строка вида '/path/to/page' без конечного слеша.
 * @param {String} pagesdir
 * @return {Promise} {Page} page
 */
pageModel.loadPageByUri = (site, uri) => {
	return (
		Promise.resolve(loadedPages[uri])
		.then(page => {
			return page ? page : fn.findFirstExistingFile([
				path.join(site.pagesdir, `${uri}.yaml`),
				path.join(site.pagesdir, uri, "index.yaml")
			])
			.then(filename => {
				return filename ? pageModel.createPage(site, filename, uri) : null;
			})
			.then(page => {
				loadedPages[uri] = page;
				return page;
			});
		})
	);
};

pageModel.createPage = (site, filename, uri) => {
	switch (uri) {
		case "/error": return new pageModel.ErrorPage(site, filename);
		case "/error/not-found": return new pageModel.NotFoundPage(site, filename);
		default: return new pageModel.Page(site, filename);
	}
};

/**
 * Класс страницы сайта.
 */
pageModel.Page = class Page {
	
	get site() {
		return this._site;
	}
	
	set site(site) {
		this._site = site;
	}
	
	get view() {
		return path.join(this.site.id, "views", "page", this._data.view || "index");
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
	
	get visible() {
		return "visible" in this._data ? this._data.visible : true;
	}
	
	get href() {
		if (this.isRoot()) return "/";
		if (this.hasChildPages()) return path.dirname(this._filename.replace(this.site.pagesdir, ""));
		return this.parent ? path.join(this.parent.href, this.name) : path.join("/", this.name);
	}
	
	get homedir() {
		return path.dirname(this._filename);
	}
	
	get pages() {
		return this._pages;
	}
	
	get name() {
		return path.basename(this._filename, path.extname(this._filename));
	}
	
	get parent() {
		return this._parent;
	}
	
	set parent(page) {
		this._parent = page;
	}
	
	constructor(site, filename) {
		return new Promise((resolve, reject) => {
			fs.readFile(filename, "utf8", (err, data) => {
				if (err) reject(err); else resolve(data);
			});
		})
		.then(data => {
			return yaml.convert(data);
		})
		.then(data => {
			this._site = site;
			this._data = data;
			this._filename = filename;
			this._pages = [];
			return fn.page.processIncludes(data, site).then(data => {
				fn.publicProperties(this._data, this);
				return this;
			});
		})
		.then(page => {
			return fn.page.loadChildPages(this).then(pages => {
				this._pages = pages;
				return page;
			});
		});
	}
	
	hasChildPages() {
		return !!this.pages.length;
	}
	
	isRoot() {
		return path.dirname(this._filename.replace(this.site.pagesdir, "")) == "/";
	}
	
	render(req, res) {
		res.render(this.view, {
			req: req,
			page: this,
			site: this.site
		});
	}
	
};

/**
 * Класс страницы "Не найдена страница".
 */

pageModel.NotFoundPage = class NotFoundPage extends pageModel.Page {
	
	get view() {
		return path.join(this.site.id, "views", this._data.view || "not-found");
	}
	
};

/**
 * Класс страницы "Ошибка на сайте".
 */

pageModel.ErrorPage = class ErrorPage extends pageModel.Page {
	
	get view() {
		return path.join(this.site.id, "views", this._data.view || "error");
	}
	
	get message() {
		return this._data.message;
	}
	
	get error() {
		return this._data.error;
	}
	
};