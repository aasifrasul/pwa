// bind Polyfill

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

Function.prototype.myBind =
	Function.prototype.myBind ||
	function (context = getGlobalContext(), ...args) {
		context.myBind = this;
		return function () {
			return context.myBind(...args);
		};
	};

var obj = {
	a: 'Hi, ',
	b: 'There!',
	func: function func() {
		console.log('In func');
		return this.a + this.b;
	},
};

var func = obj.func;
console.log('func', func);
var boundedFunc = func.myBind(obj);
console.log('boundedFunc', boundedFunc);

console.log(boundedFunc()); // prints 'Hi, There!'
