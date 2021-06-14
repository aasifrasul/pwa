function greet(greeting, msg) {
	return `${greeting}, ${msg}`;
}

function sumABC(A, B, C) {
	return A + B + C;
}

function partial(fn, ...rest) {
	// need a var to collect all the params passed to the function
	// so that a decision an be made whether to retutn he computed value
	// (if the paramaters match with expcted params of the func)
	// or if the passed params is still less than the expected params
	// then retutn the function so that additional params cab accepted
	let allParams = rest;
	function func(...params) {
		// In addition to accumulate the params, it also serves to clean off
		// the empty params.
		allParams = [...allParams, ...params];
		return fn.length <= allParams.length ? fn(...allParams) : func;
	}
	return func();
}

// function partial(fn, ...rest) {
// 	if (fn.length <= 1) return fn;
// 	let allParams = rest;
// 	const generator = (...args) => {
// 		allParams = [...allParams, ...args];
// 		if (fn.length <= allParams.length) {
// 			return fn(...allParams);
// 		} else {
// 			return generator;
// 		}
// 	};
// 	return generator();
// }

console.log(partial(greet, 'Hello')('There')); // Hello There
console.log(partial(greet, 'Hello', 'There')); // Hello There
console.log(partial(greet, 'Hello', 'There', 'some random')); // Hello There
console.log(partial(sumABC, 1)(1, 2, 3)); // 4
console.log(partial(sumABC)(1, 2, 3)); // 6
console.log(partial(sumABC)(1)(2)(3)); // 6
console.log(partial(sumABC)(1)()()(2)()(3)); // 6
console.log(partial(sumABC)(1, 2)()()(2)); // 5
