function greet(greeting, msg) {
	return `${greeting}, ${msg}`;
}

function sumABC(A, B, C) {
	return A + B + C;
}

function partial(fn, ...rest) {
	let allParams = rest;
	function func(...params) {
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
