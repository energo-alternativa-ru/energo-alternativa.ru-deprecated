
"use strict";

let pkg = require("load-pkg").sync();
console.log(pkg.description);
console.log("Версия приложения:", pkg.version);

// Зависимости.

let autoload = require("jsymfony-autoload");
let path = require("path");
require("khusamov-nodejs");

//

let program = require("./app/commander");

// Автозагрузка классов.

//autoload.register("Khusamov", path.join(, "lib"));





// Программа.

if (program.config) {
	
	// Конфигурационный файл.
	
	//let config;
	let config = require("./app/config")(program);
	
	// Express.
	
	
	
	let app = require("./app/express")(config);
	
	
	
	
	var port = normalizePort(process.env.PORT || "3000");
	app.set("port", port);
	
	
	
	
	
	require("./app/server")(app.listen(port));
	
	
	
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