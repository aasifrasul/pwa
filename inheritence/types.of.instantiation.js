// 1. Object Literal
const literalCar = {
	drive() {
		console.log('Vroom!');
	},
};
console.log(literalCar.drive());

// 2. Object.create() with methods
const carPrototype = {
	drive() {
		console.log('Vroom!');
	},
};
const car4 = Object.create(carPrototype);
console.log(car4.drive());

// 3. Object.assign()
const carTemplate = {
	drive() {
		console.log('Vroom!');
	},
};
const car5 = Object.assign({}, carTemplate);
console.log(car5.drive());

// 4. Mixin Pattern
const driveMixin = {
	drive() {
		console.log('Vroom!');
	},
};
const car6 = Object.assign({}, driveMixin, { color: 'red' });
console.log(car6.drive());

// 5. IIFE (Immediately Invoked Function Expression) Pattern
const car7 = (function () {
	return {
		drive() {
			console.log('Vroom!');
		},
	};
})();
console.log(car7.drive());

// 6. Module Pattern
const CarModule = (function () {
	return {
		createCar() {
			return {
				drive() {
					console.log('Vroom!');
				},
			};
		},
	};
})();
const car8 = CarModule.createCar();
console.log(car8.drive());

// 7. Revealing Module Pattern
const CarRevealingModule = (function () {
	function drive() {
		console.log('Vroom!');
	}

	function createCar() {
		return { drive };
	}

	return { createCar };
})();
const car9 = CarRevealingModule.createCar();
console.log(car9.drive());

// 8. Functional Pattern (Closure-based)
function createFunctionalCar() {
	return {
		drive() {
			console.log('Vroom!');
		},
	};
}
const car10 = createFunctionalCar();
console.log(car10.drive());

// 9. ES6 Object Shorthand with Methods
const makeCar = () => ({
	drive() {
		console.log('Vroom!');
	},
});
const car11 = makeCar();
console.log(car11.drive());

// 10. Proxy Pattern
const carHandler = {
	get(target, prop) {
		if (prop === 'drive') {
			return () => console.log('Vroom!');
		}
		return target[prop];
	},
};
const car12 = new Proxy({}, carHandler);
console.log(car12.drive());

// 11. Symbol-based Factory
const CarSymbol = Symbol('car');
const symbolCarFactory = () => ({
	[CarSymbol]: true,
	drive() {
		console.log('Vroom!');
	},
});
const car13 = symbolCarFactory();
console.log(car13.drive());

// 12. Spread Operator Pattern
const baseCarProps = {
	drive() {
		console.log('Vroom!');
	},
};
const car14 = { ...baseCarProps };
console.log(car14.drive());

// 13. Map-based Object
const CarMap = new Map();
CarMap.set('drive', () => console.log('Vroom!'));
const car15 = Object.fromEntries(CarMap);
console.log(car15.drive());

// 14. WeakMap Pattern (for private properties)
const carPrivates = new WeakMap();
function WeakMapCar() {
	carPrivates.set(this, { secret: 'private data' });
	this.drive = () => console.log('Vroom!');
}
const car16 = new WeakMapCar();
console.log(car16.drive());
