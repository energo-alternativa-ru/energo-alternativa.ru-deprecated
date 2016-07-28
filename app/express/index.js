
"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");


const models = require("./models");

module.exports = ({registry, homedir}) => {
	
	models.init({
		yaml: registry.yaml
	});
	
	const siteModel = models.getSiteModel();
	
	return getMultiSiteMiddleware(homedir, siteModel).then(multiSiteMiddleware => {
		const app = express();
		app.locals.registry = registry;
		app.locals.config = registry.config;
		
		app.set("views", homedir);
		app.set("view engine", "jade");
		app.locals.pretty = true;
		
		
		
		app.use(multiSiteMiddleware);
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		
		app.use(require(path.join(__dirname, "controllers/log")));
		app.get("*", require(path.join(__dirname, "controllers/site")));
		app.use(require(path.join(__dirname, "controllers/404")));
		app.use(require(path.join(__dirname, "controllers/error")));
		
		return app;
	});
};

/**
 * Получить посредника, обеспечивающего функцию мультисайтинга.
 */
function getMultiSiteMiddleware(homedir, siteModel) {
	return getListDirs(homedir).then(dirnames => {
		// Список сайтов и список сайтов, ассоциированных со своими хостами.
		const sites = [], hostnameSites = {};
		dirnames.forEach(siteHomedir => {
			siteHomedir = path.join(homedir, siteHomedir);
			sites.push(siteModel.createSite(siteHomedir).then(site => {
				site.hostnames.forEach(hostname => {
					if (hostnameSites[hostname]) throw Error(`Повтор доменного имени ${hostname}.`);
					hostnameSites[hostname] = site;
				});
				return site;
			}));
		});
		return Promise.all(sites).then(sites => hostnameSites);
	})
	.then(hostnameSites => {
		return (req, res, next) => {
			req.site = hostnameSites[req.hostname];
			if (!req.site) return next(new Error(`Сайт с доменным именем ${req.hostname} не найден.`));
			next();
		};
	});
}

/**
 * Получить список директорий.
 * @param {String} dirname Путь к папке, список директорий которой запрашивается.
 * @return {Promise} В промисе возвращается список директорий. 
 */
function getListDirs(dirname) {
	return readdirPromise(dirname).then(filenames => {
		filenames = filenames.map(filename => {
			return statPromise(path.join(dirname, filename)).then(stats => {
				return stats.isDirectory() ? filename : null;
			});
		});
		return Promise.all(filenames).then(filenames => {
			return filenames.filter(filename => filename);
		});
	});
}

function readdirPromise(dirname) {
	return new Promise((resolve, reject) => {
		fs.readdir(dirname, (err, filenames) => {
			if (err) reject(err); else resolve(filenames);
		});
	});
}

function statPromise(filename) {
	return new Promise((resolve, reject) => {
		fs.stat(filename, (err, stats) => {
			if (err) reject(err); else resolve(stats);
		});
	});
}