'use strict';

const SWFile = 'service-worker.js';

const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
	// [::1] is the IPv6 localhost address.
	window.location.hostname === '[::1]' ||
	// 127.0.0.1/8 is considered localhost for IPv4.
	window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

/**
 * Registers a valid service worker
 * @param {string} swUrl - URL to the service worker file
 */
const registerValidSW = async (swUrl) => {
	// Your service-worker.js *must* be located at the top-level directory relative to your site.
	try {
		const registeringSW = await window.navigator.serviceWorker.register(swUrl, {
			scope: '/',
		});
		// Setup message channel for communication
		if (registeringSW.active && !window.sessionStorage.getItem('SWVersionSent')) {
			registeringSW.active.postMessage('Hello from client');
			window.sessionStorage.setItem('SWVersionSent', 1);
		}

		// Check for updates
		registeringSW.update();

		// Direct messaging with service worker controller if available
		if (window.navigator.serviceWorker.controller) {
			const messageChannel = new MessageChannel();
			messageChannel.port1.onmessage = function (event) {
				console.log(`Received a direct message from the ServiceWorker: ${event.data}`);
			};
			window.navigator.serviceWorker.controller.postMessage('Hello', [messageChannel.port2]);
		}

		// Handle update detection
		registeringSW.onupdatefound = () => {
			const installingSW = registeringSW.installing;

			installingSW.onstatechange = () => {
				switch (installingSW.state) {
					case 'installing':
						console.log('SW state => installing');
						break;
					case 'installed':
						console.log('SW state => installed, New or updated content is available.');
						break;
					case 'activating':
						console.log('SW state => activating');
						break;
					case 'activated':
						console.log('SW state => activated');
						break;
					case 'redundant':
						console.log('SW state => redundant.');
						break;
				}
			};
		};
	} catch (e) {
		console.error('Error during service worker registration:', e);
	};
};

/**
 * Checks if the service worker is valid and registers it
 * @param {string} swUrl - URL to the service worker file
 */
const checkValidServiceWorker = async (swUrl) => {
	// Check if the service worker can be found. If it can't reload the page.
	try {
		const response = await fetch(swUrl);
		// Ensure service worker exists, and that we really are getting a JS file.
		if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
			// No service worker found. Probably a different app. Reload the page.
			unregister(() => window.location.reload());
		} else {
			// Service worker found. Proceed as normal.
			registerValidSW(swUrl);
		}
	} catch (err) {
		console.log('No internet connection found. App is running in offline mode.');
	};
};

/**
 * Register the service worker
 */
const register = async () => {
	const swUrl = `${window.location.origin}/${SWFile}`;

	if (isLocalhost) {
		// This is running on localhost. Check if a service worker still exists.
		checkValidServiceWorker(swUrl);

		// Add additional logging for developers
		await window.navigator.serviceWorker.ready;
		console.log(
			'This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ',
		);
	} else {
		// Not localhost. Just register service worker
		registerValidSW(swUrl);
	}
};

/**
 * Unregister the service worker
 * @param {Function} cb - Callback to execute after unregistering
 */
const unregister = async (cb) => {
	const registration = await window.navigator.serviceWorker.ready;
	await registration.unregister();
	if (cb && typeof cb === 'function') cb();
};


function addListeners() {
	// Handle controller changes (new service worker activation)
	window.navigator.serviceWorker.addEventListener('controllerchange', () => {
		console.log('Inside Controller Change - Service worker controller has changed');
		// You could reload the page here if needed
		/*
		if (window.sessionStorage.getItem('refreshing')) return;
		window.location.reload();
		window.sessionStorage.setItem('refreshing', true);
		*/
	});

	// Listen for messages from the service worker
	window.navigator.serviceWorker.addEventListener('message', (e) => {
		// Security check to ensure message is from our origin and from a ServiceWorker
		if (window.location.origin !== e.origin || !(e.source instanceof ServiceWorker)) return;
		console.log('Message received from service worker:', e.data);

		// Parse JSON message if needed
		try {
			const parsedData = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
			if (parsedData.type === 'VERSION_TRACKING') {
				console.log('Version info:', parsedData.data);
			}
		} catch (error) {
			console.log('Raw message from SW:', e.data);
		}
	});
}

// Delay registration until after the page has loaded
window.addEventListener('load', async () => {
	// Only run if service worker is supported
	if ('serviceWorker' in window.navigator) {
		register();
		addListeners();
	}
});