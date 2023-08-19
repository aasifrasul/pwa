function flattenArray(data) {
	const result = [];

	function wrapper(arr) {
		if (Array.isArray(arr)) {
			for (const value of arr) {
				wrapper(value);
			}
		} else {
			result.push(arr);
		}
	}

	wrapper(data);

	return result;
}

flattenArray([1, 2, [5, 6, [9, [10, 11, [67, [78, [101, [102], 103], 56], 89], 12], 8], 7], , 4]);

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

const arr = [1, 2, [5, 6, [9, [10, 11, [67, [78, [101, [102], 103], 56], 89], 12], 8], 7], , 4];
const flattened_arr = [...flatten(arr, Infinity)];
console.log(flattened_arr); // [1,2,3,4,5,6,7,8,9]
