'use srict';

const SWFile = 'service-worker.js';

const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.1/8 is considered localhost for IPv4.
		window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const checkValidServiceWorker = (swUrl) => {
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl)
		.then((response) => {
			// Ensure service worker exists, and that we really are getting a JS file.
			if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
				// No service worker found. Probably a different app. Reload the page.
				unregister(window.location.reload);
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl);
			}
		})
		.catch(() => {
			console.log('No internet connection found. App is running in offline mode.');
		});
};

const register = () => {
	// Delay registration until after the page has loaded, to ensure that our
	// precaching requests don't degrade the first visit experience.
	// See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
	window.addEventListener('load', () => {
		const swUrl = `${window.location.origin}/${SWFile}`;

		if (isLocalhost) {
			// This is running on localhost. Lets check if a service worker still exists or not.
			checkValidServiceWorker(swUrl);

			// Add some additional logging to localhost, pointing developers to the
			// service worker/PWA documentation.
			window.navigator.serviceWorker.ready.then(() => {
				console.log(
					`This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ`
				);
			});
		} else {
			// Is not local host. Just register service worker
			registerValidSW(swUrl);
		}
	});
};

const registerValidSW = () => {
	// Your service-worker.js *must* be located at the top-level directory relative to your site.
	// It won't be able to control pages unless it's located at the same level or higher than them.
	// *Don't* register service worker file in, e.g., a scripts/ sub-directory!
	// See https://github.com/slightlyoff/ServiceWorker/issues/468
	window.requestIdleCallback(() => {
		window.navigator.serviceWorker
			.register(`/${SWFile}`, {
				scope: '/',
			})
			.then(window.navigator.serviceWorker.ready)
			.then((registeringSW) => {
				const messageChannel = new MessageChannel();
				if (registeringSW.active && !window.sessionStorage.getItem('SWVersionSent')) {
					registeringSW.active.postMessage('Helloooooooooo');
					window.sessionStorage.setItem('SWVersionSent', 1);
				}
				registeringSW.update();
				if (window.navigator.serviceWorker.controller) {
					const messageChannel = new MessageChannel();
					messageChannel.port1.onmessage = function (event) {
						console.log(`Received a direct message from the ServiceWorker: ${event.data}`);
					};
					window.navigator.serviceWorker.controller.postMessage('Hello', [messageChannel.port2]);
				}

				// updatefound is fired if service-worker.js changes.
				// registeringSW.addEventListener('updatefound', () => {
				registeringSW.onupdatefound = () => {
					// The updatefound event implies that registeringSW.installing is set; see
					// https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
					const installingSW = registeringSW.installing;

					// installingSW.addEventListener('statechange', () => {
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
			})
			.catch((e) => {
				console.error('Error during service worker registration:', e);
			});
	});
};

const unregister = (cb) => {
	window.navigator.serviceWorker.ready.then((registration) => {
		registration.unregister().then(() => {
			cb && cb();
		});
	});
};

if ('serviceWorker' in window.navigator) {
	window.navigator.serviceWorker.addEventListener('controllerchange', () => {
		console.log('Inside Controller Change');
		// This fires when the service worker controlling this page
		// changes, eg a new worker has skipped waiting and become
		// the new active worker.
		/***
			This is not needed if self.skipWaiting() is used
			if (window.sessionStorage.getItem('refreshing')) return;
			window.location.reload();
			window.sessionStorage.setItem('refreshing', true);
		*/
	});

	window.navigator.serviceWorker.addEventListener('message', (e) => {
		if (window.location.origin !== e.origin || !(e.source instanceof ServiceWorker)) return;
		console.log('event.data from SW', e.data);
	});

	register();
}
