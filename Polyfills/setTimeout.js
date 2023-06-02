(function () {
	let timeoutId = 0;
	timeoutIdsMap = {};

	function repeat(id) {
		const { delay, initiated, self, args, callback } = timeoutIdsMap[id] || {};
		if (delay) {
			if (delay + initiated < Date.now()) {
				typeof callback === 'function' && callback.apply(self, args);
			} else {
				requestAnimationFrame(() => repeat(id));
			}
		}
	}

	window.setTimeoutPolyfill = function (callback, delay, ...args) {
		timeoutId++;
		timeoutIdsMap[timeoutId] = {
			delay,
			self: this,
			callback,
			args,
			initiated: Date.now(),
		};
		requestAnimationFrame(() => repeat(timeoutId));
		return timeoutId;
	};

	window.clearTimeoutPolyfill = function (id) {
		delete timeoutIdsMap[id];
	};
})();

setTimeoutPolyfill(() => {
	console.log('executed after 4000 ms');
}, 4000);

(function () {
	// Using web worker
	const createInlineWorker = () => {
		const blob = new Blob(
			[
				`self.addEventListener('message', (e) => {
				function sleep(delay) {
					const ms = new Date().getTime();
					while(new Date().getTime() < ms + delay) {}
				}
				self.postMessage(sleep(e.data));
			}, false);`,
			],
			{ type: 'text/javascript' }
		);

		// Obtain a blob URL reference to our worker 'file'.
		const blobURL = window.URL.createObjectURL(blob);
		return new Worker(blobURL);
	};

	let uniqueInvocationId = 0;
	const timeoutIdsMap = {};

	window.setTimeoutPolyfill = function (callback, delay, ...args) {
		const worker = createInlineWorker();
		uniqueInvocationId++;
		timeoutIdsMap[uniqueInvocationId] = uniqueInvocationId;

		worker.postMessage(delay);
		worker.onmessage = (e) => {
			timeoutIdsMap[uniqueInvocationId] && callback.apply(callback, args);
		};
		return uniqueInvocationId;
	}

	window.cancelTimeoutPolyfill = function (timeoutId) {
		if (timeoutId in timeoutIdsMap) {
			delete timeoutIdsMap[timeoutId];
		}
	}
})();

setTimeoutPolyfill(() => {
	console.log('executed after 4000 ms');
}, 1000);
