/*
What new Foo() does ?
It creates a new blank object.
It makes `this` to point to this newly created object inside the constructor function
It sets the prototype of the newly created object to the constructor function's prototype.
It makes the constructor function return the newly created object IF it is not returning anything.
*/

function Foo(p1, p2, p3) {
	console.log(p1, p2, p3);
}

var createInstance = function (func, ...args) {
	var obj = new func(...args);
	return obj;
};

var func1Ins = createInstance(Foo, 10, 20, 30);

// 10,20,30

function Foo(p1, p2, p3) {
	console.log(p1, p2, p3);
}

function MyConstructor(func, ...args) {
	var obj = Object.create(func.prototype);
	func.apply(obj, args);
	return obj;
}

var instance1 = MyConstructor(Foo, 10, 20, 30);

console.log(instance1);

// target = Foo
var createInstance = function (func, ...args) {
	var newFunc = new Proxy(func, {
		apply(target, thisArg, argumentsList) {
			console.log('target', target);
			console.log('thisArg', thisArg);
			console.log('argumentsList', argumentsList);
			target(...argumentsList);
		},
	});
	console.log(newFunc);
	newFunc(...args);
};

createInstance(Foo, 1, 2, 3);
