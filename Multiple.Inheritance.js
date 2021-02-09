// Implement multiple inherictance in JS

function applyMixins(derivedCtor, baseCtors) {
	baseCtors.forEach((baseCtor) => {
		const propetyNames = Object.getOwnPropertyNames(baseCtor.prototype);
		console.log(propetyNames);
		propetyNames.forEach((name) => {
			if (name !== 'constructor') {
				const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
				console.log(descriptor);
				Object.defineProperty(derivedCtor.prototype, name, descriptor);
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
