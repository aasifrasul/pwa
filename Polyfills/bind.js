// bind Polyfill
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

Function.prototype.myBind =
	Function.prototype.myBind ||
	function (context = getGlobalContext(), ...args) {
		context.myBind = this;
		return function () {
			return context.myBind(...args);
		};
	};

var obj = {
	a: 'Hi, ',
	b: 'There!',
	func: function func() {
		console.log('In func');
		return this.a + this.b;
	},
};

var func = obj.func;
console.log('func', func);
var boundedFunc = func.myBind(obj);
console.log('boundedFunc', boundedFunc);

console.log(boundedFunc()); // prints 'Hi, There!'
