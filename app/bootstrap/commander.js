
"use strict";

const commander = require("commander");

module.exports = registry => {
	
	commander
		.version(registry.package.version)
		.usage("[options]")
		.option("-c, --config [file]", "Путь к конфигурационному файлу.")
		.parse(process.argv);
	
	// Если конфиг не задан и окружение не разработка, 
	// то показать справку по командной строки и завершить работу приложения.
	if (!commander.config && registry.env != "development") commander.help();
	
	return commander;
};