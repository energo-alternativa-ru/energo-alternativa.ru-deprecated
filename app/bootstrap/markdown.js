
"use strict";

module.exports = registry => {
	let markdown = require("markdown-it")();
	markdown.use(require("markdown-it-footnote"));
	return markdown;
};