function copyObject(obj) {
	const prototype = Object.getPrototypeOf(obj);
	const copy = Object.create(prototype);
	const propNames = Object.getOwnPropertyNames(obj);

	propNames.forEach(function (name) {
		const desc = Object.getOwnPropertyDescriptor(obj, name);
		Object.defineProperty(copy, name, desc);
	});

	return copy;
}

function cloneDeep(obj) {
	return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));

// Above are for  are shallow copying

function deepClone(obj) {
	const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

	if (type !== 'object') {
		return obj;
	}

	if (type === 'date') {
		return new Date(obj);
	}

	let newObj = type === 'array' ? [] : {};

	for (let prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			newObj[prop] = deepClone(obj[prop]);
		}
	}

	return newObj;
}

// For circular depdency

function deepClone(obj, map = new WeakMap()) {
	const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

	if (type !== 'object') {
		return obj;
	}

	if (type === 'date') {
		return new Date(obj);
	}

	if (map.has(obj)) {
		return map.get(obj);
	}

	let newObj = Array.isArray(obj) ? [] : {};

	map.set(obj, newObj);

	for (let prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			newObj[prop] = deepClone(obj[prop], map);
		}
	}

	return newObj;
}

var obj = {
	a: 1,
	b: 'string',
	c: [1, 2, 3, 4],
	d: {
		x: 1,
		y: [5, 6, 7, 8],
		z: {
			a1: 1,
			a2: [9, 8, 5],
			a3: {
				time: new Date(),
			},
		},
	},
};

deepClone(obj);
