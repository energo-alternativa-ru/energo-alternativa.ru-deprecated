
"use strict";

let ini = require("ini");
let fs = require("fs");
let path = require("path");
let express = require("express");
let router = module.exports = express.Router();

// https://www.npmjs.com/package/markdown-it
// markdown надо перенести в app.locals и настройки все вынести в отдельный файл /app/markdown.js 
let markdown = require("markdown-it")();
markdown.use(require("markdown-it-footnote"));


router.get("*", (req, res, next) => {
	
	
	
	
	let indexMd = path.join(__dirname, "..", "pages", req.path, "index.md");
	
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