Array.prototype.myFilter =
	Array.prototype.myFilter ||
	function myFilter(callback, thisParam) {
		const items = Object(this);
		const result = [];
		let returnResult;

		for (let i = 0; i < items.length; i++) {
			returnResult = callback.call(thisParam, items[i], i, items);

			if (returnResult) {
				result.push(items[i]);
			}
		}

		return result;
	};
