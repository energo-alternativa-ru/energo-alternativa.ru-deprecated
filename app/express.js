
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
	
	app.set("views", path.join(__dirname, "views"));
	app.set("view engine", "jade");
	
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));
	
	// parse application/json
	app.use(bodyParser.json());
	
	app.use((req, res, next) => {
		console.log(req.method, req.url);
		next();
	});
	
	
	app.use("/", require("./routes/index"));
	
	
	
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error("Not Found");
		err.status = 404;
		next(err);
	});
	
	// development error handler
	// will print stacktrace
	if (app.get("env") === "development") {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render("error", {
				title: "Ошибка",
				message: err.message,
				error: err
			});
		});
	}
	
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			title: "Ошибка",
			message: err.message,
			error: {}
		});
	});
	
	return app;
};