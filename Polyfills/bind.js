// bind Polyfill
Function.prototype.bind =
	Function.prototype.bind ||
	function (context) {
		const self = this;
		return function () {
			self.apply(context, Array.prototype.slice.call(arguments));
		};
	};
