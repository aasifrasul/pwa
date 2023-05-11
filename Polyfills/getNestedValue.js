const typeCheck = (data, type) =>
	Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type;

const isArray = (data) => typeCheck(data, 'array');
const isObject = (data) => typeCheck(data, 'object');
const isString = (data) => typeCheck(data, 'string');
const isUndefined = (data) => typeCheck(data, 'undefined');
const isNull = (data) => typeCheck(data, 'null');
const isEmpty = (data) => isUndefined(data) || isNull(data) || (isString(data) && data === '');

const getNestedValue = (obj, path) => {
	if (!isObject(obj) || !isString(path)) {
		throw new Error('Please provide valid params');
	}

	const accessorPaths = path.split('.');
	let result = obj;

	/*
	if (isArray(accessorPaths) && accessorPaths.length > 0) {
		for (let value of accessorPaths) {
			if (!isEmpty(value) && isObject(result)) {
				result = result[value];
			}
		}
	}
*/
	return (
		isArray(accessorPaths) &&
		accessorPaths.reduce(
			(accu, value) => (!isEmpty(value) && isObject(accu) ? accu[value] : null),
			{}
		)
	);
};

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

getNestedValue(obj, 'd.z.a3.time');
