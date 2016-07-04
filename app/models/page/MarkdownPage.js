
// ВНИМАНИЕ КЛАСС ПОКА НЕ ИСПОЛЬЗУЕТСЯ

/* global Model */

"use strict";

let ini = require("ini");

module.exports = class MarkdownPage extends Model.page.Page {
	
	/**
	 * Разделить текст страницы на две части: 
	 * массив переменных страницы и текст страницы.
	 * @return {Object}
	 * @return {String} .variables 
	 * @return {String} .content 
	 */
	static splitData(text) {	
		let variables = [];
		let content = [];
		text = text.split("\n");
		let isArticle = false;
		text.every(line => {
			if (!isArticle && line.trim() && line.indexOf("=") != -1) {
				variables.push(line);
			} else {
				if (line.trim() || isArticle) {
					isArticle = true;
					content.push(line);
				}
			}
			return true;
		});
		variables = variables.join("\n");
		content = content.join("\n");
		return { variables, content };
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	
	parse(data) {
		let markdown = Model.Page.config.markdown;
		let { variables, content } = MarkdownPage.splitData(data);
		variables = ini.parse(variables);
		variables.content = markdown ? markdown.render(content) : content;
		return variables;
	}
	
};