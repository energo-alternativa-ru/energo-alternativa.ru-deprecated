
"use strict";

module.exports = (req, res) => {
	
	const news = req.site.getData("/company/news");
	
	const sortByDate = (a, b) => {
		return b.date - a.date;
	};
	
	const prepareDate = item => {
		item.date = new Date(item.date);
		return item;
	};
	
	const years = [];
	const _years = {};
	news.map(prepareDate).forEach(item => {
		const year = item.date.getFullYear();
		_years[year] = _years[year] || [];
		_years[year].push(item);
	});
	for (let year in _years) {
		years.push({
			value: year,
			news: _years[year].sort(sortByDate)
		});
	}
	
	
	
	res.render(req.page.view, {
		req: req,
		page: req.page,
		site: req.site,
		years: years.sort((a, b) => b.value - a.value)
	});
	
};