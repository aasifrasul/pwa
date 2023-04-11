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

function* flatten(array, depth) {
	if (depth === undefined) {
		depth = 1;
	}
	for (const item of array) {
		if (Array.isArray(item) && depth > 0) {
			yield* flatten(item, depth - 1);
		} else {
			yield item;
		}
	}
}

const arr = [1, 2, 3, 4, 5, [6, [7, 8, 9]]];
const flattened_arr = [...flatten(arr, Infinity)];
console.log(flattened_arr); // [1,2,3,4,5,6,7,8,9]
