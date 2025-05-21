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

// Above are for shallow copying

function deepCopy(obj) {
	const dataType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

	switch (dataType) {
		case 'undefined':
		case 'null':
		case 'string':
		case 'boolean':
		case 'number':
		case 'function':
		case 'regexp':
			return obj;
		case 'date':
			return new obj.constructor(obj);
		case 'object':
			if ('isActiveClone' in obj) {
				return obj;
			}
		case 'array':
			const newObj = obj.constructor();

			Reflect.ownKeys(obj).forEach((key) => {
				obj['isActiveClone'] = true;
				newObj[key] = deepCopy(obj[key]);
				delete obj['isActiveClone'];
			});

			return newObj;
		default:
			return obj;
	}
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
