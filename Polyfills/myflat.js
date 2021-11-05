// [1,2,5,6,7,4]

Array.prototype.myFlat = function () {
	const arr = Array.from(this);
	if (!Array.isArray(arr) || arr.length === 0) {
		return [];
	}
	const res = [];
	let item;

	const flatten = function (obj) {
		for (var i = 0; i < obj.length; i++) {
			item = obj[i];
			Array.isArray(item) ? flatten(item) : item && res.push(item);
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
		Array.isArray(item) ? stack.unshift(...item) : resArr.push(item);
	}

	return resArr;
};

console.log(flatDeep([1, 2, [5, 6, [9, [10, 11, [67, [78, [101, [102], 103], 56], 89], 12], 8], 7], , 4]));
