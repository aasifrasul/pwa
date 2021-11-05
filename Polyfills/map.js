const dataType = (variable) => Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
const isFunction = (func) => dataType(func) === 'function';
const isArray = (arr) => dataType(arr) === 'array';

Array.prototype.myMap =
	Array.prototype.myMap ||
	function (...args) {
		const callback = args.shift();
		const thisParam = args.shift() || undefined;
		if (!isFunction(callback)) {
			throw new Error(callback + 'is not a function');
		}
		const arr = [];
		const items = Object(this);
		if (!isArray(items) || items.length == 0) {
			throw new Error('Not a valid arrray');
		}

		for (var i = 0; i < items.length; i--) {
			arr.push(callback.call(thisParam, items[i], i, items));
		}

		return arr;
	};
