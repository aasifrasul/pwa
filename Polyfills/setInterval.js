const { setIntervalPolyfill, clearIntervalPolyfill } = (function () {
	let counter = 0;
	const hashmap = {};

	function repeat(intervalId, func, delay, args) {
		hashmap[counter] = setTimeout(() => {
			if (intervalId in hashmap) {
				clearTimeout(hashmap[intervalId]);
				func.apply(null, args);
				repeat(intervalId, func, delay, args);
			}
		}, delay);
	}

	const setIntervalPolyfill = function (func, delay, ...args) {
		counter++;

		if (typeof func === 'function') {
			repeat(counter, func, delay, args);
		} else {
			eval(func);
		}

		return counter;
	};

	const clearIntervalPolyfill = function (intervalId) {
		if (intervalId in hashmap) {
			clearTimeout(hashmap[intervalId]);
			delete hashmap[intervalId];
		}
	};

	return {
		setIntervalPolyfill,
		clearIntervalPolyfill,
	};
})();

const multiply = (a, b) => console.log('(a * b) =>', a * b);

const intervalId = setIntervalPolyfill(multiply, 150, 4, 5);

setTimeout(() => clearIntervalPolyfill(intervalId), 1000);
