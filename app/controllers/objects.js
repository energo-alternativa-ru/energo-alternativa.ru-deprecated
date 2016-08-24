
"use strict";

module.exports = (req, res) => {
	
	
	
	
	
	res.render(req.page.view, {
		req: req,
		page: req.page,
		site: req.site
	});
	
};