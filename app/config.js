
"use strict";

/* global Khusamov */

let fs = require("fs");
let path = require("path");

let defaultConfigFilename = path.join(__dirname, "config.ini");

module.exports = (program) => {
	let defaultConfig = Khusamov.Config.load(defaultConfigFilename);
	let config = {};
	
	// Опция config может иметь значение temp для отладки.
	// В этом случае конфиг берется из папки temp.
	program.config = program.config.toLowerCase() == "temp" ? 
		path.join(process.cwd(), "temp", "config.ini") : 
		program.config;
	
	
	try {
		fs.accessSync(program.config);
	} catch (err) {
		new Khusamov.Config({}).save(program.config);
	}
	config = Khusamov.Config.load(program.config);
	
	config = new Khusamov.Config().merge(defaultConfig).merge(config);
	return config;
};