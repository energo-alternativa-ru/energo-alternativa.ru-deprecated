
"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

module.exports = {
	loadChildPages, 
	processIncludes: require("./include").processIncludes
};

/**
 * Загрузить дочерние страницы.
 */
function loadChildPages(page) {
	let childPages = [], site = page.site;
	if (page.name != "index") return Promise.resolve(childPages);
	return new Promise((resolve, reject) => {
		fs.readdir(page.homedir, (err, files) => {
			if (err) reject(err); else resolve(files);
		});
	})
	.then(files => {
		let childPageUri = [];
		files.forEach(filename => {
			if (path.basename(filename, path.extname(filename)) != "index") {
				let fullname = path.join(page.homedir, filename);
				childPageUri.push(new Promise((resolve, reject) => {
					fs.stat(fullname, (err, stats) => {
						if (err) reject(err); else resolve(stats.isDirectory());
					});
				})
				.then(isDirectory => {
					let uri = fullname.replace(site.pagesdir, "");
					if (isDirectory) return uri;
					return path.format({
						dir: path.dirname(uri),
						base: path.basename(uri, path.extname(uri, path.extname(uri)))
					});
				}));
			}
		});
		return Promise.all(childPageUri);
	})
	.then(childPageUri => {
		childPageUri.forEach(uri => {
			childPages.push(site.loadPageByUri(uri));
		});
		return Promise.all(childPages);
	})
	.then(childPages => {
		childPages.forEach(childPage => childPage.parent = page);
		return childPages;
	});
}
