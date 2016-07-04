
"use strict";

module.exports = (err, req, res, next) => {
	
	let app = req.app;
	let site = req.app.locals.site;
	
	let errorPage = site.createErrorPage({
		view: err.status == 404 ? "404" : "error",
		title: err.status == 404 ? "Страница не найдена" : "Ошибка на сервере",
		message: err.status == 404 ? `Страница ${req.path} не найдена.` : err.message,
		error: app.get("env") === "development" ? err : {}
	});
	
	res.status(err.status || 500);
	errorPage.render(res);
	
};