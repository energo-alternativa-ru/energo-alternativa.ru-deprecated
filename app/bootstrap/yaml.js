
"use strict";

const yaml = require("js-yaml");

module.exports = registry => {
	const markdown = registry.markdown;
	
	const markdownType = new yaml.Type("!markdown", {
		kind: "scalar",
		construct(data) {
			return markdown.render(data);
		}
	});
	
	yaml.MY_SCHEMA = yaml.Schema.create(yaml.DEFAULT_FULL_SCHEMA, markdownType);
	
	yaml.mySafeLoad = data => {
		return yaml.safeLoad(data, {
			schema: yaml.MY_SCHEMA
		});
	};
	
	yaml.convert = yaml.mySafeLoad;
	
	return yaml;
};