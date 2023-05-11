const { setIntervalPollyfill, clearIntervalPollyfill } = (function () {
	let uniqueInvocationCount = 0;
	let intervalMap = {};

	function setIntervalPollyfill(callback, delay = 0, ...args) {
		let id = ++uniqueInvocationCount;

		function repeat() {
			intervalMap[id] && clearTimeout(id);
			intervalMap[id] = setTimeout(() => {
				callback(...args);
				intervalMap[id] && repeat();
			}, delay);
		}

		repeat();
		return id;
	}

	function clearIntervalPollyfill(intervalid) {
		clearTimeout(intervalMap[intervalid]);
		delete intervalMap[intervalid];
	}
	return {
		setIntervalPollyfill,
		clearIntervalPollyfill,
	};
})();


function add(a, b) {
	console.log(`${a}+${b} =>`, a + b);
}

const intervalid = setIntervalPollyfill(add, 200, 2, 3);
setTimeout(() => clearIntervalPollyfill(intervalid), 1000);

