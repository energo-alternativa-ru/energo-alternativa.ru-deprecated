
"use strict";

/**
 * Настройка приложения Express.
 */

let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");

module.exports = config => {
	let app = express();
	app.locals.config = config;
	
	app.set("controllers", path.join(__dirname, "controllers"));
	app.set("views", path.join(__dirname, "views"));
	app.set("view engine", "jade");
	app.locals.pretty = true;
	
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));
	
	// parse application/json
	app.use(bodyParser.json());
	
	app.use(require("./controllers/log"));
	
	/*app.use((req, res, next) => {
		console.log(req.method, req.url);
		next();
	});*/
	
	
	app.use("/", require("./routes/index")(app));
	
	
	
	
	
	app.use(require("./controllers/404"));
	app.use(require("./controllers/error"));
	
	// catch 404 and forward to error handler
	/*app.use(function(req, res, next) {
		var err = new Error("Not Found");
		err.status = 404;
		next(err);
	});*/
	/*app.use(function(err, req, res, next) {
		
		let site = req.app.locals.site;
		
		let errorPage = site.createErrorPage({
			title: "Ошибка",
			message: err.message,
			error: app.get("env") === "development" ? err : {}
		});
		
		res.status(err.status || 500);
		res.render("error", {page: errorPage});
	});*/
	
	
	
	return app;
};