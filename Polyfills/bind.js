// bind Polyfill
Function.prototype.myBind =
	Function.prototype.myBind ||
	function (context, ...args) {
		context.myBind = this;
		return function () {
			context.myBind(...args);
		};
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function () {
		return this.a + this.b;
	},
};

var func = obj.func;

console.log(func.myBind(obj)()); // prints 'Hi, Hello!'
