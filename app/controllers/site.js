
"use strict";

module.exports = (req, res, next) => {
	
	let site = req.app.locals.site;
	
	console.log("controller site", req.path)
	
	site.loadPageByUri(req.path)
	
		.then(page => {
			
			console.log("controller site / site.loadPageByUri")
			
			if (page) page.render(res); else next();
		})
		
		.catch(err => {
			next(err);
		});
	
};