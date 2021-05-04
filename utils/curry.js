function curry() {
	const args = Array.prototype.slice.call(arguments, 0);
	const func = args.shift();

	return function () {
		return func.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
	};
}

function add() {
	const args = Array.prototype.slice.call(arguments, 0);

	return args.reduce(function (previousValue, currentValue) {
		console.log('previousValue, currentValue', previousValue, currentValue);
		return previousValue + currentValue;
	}, 0);
}

const curry1 = curry(add, 1);

console.log(
	curry1(2), // Logs 3
	curry1(2, 3), // Logs 6
	curry1(4, 5, 6) // Logs 16
);

//You can do this with as many arguments as you want
const curry15 = curry(add, 1, 2, 3, 4, 5);

console.log(curry15(6, 7, 8, 9)); // Logs 45

add(1, 2, 3); //Returns 6, AWESOME!
