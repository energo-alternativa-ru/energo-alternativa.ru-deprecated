
"use strict";

const path = require("path");

module.exports = {processBootstrap};

/**
 * Обработка блока начальной загрузки приложения.
 * Возвращает промис с реестром.
 * @param listeners.onAfter Объект с обработчиками событий после обработки этапов начальной загрузки.
 * @return Promise
 */
function processBootstrap(registry, listeners) {
	listeners = listeners || { onAfter: {} };
	let bootstrap = Promise.resolve();
	["colors", "markdown", "yaml", "commander", "config", "express", "server"].forEach(name => {
		bootstrap = bootstrap.then(none => {
			let result = require(path.join(registry.homedir, "bootstrap", name))(registry);
			if (listeners.onAfter[name]) listeners.onAfter[name].call();
			return (result instanceof Promise ? result : Promise.resolve(result)).then(result => {
				if (result) registry[name] = result;
				return;
			});
		});
	});
	return bootstrap.then(none => registry);
}