
"use strict";

const Site = require("./Site");

module.exports = (datadir) => {

	const models = {
		site: new Site(datadir)
	};
	
	return {
		get(model) {
			return models[model];
		}
	};
	
};