
"use strict";

const e = require("escape-html");

module.exports = (err, req, res, next) => {
	
	const page = {
		title: err.status == 404 ? "Страница не найдена" : "Ошибка на сервере",
		message: err.status == 404 ? `Страница ${req.path} не найдена.` : err.stack.indexOf(err.message) == -1 ? err.message : null,
		stack: req.app.get("env") === "development" ? err.stack : null
	};
	
	if (err.status != 404) console.error(err.stack);
	
	res.status(err.status || 500);
	res.send(`
		<html>
			<head>
				<title>${e(page.title)}</title>
				<style>
					body {
						padding: 20px;
						color: white;
						background-color: black;
						background-image: url(http://f12.ifotki.info/org/5f183f842726c25f6d013db986610181bc8627140577301.jpg);
						background-image: url(http://www.1366x768.net/large/201206/10165.jpg);
						background-position: right bottom;
						background-repeat: no-repeat;
						background-size: cover;
					}
				</style>
			</head>
			<body>
				<h1>${e(page.title)}</h1>
				${page.message ? `<p>${e(page.message)}</p>` : ""}
				${page.stack ? `<p><pre>${e(page.stack)}</pre></p>` : ""}
			</body>
		</html>
	`);
	
};