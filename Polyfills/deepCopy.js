function clone(obj) {
	const prototype = Object.getPrototypeOf(obj);
	const copy = Object.create(prototype);
	const propNames = Object.getOwnPropertyNames(obj);

	propNames.forEach(function (name) {
		const desc = Object.getOwnPropertyDescriptor(obj, name);
		Object.defineProperty(copy, name, desc);
	});

	return copy;
}

function clone(obj) {
	return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));

// Above are for  are shallow copying

function deepCopy(obj) {
	if (typeof obj === 'undefined' || typeof obj !== 'object' || 'isActiveClone' in obj) {
		return obj;
	}

	let newObj = obj instanceof Date ? new obj.constructor(obj) : obj.constructor();

	Reflect.ownKeys(obj).forEach(key => {
		obj['isActiveClone'] = true;
		newObj[key] = deepCopy(obj[key]);
		delete obj['isActiveClone'];
	});

	return newObj;
}

const obj = {
	a: 1,
	b: 'string',
	c: [1, { m: 1 }, { n: [1, 2, 3, 4] }, { 0: 7 }],
	d: {
		x: 1,
		y: [5, 6, 7, 8],
		z: {
			a1: 1,
			a2: [9, 8, 5],
			a3: {
				time: new Date(),
			},
			[Symbol.toPrimitive]: (hint) => alert('Hi'),
		},
	},
};

deepCopy(obj);
