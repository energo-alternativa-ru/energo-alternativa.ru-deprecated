
"use strict";

let markdown = require("markdown-it")();
markdown.use(require("markdown-it-footnote"));

module.exports = markdown;