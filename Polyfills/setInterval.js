function mySetInterval() {
	const context = this;
	const args = Array.prototype.slice.call(arguments);

	const callback = args.shift();
	const delay = args.shift();

	function invoke() {
		mySetInterval.intervalId = window.setTimeout(() => {
			callback.apply(context, args);
			invoke();
		}, delay);
	}

	invoke();
	return mySetInterval.intervalId;
}

mySetInterval.cancel = function () {
	window.clearTimeout(mySetInterval.intervalId);
};

function add(a, b) {
	console.log(a + b);
}

var mySetIntervalId = mySetInterval(add, 1000, 3, 5);

setTimeout(() => mySetInterval.cancel(), 5000);

// Implement setInterval using nested setTimeout
let timerId = setTimeout(function tick() {
	alert('tick');
	timerId = setTimeout(tick, 2000); // (*)
}, 2000);
