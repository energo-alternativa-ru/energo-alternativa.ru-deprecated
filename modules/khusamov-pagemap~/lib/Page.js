
"use strict";

const path = require("path");

module.exports = class Page {
	
	constructor(map, route = "/", parent = null) {
		this._map = map;
		this._route = route;
		this._parent = parent;
		this._config = this.getConfig(map);
		this._childs = this.getChildItems(map);
	}
	
	get isRoot() {
		return !this._parent;
	}
	
	get parent() {
		return this._parent;
	}
	
	get route() {
		return this.parent ? path.join(this.parent.route, this._route) : this._route;
	}
	
	get title() {
		return this._config.title;
	}
	
	get controller() {
		return this.getInheritConfigItem("controller");
	}
	
	get view() {
		return this.getInheritConfigItem("view");
	}
	
	getPageMap() {
		var routeMap = [];
		routeMap.push({
			route: this.route,
			method: "get",
			controller: this.controller
		});
		this._childs.map(child => {
			routeMap.concat(child.getRouteMap());
		});
		return routeMap;
	}
	
	getInheritConfigItem(name) {
		return this._config[name] ? this._config[name] : (this._parent ? this._parent[name] : null);
	}
	
	getConfig(map) {
		var config = {};
		for (let key in map) {
			if (key[0] != "/") {
				config[key[0]] = map[key];
			}
		}
		return config;
	}
	
	getChildItems(map) {
		var childs = [];
		for (let key in map) {
			if (key[0] == "/") {
				childs.push(new SitemapItem(map[key], key, this));
			}
		}
		return childs;
	}
	
};