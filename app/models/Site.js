
"use strict";

const markdown = require("markdown-it")();
markdown.use(require("markdown-it-footnote"));
markdown.use(require("markdown-it-container"), "jumbotron");

const fs = require("fs");
const path = require("path");
const Page = require("./Page");

module.exports = class Site extends Page {
	
	constructor(homedir) {
		const map = require(path.join(homedir, "site.json"));
		super(map);
		this._homedir = homedir;
	}
	
	get contacts() {
		return this.getData("/company/contacts");
	}
	
	get created() {
		return new Date("2011-07-19");
	}
	
	get copyright() {
		return this._config.copyright;
	}
	
	get phone() {
		const contacts = this.getData("/company/contacts");
		return contacts.phones[0];
	}
	
	getData(uri) {
		return require(path.join(this._homedir, uri));
	}
	
	getMdData(uri) {
		const md = fs.readFileSync(path.join(this._homedir, uri), "utf8");
		return markdown.render(md);
	}
	
};