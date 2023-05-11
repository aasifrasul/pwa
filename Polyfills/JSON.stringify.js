const typeCheck = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const isFunction = (data) => typeCheck(data) === 'function';
const isArray = (data) => typeCheck(data) === 'array';
const isObject = (data) => typeCheck(data) === 'object';
const isNull = (data) => typeCheck(data) === 'null';
const isUndefined = (data) => typeCheck(data) === 'undefined';
const isNumber = (data) => typeCheck(data) === 'number';
const isString = (data) => typeCheck(data) === 'string';
const isBoolean = (data) => typeCheck(data) === 'boolean';
const isSymbol = (data) => typeCheck(data) === 'symbol';
const isDate = (data) => typeCheck(data) === 'date';
const isEmpty = (data) => isUndefined(data) || isNull(data) || data === '';

function stringify(obj) {
	const dataType = typeChechk(obj);

	switch(dataType) {
		case 'string':
			return `"${obj}"`;
		case 'undefined':
			return String(null);
		case 'null':
		case 'boolean':
		case 'number':
		case 'function':
			return String(obj);
		case 'date':
			return `"${obj.toString()}"`;
		case 'array':
			var result = [];
			for (let value of obj) {
				result.push(stringify(value));
			}
			return `[${result.join(',')}]`;
		case 'object':
			var result = [];
			Object.keys(obj).map(key => {
				const strKey = typeChechk(key) === 'symbol' ? key.toString() : key;
				result.push(`"${strKey}":${stringify(obj[key])}`);
			});
			return `{${result.join(',')}}`;
		default:
			return String(null);
	}
}

function stringify(obj, replacer, space) {
	if (isString(obj)) {
		return '"' + obj + '"';
	} else if (isUndefined(obj)) {
		return String(null);
	} else if (isNull(obj) || isNumber(obj) || isBoolean(obj) || isFunction(obj)) {
		return String(obj);
	} else if (isDate(obj)) {
		return "'" + obj.toString() + "'";
	} else if (isArray(obj)) {
		const resultArray = obj.map((item) => stringify(item, replacer, space));
		return '[' + resultArray.join(',') + ']';
	} else if (isObject(obj)) {
		const result = [];
		Reflect.ownKeys(obj).forEach((key) => {
			const stringifiedKey = isSymbol(key) ? key.toString() : key;
			if (replacer) {
				const replacement = replacer(key, obj[key]);
				if (!isEmpty(replacement)) {
					result.push(
						'"' + stringifiedKey + '":' + stringify(replacement, replacer, space)
					);
				}
			} else {
				result.push(
					'"' + stringifiedKey + '":' + stringify(obj[key], replacer, space)
				);
			}
		});
		if (space) {
			return '{\n' + result.join(',\n') + '\n' + Array(space + 1).join(' ') + '}';
		} else {
			return '{' + result.join(',') + '}';
		}
	}
}

const obj = {
	a: 1,
	b: 'string',
	c: [true, { m: 1 }, { n: [1, , null, 4] }, { 0: 7 }],
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

stringify(obj);
JSON.parse(stringify(obj));
