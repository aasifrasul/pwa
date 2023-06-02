(function() {
	let counter = 0;
	const hashmap = {};

	function repeat(context, intervalId, func, delay, args) {
		counter in hashmap && clearTimeout(hashmap[intervalId]);
		hashmap[counter] = setTimeout(() => {
			func.apply(context, args);
			repeat(context, intervalId, func, delay, args)
		}, delay);
	}

	window.setIntervalPolyfill = function (func, delay, ...args) {
		counter++;
		repeat(this, counter, func, delay, args);
		return counter;
	};

	window.clearIntervalPolyfill = function (intervalId) {
		if (hashmap[intervalId]) {
			clearTimeout(hashmap[intervalId]);
			delete hashmap[intervalId];
		}
	};
}());

const multiply = (a, b) => console.log('(a * b) =>', a * b);

const intervalId = setIntervalPolyfill(multiply, 150, 4, 5);

setTimeout(() => clearIntervalPolyfill(intervalId), 1000);
