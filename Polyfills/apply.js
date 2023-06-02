const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const isFunction = (data) => dataType(data) === 'function';
const isArray = (data) => dataType(data) === 'array';
const isObject = (data) => dataType(data) === 'object';
const isUndefined = (data) => dataType(data) === 'undefined';

function getGlobalContext() {
	if (isUndefined(global) || !isObject(global) || global.Math !== Math || global.Array !== Array) {
		return getGlobal();
	}
	return global;
}

function getGlobal() {
	if (!isUndefined(self)) {
		return self;
	} else if (!isUndefined(window)) {
		return window;
	} else if (!isUndefined(global)) {
		return global;
	} else {
		return new Function('return this')();
	}
}

Function.prototype.myApply =
	Function.prototype.myApply ||
	function myApply(context = getGlobalContext(), args = []) {
		context.myApply = this;
		const result = context.myApply(...args);
		delete context.myApply;
		return result;
	};

Function.prototype.myApply = function (obj, args = []) {
	if (!isFunction(this)) {
		throw new TypeError('Attempt to call apply on non-function');
	}
	if (!isObject(obj) && !isFunction(obj)) {
		throw new TypeError('Function.prototype.apply: Arguments list has wrong type');
	}
	if (!isArray(args)) {
		throw new TypeError('CreateListFromArrayLike called on non-object');
	}

	obj.fnRef = this;
	const result = obj.fnRef(...args);
	delete obj.fnRef;
	return result;
};

var obj = {
	a: 'Hi, ',
	b: 'Hello!',
	func: function (x, y) {
		console.log(this.a + this.b);
		return x || '' + y || '';
	},
};

var globalContext = getGlobalContext();
var func = obj.func;

globalContext.a = 1;
globalContext.b = 2;

console.log(func()); // prints 3

console.log(func.myApply(obj, [5, 6])); // prints 'Hi, Hello!'

console.log(func.myApply([3, 4])); // prints 3
