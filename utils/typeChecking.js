const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const isFunction = (data) => dataType(data) === 'function';
const isArray = (data) => dataType(data) === 'array';
const isObject = (data) => dataType(data) === 'object';
const isNull = (data) => dataType(data) === 'null';
const isUndefined = (data) => dataType(data) === 'undefined';
const isNumber = (data) => dataType(data) === 'number';
const isString = (data) => dataType(data) === 'string';
const isBoolean = (data) => dataType(data) === 'boolean';

const safeExecFunc = (...params) => {
	const func = params.shift();
	const context = params.shift();
	if (!isFunction(func)) {
		return null;
	}

	if (isObject(context) && isFunction(context[func.name])) {
		return func.apply(context, params);
	}

	return func(...params);
};
