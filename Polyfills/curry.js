function multiply(x, y, z) {
	return x * y * z;
}

function curry(fn) {
	return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.call(this, ...args);
		} else {
			return function (...args2) {
				return curried.call(this, ...args, ...args2);
			};
		}
	};
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // Output: 24
console.log(curriedMultiply(2, 3)(4)); // Output: 24
console.log(curriedMultiply(2)(3, 4)); // Output: 24
