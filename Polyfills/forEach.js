// foreach
Array.prototype.forEach =
	Array.prototype.forEach ||
	function (callback, thisArg) {
		var arr = this;
		for (var i = 0; i < arr.length; i++) {
			callback.call(thisArg, arr[i], i, arr);
		}
	};
