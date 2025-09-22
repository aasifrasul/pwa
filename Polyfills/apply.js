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

Function.prototype.myApply =
	Function.prototype.myApply ||
	function myApply(thisArg, args = []) {
		// In strict mode, thisArg is used as-is
		// In non-strict mode, null/undefined becomes globalThis
		const context = thisArg == null ? globalThis : Object(thisArg);
		const uniqueKey = Symbol('fnRef'); // Use Symbol to avoid conflicts
		context[uniqueKey] = this;
		const result = context[uniqueKey](...args);
		delete context[uniqueKey];
		return result;
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function (x, y) {
		console.log(this.a + this.b);
		return x || '' + y || '';
	},
};

var globalContext = getGlobalContext();
var func = obj.func;

globalContext.a = 1;
globalContext.b = 2;

console.log(func()); // prints 3
console.log(func.myApply(obj, [5, 6])); // prints 'Hi, Hello!' and returns 11
console.log(func.myApply(null, [3, 4])); // returns 7 (but abc/xyz are undefined)
