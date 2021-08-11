const checkDataType = (data, type) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type;

const isFunction = (data) => checkDataType(data, 'function');
const isArray = (data) => checkDataType(data, 'array');
const isObject = (data) => checkDataType(data, 'object');
const isNull = (data) => checkDataType(data, 'null');
const isUndefined = (data) => checkDataType(data, 'undefined');
const isNumber = (data) => checkDataType(data, 'number');
const isString = (data) => checkDataType(data, 'string');
const isBoolean = (data) => checkDataType(data, 'boolean');

const getArrayCount = (arr) => isArray(arr) && arr.length;

const safeExecFunc = (...params) => {
	const func = params.shift();
	const context = params.shift();
	if (!isFunction(func)) {
		return null;
	}

	if (isObject(context) && isFunction(context[func.name])) {
		return func.apply(context, params)
	}

	return func(...params);
};

module.exports = {
	isFunction,
	isArray,
	isObject,
	isNull,
	isUndefined,
	isNumber,
	isString,
	isBoolean,
	getArrayCount,
	safeExecFunc,
};
