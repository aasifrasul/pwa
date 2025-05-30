// BEGIN implementation of setZeroTimeout

// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
(function () {
	const timeouts = [];
	const messageName = 'zero-timeout-message';

	// Like setTimeout, but only takes a function argument.  There's
	// no time argument (always zero) and no arguments (you have to
	// use a closure).
	function setZeroTimeout(fn) {
		timeouts.push(fn);
		window.postMessage(messageName, '*');
	}

	function handleMessage(event) {
		if (event.source == window && event.data == messageName) {
			event.stopPropagation();
			if (timeouts.length > 0) {
				const fn = timeouts.shift();
				fn();
			}
		}
	}

	window.addEventListener('message', handleMessage, true);

	// Add the one thing we want added to the window object.
	window.setZeroTimeout = setZeroTimeout;
})();

// END implementation of setZeroTimeout

// BEGIN demo that uses setZeroTimeout

function runtest() {
	const output = document.querySelector('.top-to-btm');
	const outputText = document.createTextNode('');
	output.innerHTML = '';
	output.appendChild(outputText);

	function printOutput(line) {
		outputText.data += line + '\n';
	}

	let i = 0;
	let startTime = Date.now();

	function test1() {
		if (++i == 100) {
			const endTime = Date.now();
			printOutput('100 iterations of setZeroTimeout took ' + (endTime - startTime) + ' milliseconds.');
			i = 0;
			startTime = Date.now();
			setTimeout(test2, 0);
		} else {
			setZeroTimeout(test1);
		}
	}

	setZeroTimeout(test1);

	function test2() {
		if (++i == 100) {
			const endTime = Date.now();
			printOutput('100 iterations of setTimeout(0) took ' + (endTime - startTime) + ' milliseconds.');
		} else {
			setTimeout(test2, 0);
		}
	}
}

runtest();

// END demo that uses setZeroTimeout
