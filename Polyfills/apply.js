function getGlobalContext() {
	if (typeof global !== 'object' || !global || global.Math !== Math || global.Array !== Array) {
		return getGlobal();
	}
	return global;
}

function getGlobal() {
	if (typeof self !== 'undefined') {
		return self;
	} else if (typeof window !== 'undefined') {
		return window;
	} else if (typeof global !== 'undefined') {
		return global;
	} else {
		return new Function('return this')();
	}
}

var globalContext = getGlobalContext();

Function.prototype.myApply =
	Function.prototype.myApply ||
	function myApply(context = globalContext, args = []) {
		context.myApply = this;
		context.myApply(...args);
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function (x, y) {
		console.log(this.a + this.b);
		return x || '' + y || '';
	},
};

var func = obj.func;

globalContext.a = 1;
globalContext.b = 2;

console.log(func()); // prints 3

console.log(func.myApply(obj, [5, 6])); // prints 'Hi, Hello!'

console.log(func.myApply([3, 4])); // prints 3
