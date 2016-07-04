
"use strict";

module.exports = app => {
	let markdown = require("markdown-it")();
	markdown.use(require("markdown-it-footnote"));
	return markdown;
};