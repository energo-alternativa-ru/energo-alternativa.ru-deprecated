
"use strict";

let ini = require("ini");
let fs = require("fs");
let path = require("path");
let express = require("express");

let router = module.exports = express.Router();



router.get("*", (req, res, next) => {
	
	let markdown = req.app.locals.markdown;
	
	let pathToPages = path.join(__dirname, "..", "pages");
	
	
	let indexMd = path.join(pathToPages, req.path, "index.md");
	
	let ok;
	
	try {
		ok = true;
		// TODO Переписать эту хрень через Promise
		fs.accessSync(indexMd);
	} catch (err) {
		ok = false;
		next();
	}
	
	
	
	
	
	
	
	
	
	if (ok) {
		indexMd = fs.readFileSync(indexMd, "utf8");
		
		
		let vars = [];
		let article = [];
		indexMd = indexMd.split("\n");
		let isArticle = false;
		indexMd.every(line => {
			if (!isArticle && line.trim() && line.indexOf("=") != -1) {
				vars.push(line);
			} else {
				if (line.trim() || isArticle) {
					isArticle = true;
					article.push(line);
				}
			}
			return true;
		});
		vars = vars.join("\n");
		article = article.join("\n");
		
		
		
		
		
		vars = ini.parse(vars);
		article = markdown.render(article);
		
		vars.article = article;
		
		res.render("index", vars);
		
		
	}

	

});