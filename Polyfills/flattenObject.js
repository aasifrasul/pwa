const typeCheck = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isObject = (data) => typeCheck(data) === 'object';
const isArray = (data) => typeCheck(data) === 'array';

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

function flattenObject(obj, result = {}) {
	if (isObject(obj)) {
		Reflect.ownKeys(obj).forEach((key) => {
			const item = obj[key];
			if (isArray(item)) {
				result[key] = item.map((value) => flattenObject(value, result));
			} else if (isObject(item)) {
				flattenObject(item, result);
			} else {
				result[key] = item;
			}
		});
	}
	return result;
}

flattenObject(obj);
