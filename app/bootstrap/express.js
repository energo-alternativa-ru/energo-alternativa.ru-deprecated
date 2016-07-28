
"use strict";

const path = require("path");

module.exports = registry => {
	
	return require(registry.path.express)({
		registry,
		homedir: path.dirname(registry.commander.config)
	});
};