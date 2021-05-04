function mySetInterval() {
	const context = this;
	const args = Array.prototype.slice.call(arguments);

	const callback = args.shift();
	const delay = args.shift();

	function invoke() {
		mySetInterval.timeoutId = window.setTimeout(() => {
			callback.apply(context, args);
			invoke();
		}, delay);
	}

	invoke();
	return mySetInterval.timeoutId;
}

mySetInterval.cancel = function () {
	window.clearTimeout(mySetInterval.timeoutId);
};
function add(a, b) {
	console.log(a + b);
}
var mySetIntervalId = mySetInterval(add, 1000, 3, 5);

setTimeout(() => mySetInterval.cancel(), 5000);
