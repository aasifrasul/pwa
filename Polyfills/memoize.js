function generateKey(obj) {
	return JSON.stringify(obj);
}

function memoize(fn) {
	const map = new Map();

	function wrapper(...args) {
		const key = generateKey(args);

		map.has(key) ? null : map.set(key, fn.apply(this, args));

		return map.get(key);
	}

	wrapper.clear = () => map.clear();

	return wrapper;
}

function sum(a, b) {
	console.log('Function Invocation sum');
	return a + b;
}

const memoizedSum = memoize(sum);

console.log(memoizedSum(1, 2));
console.log(memoizedSum(1, 2));
console.log(memoizedSum(3, 2));
console.log(memoizedSum(3, 2));
