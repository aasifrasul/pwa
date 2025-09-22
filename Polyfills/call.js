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

// Polyfill for myCall if it doesn't exist
Function.prototype.myCall =
	Function.prototype.myCall ||
	function myCall(thisArg, ...args) {
		// In strict mode, thisArg is used as-is.
		// In non-strict mode, null/undefined becomes globalThis.
		const context = thisArg == null ? globalObject : Object(thisArg); // Use globalObject here
		const uniqueKey = Symbol('fnRef'); // Use Symbol to avoid conflicts
		context[uniqueKey] = this; // 'this' refers to the function being called
		const result = context[uniqueKey](...args);
		delete context[uniqueKey];
		return result;
	};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function () {
		return this.a + this.b;
	},
};

var func = obj.func; // `func` is now a reference to the function, losing its original `this` context

// Set properties on the actual global object for testing func() without myCall
globalObject.a = 1;
globalObject.b = 2;

console.log('--- Original Function Call ---');
// When func() is called directly, 'this' refers to the global object.
// globalObject.a (1) + globalObject.b (2) results in 3.
console.log(`func(): ${func()}`); // Expected: 3 (1 + 2)

console.log('\n--- myCall with obj ---');
// Calling func.myCall(obj) sets 'this' to 'obj', so it uses obj.a and obj.b.
console.log(`func.myCall(obj): ${func.myCall(obj)}`); // Expected: 'Hi, Hello!'

console.log('\n--- myCall with null/undefined (global context) ---');
// Calling func.myCall() (or func.myCall(null)/func.myCall(undefined))
// sets 'this' to the global object (globalObject.a and globalObject.b).
console.log(`func.myCall(): ${func.myCall()}`); // Expected: 3 (1 + 2)

// Clean up global object properties after testing if necessary
delete globalObject.a;
delete globalObject.b;
