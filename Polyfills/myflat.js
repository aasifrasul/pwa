// [1,2,5,6,7,4]

Array.prototype.myFlat = function () {
	const arr = Array.from(this);
	if (!Array.isArray(arr) || arr.length === 0) {
		return [];
	}
	const res = [];
	let temp;

	const flatten = function (obj) {
		for (var i = 0; i < obj.length; i++) {
			temp = obj[i];
			debugger;
			if (Array.isArray(temp)) {
				flatten(temp);
			} else {
				temp && res.push(temp);
			}
		}
	};

	flatten(arr);

	return res;
};

const flatDeep = function (arr) {
	let stack = [...arr],
		item;
	const resArr = [];

	while (stack.length) {
		item = stack.shift();
		console.log('item', item);
		if (Array.isArray(item)) {
			stack.unshift(...item);
		} else {
			item && resArr.push(item);
		}
	}

	return resArr;
};

console.log(flatDeep([1, 2, [5, 6, [9, [10, 11, [67, [78, [101, [102], 103], 56], 89], 12], 8], 7], , 4]));
