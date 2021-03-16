const idx = require('idx');

const getArrayCount = (arr) => idx(arr, (_) => _.length) || 0;

const buildNestedWithParentId = (arr) => {
	const nestedStructure = Object.create(null);
	const categories = Object.create(null);
	let elem;

	for (var i = 0; i < arr.length; i++) {
		elem = arr[i];

		if (elem.parent_objective_id) {
			const parentElem = nestedStructure[elem.parent_objective_id];
			if (!parentElem) {
				continue;
			}
			if (!parentElem.children) {
				parentElem.children = [];
			}
			parentElem.children.push(elem);
		} else {
			nestedStructure[elem.id] = elem;
			categories[elem.category] = elem.category;
		}
	}

	return {nestedStructure, categories};
}

module.exports = {
	getArrayCount,
	buildNestedWithParentId,
};
