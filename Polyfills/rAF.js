(function () {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
})();

/**
 * window.requestIdleCallback()
 * version 0.0.0
 * Browser Compatibility:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#browser_compatibility
 */
if (!window.requestIdleCallback) {
	window.requestIdleCallback = function (callback, options) {
		var options = options || {};
		var relaxation = 1;
		var timeout = options.timeout || relaxation;
		var start = performance.now();
		return setTimeout(function () {
			callback({
				get didTimeout() {
					return options.timeout ? false : performance.now() - start - relaxation > timeout;
				},
				timeRemaining: function () {
					return Math.max(0, relaxation + (performance.now() - start));
				},
			});
		}, relaxation);
	};
}

/**
 * window.cancelIdleCallback()
 * version 0.0.0
 * Browser Compatibility:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback#browser_compatibility
 */
if (!window.cancelIdleCallback) {
	window.cancelIdleCallback = function (id) {
		clearTimeout(id);
	};
}

/**
 * window.requestAnimationFrame()
 * version 0.0.0
 * Browser Compatibility:
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#browser_compatibility
 */
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function (callback) {
		return window.setTimeout(function () {
			callback(Date.now());
		}, 1000 / 60);
	};
}

/**
 * window.cancelAnimationFrame()
 * version 0.0.0
 * Browser Compatibility:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame#browser_compatibility
 */
if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}
