
"use strict";

let _ = require("lodash");

module.exports = {processIncludes};

function processIncludes(node, site) {
	let result = [];
	for (let key in node) {
		switch (typeof(node[key])) {
			case "object":
				result.push(processIncludes(node[key], site));
				break;
			case "string":
				if (nodeHasInclude(node[key])) {
					result.push(processInclude(node[key], site).then(includedNode => {
						node[key] = includedNode;
					}));
				}
				break;
		}
	}
	return Promise.all(result).then(result => node);
}

function nodeHasInclude(node) {
	return node.trim().indexOf("include") == 0;
}

function processInclude(includeString, site) {
	let {uri, path, params} = parseIncludeString(includeString);
	return site.loadPageByUri(uri).then(page => {
		if (!page) return null;
		let node = getNodeByPath(page.data, path);
		return filterNode(node, params);
	});
}

function getNodeByPath(node, path) {
	if (path) path.split(".").forEach(key => node = node[key]);
	return node;
}

function parseIncludeString(includeString) {
	let params = includeString.replace("include", "").split(",").map(s => s.trim());
	let [uri, path] = params.shift().split("#");
	return {uri, path, params};
}

function filterNode(node, params) {
	return filters[`filter${getTypeNode(node)}Node`].call(this, node, params);
}

function getTypeNode(node) {
	return _.upperFirst(_.isArray(node) ? "array" : typeof(node));
}

const filters = {
	
	filterArrayNode(node, params) {
		params.forEach(func => {
			let params = func.split(" ");
			let funcname = params.shift();
			let method = `filterArray${_.upperFirst(funcname)}`;
			if (!_.isFunction(filters[method])) throw new Error(`Not found filter function '${funcname}'.`);
			node = filters[method].call(filters, node, params);
		});
		return node;
	},
	
	filterArrayLimit(arr, params) {
		return _.filter(arr, (item, index) => index <= arr.length - params);
	},
	
	filterArraySort(arr, params) {
		let [field, order] = params;
		return _.orderBy(arr, [field], [order || "desc"]);
	},
	
	filterArrayLast(arr, params) {
		return _.filter(arr, (item, index) => index > arr.length - 1 - params);
	},
	
	filterObjectNode(node, params) {
		return node;
	},
	
	filterStringNode(node, params) {
		return node;
	},
	
	filterNumberNode(node, params) {
		return node;
	},
	
	filterBooleanNode(node, params) {
		return node;
	},
	
	filterUndefinedNode(node, params) {
		return node;
	},
	
	filterFunctionNode(node, params) {
		return node;
	}
	
};

