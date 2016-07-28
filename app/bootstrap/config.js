
"use strict";

const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const defaultConfigFilename = path.join(__dirname, "config.yaml");

module.exports = registry => {
	
	const commander = registry.commander;
	const yaml = registry.yaml;
	
	const readYamlFileSync = filename => {
		return yaml.convert(fs.readFileSync(filename, "utf8"));
	};
	
	const writeYamlFileSync = (filename, data = "") => {
		fs.writeFileSync(filename, data, "utf8");
	};
	
	const fileExists = filename => {
		try {
			fs.accessSync(filename);
			return true;
		} catch (err) {
			return false;
		}
	};
	
	// Загрузить конфиг со значениями по умолчанию.
	let defaultConfig = readYamlFileSync(defaultConfigFilename);
	
	// Если окружение разработка и не задан конфиг, то вычислить путь к тестовому конфигу.
	if (registry.env == "development" && !commander.config) {
		commander.config = path.join(registry.homedir, "..", "example/config.yaml");
	}
	
	// Если рабочего конфига нет, то создать пустой.
	if (!fileExists(commander.config)) writeYamlFileSync(commander.config);
	
	// Загрузить рабочий конфиг.
	let config = readYamlFileSync(commander.config);
	
	// Слить рабочий конфиг со значениями по умолчанию.
	config = _.merge({}, defaultConfig, config);
	
	return config;
};