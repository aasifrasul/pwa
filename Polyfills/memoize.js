function memoize(func) {
	const hashMap = new Map();

	function wrapper(...args) {
		const self = this;
		let result;
		const key = JSON.stringify(args);

		const localhash = hashMap.get(func.name) || new Map();
		console.log('localhash', localhash);
		if (localhash.has(key)) {
			console.log('InCache');
			result = localhash.get(key);
		} else {
			console.log('Computing');
			result = func.apply(self, args);
			localhash.set(key, result);
		}

		hashMap.set(func.name, localhash);

		return result;
	}

	wrapper.cancel = function () {
		hashMap.set(func.name, new Map());
	};

	wrapper.getHashMap = function () {
		return hashMap;
	};

	return wrapper;
}

function sum(a, b) {
	return a + b;
}

var memoizedSum = memoize(sum);

memoizedSum(1, 2);
memoizedSum(1, 2);
memoizedSum(3, 2);
memoizedSum(1, 2);

function compare(obj1, obj2) {
	return obj1.a > obj2.a;
}

var memoizedCompare = memoize(compare);

memoizedCompare({ a: 1 }, { a: 1 });
memoizedCompare({ a: 1 }, { a: 1 });
memoizedCompare({ a: 2 }, { a: 2 });
memoizedCompare({ a: 2 }, { a: 2 });
