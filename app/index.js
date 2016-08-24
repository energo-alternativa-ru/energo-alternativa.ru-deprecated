
"use strict";

const path = require("path");
const express = require("express");
require("express-resource");

const app = express();

app.locals.pretty = true;
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views");

app.locals.models = require("./models")(__dirname + "/data");

app.use(express.static(path.join(__dirname, "static")));
app.use("/jquery", express.static(path.join(path.dirname(require.resolve("jquery/package.json")), "dist")));
app.use("/bootstrap", express.static(path.join(path.dirname(require.resolve("bootstrap/package.json")), "dist")));
app.use("/bootstrap/theme", express.static(path.join(path.dirname(require.resolve("bootswatch/package.json")), "united")));
app.use("/startbootstrap", express.static(__dirname + "/../temp/startbootstrap-agency-gh-pages"));

// https://startbootstrap.com/


var api = express();
api.resource("alternativa-data", require("./api/alternativaData"));
app.use("/api", api);


app.use((req, res, next) => {
	req.site = req.app.locals.models.get("site");
	next();
});


app.locals.models.get("site").getPageMap().forEach(page => {
	const handler = require(path.join(__dirname, "controllers", page.controller));
	app.get(page.path, (req, res, next) => { req.page = page; next(); }, handler);
});

app.use(require(path.join(__dirname, "controllers", "404")));
app.use(require(path.join(__dirname, "controllers", "500")));

app.listen(8080, function() {
	console.log("Приложение запущено на порту 8080!");
});