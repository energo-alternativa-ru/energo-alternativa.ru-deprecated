
"use strict";

let yaml;



/**
 * Инициализация модуля моделей приложения.
 */
exports.init = config => {
	yaml = config.yaml;
};

/**
 * Получить модуль обработки YAML-файлов.
 */
exports.getYaml = () => {
	return yaml;
};

/**
 * Получить модель сайта.
 */
exports.getSiteModel = () => {
	return require("./site");
};

/**
 * Получить модель страницы сайта.
 */
exports.getPageModel = () => {
	return require("./page");
};