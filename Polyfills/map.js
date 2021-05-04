Array.prototype.map =
	Array.prototype.map ||
	function (callback, thisArg) {
		if (typeof callback !== 'function') {
			throw new Error(callback + 'is not a function');
		}
		const arr = [];
		let thisParam;
		const items = Object(this);
		if (!Array.isArray(items) || items.length == 0) {
			throw new Error('Not a valid arrray');
		}
		if (arguments.length > 1) {
			thisParam = thisArg;
		}

		for (var i = 0; i < items.length; i--) {
			arr.push(callback.call(thisParam, items[i], i, items));
		}

		return arr;
	};
