
/* global Model */

"use strict";

let fs = require("fs");
let path = require("path");
let _ = require("lodash");

module.exports = class YamlPage extends Model.page.Page {
	
	get homedir() {
		return path.dirname(this._filename);
	}
	
	get pages() {
		return this._pages;
	}
	
	constructor(site, filename) {
		return new Promise((resolve, reject) => {
			fs.readFile(filename, "utf8", (err, data) => {
				if (err) reject(err); else resolve(data);
			});
		})
		.then(data => {
			let yaml = Model.page.YamlPage.yaml;
			return yaml.safeLoad(data, {
				schema: yaml.MY_SCHEMA
			});
		})
		.then(data => {
			super(site, data);
			this._filename = filename;
			return this._includeProcess(this);
		})
		/*.then(page => {
			return this._loadChildPages().then(pages => {
				this._pages = pages;
				return page;
			});
		})*/;
	}
	
	hasChildPages() {
		return path.basename(this._filename, path.extname(this._filename)) == "index";
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	
	_loadChildPages() {
		let me = this;
		if (!me.hasChildPages()) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.readdir(me.homedir, (err, files) => {
				if (err) reject(err); else resolve(files);
			});
		})
		.then(files => {
			let uriChildPages = [];
			files.forEach(filename => {
				if (path.basename(filename, path.extname(filename)) != "index") {
					let fullname = path.join(me.homedir, filename);
					uriChildPages.push(new Promise((resolve, reject) => {
						fs.stat(fullname, (err, stats) => {
							if (err) reject(err); else resolve(stats.isDirectory());
						});
					})
					.then(isDirectory => {
						let uri = fullname.replace(me.site.pagesdir, "");
						if (isDirectory) return uri;
						return path.format({
							dir: path.dirname(uri),
							base: path.basename(uri, path.extname(uri, path.extname(uri)))
						});
					}));
				}
			});
			return Promise.all(uriChildPages);
		})
		.then(uriChildPages => {
			let pages = [];
			uriChildPages.forEach(uri => {
				pages.push(me.site.loadPageByUri(uri));
			});
			return Promise.all(pages);
		});
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	
	_includeProcess(node) {
		let me = this, result = [];
		for (let key in node) {
			switch (typeof(node[key])) {
				case "object":
					result.push(me._includeProcess(node[key]));
					break;
				case "string":
					if (node[key].trim().indexOf("include") == 0) {
						result.push(me._getNodeFromPage(node[key]).then(includedNode => {
							node[key] = includedNode;
						}));
					}
					break;
			}
		}
		return Promise.all(result).then(r => node);
	}
	
	_getNodeFromPage(includeString) {
		let me = this, site = me.site;
		let {uri, path, params} = me._parseIncludeString(includeString);
		return site.loadPageByUri(uri).then(page => {
			if (!page) return null;
			let node = me._getNodeByPath(page.data, path);
			return me._filterNode(node, params);
		});
	}
	
	_getNodeByPath(node, path) {
		if (!path) return node;
		path.split(".").forEach(key => node = node[key]);
		return node;
	}
	
	_parseIncludeString(includeString) {
		let params = includeString.replace("include", "").split(",").map(s => s.trim());
		let [uri, path] = params.shift().split("#");
		return {uri, path, params};
	}
	
	_filterNode(node, params) {
		return this[`_filter${this._getTypeNode(node)}Node`].call(this, node, params);
	}
	
	_getTypeNode(node) {
		return _.upperFirst(_.isArray(node) ? "array" : typeof(node));
	}
	
	_filterArrayNode(node, params) {
		let me = this;
		params.forEach(func => {
			let params = func.split(" ");
			let funcname = params.shift();
			let method = `_filterArray${_.upperFirst(funcname)}`;
			if (!_.isFunction(me[method])) throw new Error(`Not found function '${funcname}'.`);
			node = me[method].call(me, node, params);
		});
		return node;
	}
	
	_filterArrayLimit(arr, params) {
		return _.filter(arr, (item, index) => index <= arr.length - params);
	}
	
	_filterArraySort(arr, params) {
		let [field, order] = params;
		return _.orderBy(arr, [field], [order || "desc"]);
	}
	
	_filterArrayLast(arr, params) {
		return _.filter(arr, (item, index) => index > arr.length - 1 - params);
	}
	
	_filterObjectNode(node, params) {
		return node;
	}
	
	_filterStringNode(node, params) {
		return node;
	}
	
	_filterNumberNode(node, params) {
		return node;
	}
	
	_filterBooleanNode(node, params) {
		return node;
	}
	
	_filterUndefinedNode(node, params) {
		return node;
	}
	
	_filterFunctionNode(node, params) {
		return node;
	}
	
};