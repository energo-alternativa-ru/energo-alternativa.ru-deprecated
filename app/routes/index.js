
"use strict";

let path = require("path");
let express = require("express");

module.exports = app => {
	let router = express.Router();
	router.get("*", require(path.join(app.get("controllers"), "site")));
	return router;
};