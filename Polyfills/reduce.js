const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const isFunction = (data) => dataType(data) === 'function';
const isUndefined = (data) => dataType(data) === 'undefined';
const isNumber = (data) => dataType(data) === 'number';
const isString = (data) => dataType(data) === 'string';
const isNull = (data) => dataType(data) === 'null';

Array.prototype.myReduce =
	Array.prototype.myReduce ||
	function myReduce(callback, initialValue) {
		if (!isFunction(callback)) {
			throw new Error('callback should be a function');
		}

		const items = Object(this);
		let accumulator = isUndefined(initialValue) ? null : initialValue;

		for (let i = 0; i < items.length; i++) {
			accumulator = isNull(accumulator) ? items[i] : callback.call(this, accumulator, items[i], i, items);
		}

		return accumulator;
	};

[1, 2, 3, 4].myReduce((accumulator, item) => {
	console.log(accumulator);
	return item + accumulator;
});
