
"use strict";

module.exports = (req, res) => {
	
	const news = req.site.getData("/company/news");
	const contacts = req.site.getData("/company/contacts");
	const article = req.site.getMdData("/index.md");
	
	const sortByDate = (a, b) => {
		return b.date - a.date;
	};
	
	const prepareDate = item => {
		item.date = new Date(item.date);
		return item;
	};
	
	const latestNews = news.map(prepareDate).sort(sortByDate).filter((item, index) => index < 3);
	
	res.render(req.page.view, {
		req: req,
		page: req.page,
		site: req.site,
		news: latestNews,
		contacts,
		article
	});
	
};