
"use strict";

module.exports = (req, res, next) => {
	
	const site = req.site;
	
	site.loadPageByUri(req.path)
	
	.then(page => {
		page = page ? page : site.getNotFoundPage();
		if (page) page.render(req, res); else next();
	})
	
	.catch(err => {
		const page = site.getErrorPage(err);
		if (page) page.render(req, res); else next(err);
	});
	
};