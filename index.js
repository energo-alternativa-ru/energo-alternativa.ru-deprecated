
/* global Model */

"use strict";

let pkg = require("load-pkg").sync();
console.log(pkg.description);
console.log("Версия приложения:", pkg.version);

// Зависимости.

require("khusamov-nodejs");
let autoload = require("jsymfony-autoload");
let path = require("path");

// Программа.

let program = require("./app/commander");

if (program.config) {
	
	Promise.resolve()
	
	.then(none => {
		// Конфигурационный файл.
		return require("./app/config")(program);
	})
	
	.then(config => {
		// Express.
		let app = require("./app/express")(config);
		app.locals.markdown = require("./app/markdown")(app);
		app.locals.yaml = require("./app/yaml")(app);
		
		
		
		return app;
	})
	
	.then(app => {
		// Модели.
		autoload.register("Model", path.join(__dirname, "app/models"));
		
		Model.page.YamlPage.markdown = app.locals.markdown;
		Model.page.YamlPage.yaml = app.locals.yaml;
		Model.Site.yaml = app.locals.yaml;
		
		
		
		/*app.locals.models = {
			Site: Model.Site.init({
				configPath: path.join(__dirname, "app/site.yaml")
			}),
			Page: Model.Page.init({
				//path: path.join(__dirname, "app/pages"),
				markdown: require("./app/markdown")
			})
		};*/
		//app.locals.site = new Model.Site(path.join(__dirname, "app/site"));
		return (
			new Model.Site(path.join(__dirname, "app/site"))
			.then(site => {
				app.locals.site = site;
				return app;
			})
		);
	})
	
	.then(app => {
		// Сервер.
		var port = normalizePort(process.env.PORT || "3000");
		require("./app/server")(app.listen(port));
	})
	
	.catch(err => {
		console.log(err);
	});
	
	

}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	
	if (port >= 0) {
		// port number
		return port;
	}
	
	return false;
}