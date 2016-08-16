
"use strict";

module.exports = (req, res, next) => {
	
	var err = new Error("Page Controller Not Found");
	err.status = 404;
	next(err);
	
};