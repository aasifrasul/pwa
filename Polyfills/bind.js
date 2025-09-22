// A more robust way to get the global object, if needed.
// For most modern environments, globalThis is preferred.
function getGlobalObject() {
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}
	// Fallback for older environments
	if (typeof self !== 'undefined') {
		return self;
	}
	if (typeof window !== 'undefined') {
		return window;
	}
	if (typeof global !== 'undefined') {
		return global;
	}
	return new Function('return this')();
}

const globalObject = getGlobalObject();

Function.prototype.myBind =
	Function.prototype.myBind ||
	function myBind(thisArg, ...originalArgs) {
		const context = thisArg == null ? globalObject : Object(thisArg);
		const uniqueKey = Symbol('fnRef');
		context[uniqueKey] = this;

		return function (...args) {
			const result = context[uniqueKey](...originalArgs, ...args);
			delete context[uniqueKey];
			return result;
		};
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function (x, y) {
		console.log(this.a + this.b);
		return (x || 0) + (y || 0); // Ensure numeric addition with default values
	},
};

// Fix the binding calls
console.log(func.myBind(obj, 5, 6)()); // Remove array brackets
console.log(func.myBind(null, 3, 4)()); // Remove array brackets
