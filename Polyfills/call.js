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

Function.prototype.myCall =
	Function.prototype.myCall ||
	function myCall(context = getGlobalContext(), ...args) {
		context.myCall = this;
		const result = context.myCall(...args);
		delete context.myCall;
		return result;
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function () {
		return this.a + this.b;
	},
};

var func = obj.func;

globalContext.a = 1;
globalContext.b = 2;

console.log(func()); // prints 3

console.log(func.myCall(obj)); // prints 'Hi, Hello!'

console.log(func.myCall()); // prints 3
