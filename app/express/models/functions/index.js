
"use strict";

let fs = require("fs");
let _ = require("lodash");

module.exports = {
	findFirstExistingFile, 
	fileExists, 
	publicProperties, 
	page: require("./page")
};

/**
 * Найти первый существующий файл.
 * Возвращает путь к файлу или null.
 */
function findFirstExistingFile(filename) {
	let found = null;
	filename = Array.isArray(filename) ? filename : [filename];
	let files = [];
	filename.forEach(filename => files.push(fileExists(filename)));
	return Promise.all(files).then(result => {
		result.forEach((exists, index) => {
			if (exists && !found) found = filename[index];
		});
		return found;
	});
}

/**
 * Определить, существует ли файл.
 * Если файл не является файлом, то результат = false.
 */
function fileExists(filename) {
	return new Promise((resolve, reject) => {
		fs.stat(filename, (err, stats) => {
			if (err) {
				if (err.code == "ENOENT") {
					resolve(false);
				} else {
					reject(err);
				}
			} else {
				resolve(stats.isFile());
			}
		});
	});
}

/**
 * Публикация свойств объекта в другом объекте.
 * Можно публиковать функции, при этом this устанавливается как ссылка на объект источник.
 * @param {Object} from Объект источник. 
 * @param {Atring[]} from.public Массив с публикуемыми свойствами.
 * @param {Object} [to] Объект, куда публикуются свойства. Если не задан, то to = from.
 */
function publicProperties(from, to) {
	to = to || from;
	if (from.public) {
		from.public.forEach(key => {
			let node = from[key];
			to[key] = _.isFunction(node) ? node.bind(from) : node;
		});
	}
}