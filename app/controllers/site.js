
"use strict";

module.exports = (req, res, next) => {
	
	let site = req.app.locals.site;
	
	site.loadPageByUri(req.path)
	
		.then(page => {
			if (page) page.render(res); else next();
		})
		
		.catch(err => {
			next(err);
		});
	
};