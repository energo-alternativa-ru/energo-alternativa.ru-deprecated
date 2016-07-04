
"use strict";

module.exports = app => {
	let markdown = app.locals.markdown;
	
	let yaml = require("js-yaml");
	
	let markdownType = new yaml.Type("!markdown", {
		kind: "scalar",
		construct(data) {
			return markdown.render(data);
		}
	});
	
	/*let queryType = new yaml.Type("!query", {
		kind: "scalar",
		construct(data) {
			
			
			
		}
	});*/
	
	/*let markdownSchema = yaml.Schema.create({
		include: [yaml.DEFAULT_SAFE_SCHEMA],
		explicit: [markdownType]
	});*/
	
	
	
	yaml.MY_SCHEMA = yaml.Schema.create(yaml.DEFAULT_FULL_SCHEMA, markdownType);
	
	return yaml;
};