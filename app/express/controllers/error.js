
"use strict";

module.exports = (err, req, res, next) => {
	
	const errorPage = {
		title: err.status == 404 ? "Страница не найдена" : "Ошибка на сервере",
		message: err.status == 404 ? `Страница ${req.path} не найдена.` : err.message,
		error: req.app.get("env") === "development" ? err : {trace: ""}
	};
	
	
	
	res.status(err.status || 500);
	res.send(`
		<html>
			<head><title>${errorPage.title}</title></head>
			<body>
				<h1>${errorPage.title}</h1>
				<p>${errorPage.message}</p>
				<p><pre>${errorPage.error.stack}</pre></p>
			</body>
		</html>
	`);
	
};