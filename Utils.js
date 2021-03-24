function throttled(delay, fn) {
	let lastCall = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		return fn(...args);
	};
}

function debounced(delay, fn) {
	let timerId;
	return function (...args) {
		timerId && clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn(...args);
			timerId = null;
		}, delay);
	};
}

(function () {
	const throttle = (func, limit) => {
		let lastFunc;
		let lastRan;
		return function () {
			const context = this;
			const args = arguments;
			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function () {
					if (Date.now() - lastRan >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		};
	};
})();

function slow(x) {
	// there can be a heavy CPU-intensive job here
	console.info(`Called with ${x}`);
	return x;
}

const cachingDecorator = (func) => {
	let cache = new Map();

	return function (x) {
		const key = `${func.name}.${x}`;
		if (cache.has(key)) {
			// if the result is in the map
			return cache.get(key); // return it
		}

		// const result = func(x); // otherwise call func
		// const result = func.call(this, x); // otherwise call func
		// const result = func.call(context, ...args); // pass an array as list with spread operator
		const result = func.apply(context, args); // is same as using apply

		cache.set(key, result); // and cache (remember) the result
		return result;
	};
};

slow = cachingDecorator(slow);
/*
console.info(slow(1)); // slow(1) is cached
console.info('Again: ' + slow(1)); // the same

console.info(slow(2)); // slow(2) is cached
console.info('Again: ' + slow(2)); // the same as the previous line
*/

const isRequired = () => {
	throw new Error('param is required');
};
const print = (num = isRequired()) => {
	console.log(`printing ${num}`);
};
print(2); //printing 2
print(); // error
print(null); //printing null

// Execute a function only once
const executeOnce = function executeOnce(func) {
	var result;
	var executed = false;
	return function () {
		if (!executed) {
			result = func.apply(this, arguments);
			executed = true;
		}
		return result;
	};
};

const memoize = function memoize(func) {
	var result = {};

	return function () {
		var args = Array.prototype.slice.call(arguments);
		if (args in result) {
			return result[args];
		} else {
			return (result[args] = func.apply(this, args));
		}
	};
};
