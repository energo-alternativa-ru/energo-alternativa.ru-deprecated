
"use strict";

const loadPackage = require("load-pkg");
const bootstrap = require("./bootstrap");

new Promise((resolve, reject) => {
	loadPackage((err, pkg) => {
		if (err) reject(err); else resolve(pkg);
	});
})

.then(pkg => {
	const registry = {};
	registry.package = pkg;
	registry.homedir = __dirname;
	registry.env = process.env.NODE_ENV || "development";
	registry.path = {
		express: __dirname + "/express"
	};
	return registry;
})

.then(registry => {
	console.log(registry.package.description);
	console.log("Версия приложения:", registry.package.version);
	return registry;
})

.then(registry => {
	return bootstrap.processBootstrap(registry, {
		onAfter: {
			colors: function() {
				if (registry.env == "development") {
					console.log("Внимание, приложение работает в режиме разработки!".warn);
				}
			}
		}
	});
})

.catch(err => {
	let message = "Фатальная ошибка в приложении:";
	console.error(message.err || message);
	console.error(err.stack);
	process.exit(1);
});