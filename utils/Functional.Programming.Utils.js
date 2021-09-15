const tap = curry((fn, x) => {
	fn(x);
	return x;
});

const trace = (label) => {
	return tap((x) => console.log(`== ${label}:  ${x}`));
};

const trace = (label) => (value) => {
	console.log(`${label}: ${value}`);
	return value;
};

// pipe(...fns: [...Function]) => x => y
const pipe =
	(...fns) =>
	(x) =>
		fns.reduce((y, f) => f(y), x);

const compose =
	(...fns) =>
	(x) =>
		fns.reduceRight((v, f) => f(v), x);

const compose = (...fns) =>
	fns.reduce(
		(f, g) =>
			(...args) =>
				f(g(...args))
	);

const map = (fn, arr) => arr.reduce((acc, item, index, arr) => acc.concat(fn(item, index, arr)), []);

const filter = (fn, arr) => arr.reduce((newArr, item) => (fn(item) ? newArr.concat([item]) : newArr), []);

const mapToObj = (map) => {
	const obj = {};
	map.forEach((key, value) => (obj[key] = value));
	return obj;
};

const objToMap = (obj) => {
	const map = new Map();
	Object.keys(obj).forEach((key) => map.set(key, obj[key]));
	return map;
};

// Auto-curry
const curry =
	(f, arr = []) =>
	(...args) =>
		((a) => (a.length === f.length ? f(...a) : curry(f, a)))([...arr, ...args]);

const myReducer = (state = {}, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case 'FOO':
			return Object.assign({}, state, payload);
		default:
			return state;
	}
};

// Generic Filter
const filter = (fn, arr) => reduce((acc, curr) => (fn(curr) ? acc.concat([curr]) : acc), [], arr);

const Identity = (value) => ({
	map: (fn) => Identity(fn(value)),
	valueOf: () => value,
	toString: () => `Identity(${value})`,
	[Symbol.iterator]: function* () {
		yield value;
	},
	constructor: Identity,
});

Object.assign(Identity, {
	toString: () => 'Identity',
	is: (x) => typeof x.map === 'function',
});

const fRange = (start, end) =>
	Array.from(
		{
			length: end - start + 1,
		},
		// change `Identity` to `start.constructor`
		(x, i) => start.constructor(i + start)
	);

const exists = (x) => x.valueOf() !== undefined && x.valueOf() !== null;

const ifExists = (x) => ({
	map: (fn) => (exists(x) ? x.map(fn) : x),
});
