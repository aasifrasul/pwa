// Implement multiple inherictance in JS

// 1. Run a loop on baseClasses array
// 2. fetch all the property names of that derived class and run a loop on them
// 3. derive the descriptor of poperty
// 4  Define a property with the descriptor on the protoype of the base class.
function applyMixins(derivedClass, baseClases) {
	baseClases.forEach((baseClass) => {
		const propetyNames = Object.getOwnPropertyNames(baseClass.prototype);
		console.log(propetyNames);
		propetyNames.forEach((name) => {
			if (name !== 'constructor') {
				const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
				console.log(descriptor);
				Object.defineProperty(derivedClass.prototype, name, descriptor);
			}
		});
	});
}

//The parent classes
class A {
	methodA() {
		console.log('A');
	}
}

class B {
	methodB() {
		console.log('B');
	}
}

//The child class
class C {}

//Using mixins
applyMixins(C, [A, B]);
let o = new C();
o.methodA();
o.methodB();
