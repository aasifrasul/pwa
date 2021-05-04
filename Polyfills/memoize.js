function memoize(fn) {
	if (typeof fn !== 'function') {
		throw new Error('Parameter passed to memoize must be a function');
	}

	const hash = {};
	return function () {
		let key;
		let result;
		const args = Array.prototype.slice.call(arguments);
		console.log(args);
		const item = args[0];
		const itemType = typeof item;
		console.log('itemType', itemType);
		if (itemType === 'undefined') {
			throw new Error("You haven't passed paarameter to ur function");
		}
		if (args.length > 1) {
			// if there are more than one parameters to the memoized function
			// and it is either numbers/strings then it becomes necessary to
			// sort so as to optimize the look up.
			// [1,2,3] and [2,3,1] should create a single key
			// ['a', 'b', 'c'] ['c', 'a', 'b'] similary this too should create one key
			if (itemType === 'string') {
				key = args.sort().toString();
			} else if (itemType === 'number') {
				key = args.sort((a, b) => a - b).toString();
			} else if (itemType === 'function') {
				key = args.toString();
			} else {
				key = JSON.stringify(args);
			}
		} else {
			key = ['string', 'number', 'function'].includes(itemType) ? args.toString() : JSON.stringify(args);
		}
		// This is to make distiction across diff function calls
		key = `${func.name}.${key}`;
		console.log('key', key);
		console.log('hash', hash);
		if (key in hash) {
			console.log('Served from cache');
			result = hash[key];
		} else {
			result = fn.apply(this, args);
			hash[key] = result;
		}

		return result;
	};
}
function memoize(fn) {
	if (typeof fn !== 'function') {
		throw new Error('Parameter passed to memoize must be a function');
	}

	const keyMaps = new Map();
	let map;
	return function () {
		// This is to make distiction across diff function calls
		if (keyMaps.has(fn)) {
			map = keyMaps.get(fn);
		} else {
			map = new Map();
		}

		console.log('keyMaps', keyMaps);

		let args = Array.prototype.slice.call(arguments);
		console.log(args);
		const itemType = typeof args[0];
		console.log('itemType', itemType);
		if (itemType === 'undefined') {
			throw new Error("You haven't passed paarameter to ur function");
		}
		if (args.length > 1) {
			// if there are more than one parameters to the memoized function
			// and it is either numbers/strings then it becomes necessary to
			// sort so as to optimize the look up.
			// [1,2,3] and [2,3,1] should create a single KEY
			// ['a', 'b', 'c'] ['c', 'a', 'b'] similary this too should create one KEY
			if (itemType === 'string') {
				args = args.sort();
			} else if (itemType === 'number') {
				args = args.sort((a, b) => a - b);
			}
		}

		console.log('args', args);
		console.log('map', map);
		console.log('map.get(args)', map.get(args));
		if (map.has(args)) {
			console.log('Served from cache');
		} else {
			map.set(args, fn.apply(this, args));
		}

		keyMaps.set(fn, map);

		return map.get(args);
	};
}
