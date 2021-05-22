function getGlobalContext() {
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

Function.prototype.myCall = function myCall(context = globalContext, ...args) {
	context.myCall = this;
	return context.myCall(...args);
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
