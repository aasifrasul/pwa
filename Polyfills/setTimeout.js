const mySetTimeout = (function () {
	const hash = {};
	let requestID;
	let key;

	function mySetTimeout() {
		let start;
		const args = Array.prototype.slice.call(arguments);
		const callback = args.shift() || function () {};
		const delay = args.shift() || 0;
		const callbackType = typeof callback;
		key = callback.toString();

		if (!['string', 'function'].includes(callbackType)) {
			throw new Error('Callback should be either function or a string');
		}

		function simulateDelay(timestamp) {
			if (typeof start === 'undefined') {
				start = timestamp;
			}
			const elapsed = timestamp - start;

			if (elapsed >= delay) {
				if (callbackType === 'function') {
					callback.apply(callback, args);
				} else {
					eval(callback);
				}
			} else {
				requestID = window.requestAnimationFrame(simulateDelay);
				hash[key] = requestID;
			}
		}

		requestID = window.requestAnimationFrame(simulateDelay);
		hash[key] = requestID;
	}
	mySetTimeout.cancel = () => {
		requestID = hash[key];
		window.cancelAnimationFrame(requestID);
	};
	return mySetTimeout;
})();

mySetTimeout(() => {
	console.log('executed after 4000 ms');
}, 4000);

// Using web worker
const createInlineWorker = () => {
	const blob = new Blob(
		[
			//"onmessage = function(e) { postMessage('msg from worker'); }"
			`self.addEventListener('message', (e) => {
				function sleep(delay) {
					const ms = new Date().getTime();
					while(new Date().getTime() < ms + delay) {}
				}
				self.postMessage(sleep(e.data));
			}, false);`,
		],
		{ type: 'text/javascript' },
	);

	// Obtain a blob URL reference to our worker 'file'.
	const blobURL = window.URL.createObjectURL(blob);
	return new Worker(blobURL);
};

const mySetTimeout = (function () {
	const worker = createInlineWorker();
	function simulateTimeout() {
		const args = Array.prototype.slice.call(arguments);
		const callback = args.shift() || function () {};
		const delay = args.shift() || 0;
		worker.postMessage(delay);
		worker.onmessage = (e) => {
			callback.apply(callback, args);
		};
	}

	simulateTimeout.cancel = () => {
		worker.onmessage = () => {};
	};
	return simulateTimeout;
})();

mySetTimeout(() => {
	console.log('executed after 4000 ms');
}, 4000);
