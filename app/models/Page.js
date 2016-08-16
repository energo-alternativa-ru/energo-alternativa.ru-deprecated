
"use strict";

const path = require("path");

module.exports = class Page {
	
	constructor(map, path = "/", parent = null) {
		this._map = typeof map == "object" ? map : require(map);
		this._path = path;
		this._parent = parent;
		this._config = this.getConfig(map);
		this._childs = this.getChildItems(map);
	}
	
	get level() {
		let level = 0;
		
		let parent = this.parent;
		
		while (parent) {
			parent = parent.parent;
			level++;
		}
		
		return level;
		
	}
	
	get ancestors() {
		
		const result = [];
		
		let parent = this.parent;
		
		while (parent) {
			result.push(parent);
			parent = parent.parent;
		}
		
		return result.reverse();
		
	}
	
	get pages() {
		return this._childs;
	}
	
	get isRoot() {
		return !this._parent;
	}
	
	get root() {
		return this.isRoot ? this : (this.parent.isRoot ? this.parent : this.parent.root);
	}
	
	get parent() {
		return this._parent;
	}
	
	get path() {
		return this.parent ? path.join(this.parent.path, this._path) : this._path;
	}
	
	get href() {
		// path может содержать параметры пути, например :param
		// href это уже готовый, к выводу в ссылках, адрес страницы
		return this.path;
	}
	
	get title() {
		return this._config.title;
	}
	
	get icon() {
		const hasIcons = this.parent ? this.parent.isGroup ? true : this.parent.pages.map(page => page._config.icon).reduce((a, b) => a || b) : false;
		return this._config.icon || (this.level == 1 ? null : (hasIcons ? "space" : null));
	}
	
	get isDivider() {
		return this._config.divider;
	}
	
	get isGroup() {
		return this._config.isGroup;
	}
	
	get h1() {
		return this._config.h1 || this.title;
	}
	
	get controller() {
		return this.getInheritConfigItem("controller");
	}
	
	get model() {
		return this.getInheritConfigItem("model");
	}
	
	get view() {
		return this.getInheritConfigItem("view");
	}
	
	getPageMap() {
		var map = [];
		map.push(this);
		this.pages.forEach(page => {
			map = map.concat(page.getPageMap());
		});
		return map;
	}
	
	getInheritConfigItem(name) {
		return this._config[name] ? this._config[name] : (this._parent ? this._parent[name] : null);
	}
	
	getConfig(map) {
		var config = {};
		for (let key in map) {
			if (key[0] != "/") {
				config[key] = map[key];
			}
		}
		return config;
	}
	
	getChildItems(map) {
		var childs = [];
		for (let key in map) {
			if (key[0] == "/") {
				const Model = require(path.join(__dirname, map[key].model || this.model));
				childs.push(new Model(map[key], key, this));
			}
		}
		return childs;
	}
	
};