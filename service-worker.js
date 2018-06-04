'use srict';

const SWVERSION = 10;
const CURRENT_CACHES = {
	prefetch: 'prefetch-cache-v' + SWVERSION
};

const urlsToPrefetch = [
	'/',
	'/static/images/Dubai-Photos-Images-Travel-Tourist-Images-Pictures.jpg',
	'/js/app.js',
	'/js/states.json',
	'/manifest.json',
	'https://api.github.com/users/aasifrasul',
	'/web-Worker.js',
	'/SWRegistration.js'
];

importScripts('./getApi.js');

const createCacheBustedRequest = url => {
	const request = new Request(url, {
		cache: 'reload'
	});
	if ('cache' in request) {
		return request;
	}

	const bustedUrl = new URL(url, self.location.href);
	bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
	return new Request(bustedUrl);
};

const handleError = err => {
	console.log(err);
	throw err;
};

const fetchSWVersionFromCache = () => caches.open('SWVERSION');

const saveCurrentVersionInCache = (req, resp) =>
	fetchSWVersionFromCache().then(cache => cache.put(req.url, resp).catch(handleError));

const fetchCachedVersion = req =>
	fetchSWVersionFromCache()
		.then(cache => {
			return cache
				.match(req)
				.then(response => {
					if (response) {
						return response
							.json()
							.then(cacheversion => cacheversion)
							.catch(handleError);
					} else {
						return Promise.resolve();
					}
				})
				.catch(handleError);
		})
		.catch(handleError);

const notifyClients = response =>
	self.clients
		.matchAll()
		.then(clients => {
			const promises = clients.map(client => client.postMessage(JSON.stringify(response)));
			return Promise.all(promises);
		})
		.catch(handleError);

const checkVersion = () => {
	const req = new Request('https://foo.bar/swversion');
	return fetchCachedVersion(req.clone())
		.then(cacheversion => {
			const obj = {};
			obj['newVersion'] = SWVERSION;
			obj['oldVersion'] = cacheversion || null;
			if (cacheversion !== SWVERSION) {
				const resp = new Response(SWVERSION);
				saveCurrentVersionInCache(req, resp).catch(handleError);
			}
			return notifyClients({
				type: 'VERSION_TRACKING',
				data: obj
			});
		})
		.catch(handleError);
};

self.addEventListener('install', event => {
	event.waitUntil(self.skipWaiting());

	event.waitUntil(
		caches
			.open(CURRENT_CACHES.prefetch)
			.then(cache => {
				const cachePromises = urlsToPrefetch.map(urlToPrefetch => {
					const url = new URL(urlToPrefetch, self.location.href);
					url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

					const request = new Request(url, {
						mode: 'no-cors',
						cache: 'no-cache'
					});
					return fetch(request)
						.then(response => {
							const { status, statusText } = response || {};
							if (status >= 400) {
								throw new Error(
									`request for ${urlToPrefetch} failed with status ${statusText}`
								);
							}

							return cache.put(urlToPrefetch, response);
						})
						.catch(error => {
							console.error(`Not caching ${urlToPrefetch} due to ${error}`);
						});
				});

				return Promise.all(cachePromises).then(() => console.log('Pre-fetching complete.'));
			})
			.catch(error => console.error('Pre-fetching failed:', error))
	);
});

self.addEventListener('activate', event => {
	notifyClients('Hello From SW');

	const expectedCacheNames = Object.values(CURRENT_CACHES);

	event.waitUntil(
		caches.keys().then(cacheNames => {
			const promises = cacheNames.map(cacheName => {
				if (expectedCacheNames.indexOf(cacheName) === -1 && cacheName !== 'SWVERSION') {
					console.log('Deleting out of date cache:', cacheName);
					return caches.delete(cacheName);
				} else {
					return Promise.resolve();
				}
			});
			return Promise.all(promises);
		})
	);
	event.waitUntil(self.clients.claim().then(() => checkVersion()));
});

self.addEventListener('fetch', event => {
	const { request } = event;
	const { method, url } = request || {};

	// Skip cross-origin requests, like those for Google Analytics.
	// if (event.request.url.startsWith(self.location.origin)) {

	if (!url.startsWith(self.location.origin) && method !== 'GET') {
		console.log('WORKER: fetch event ignored.', method, url);
		return;
	}
	event.respondWith(
		caches.match(request).then(response => {
			if (response) {
				return response;
			}
			return fetch(request.clone())
				.then(response => {
					const clonedResponse = response.clone();
					caches.open(CURRENT_CACHES.prefetch).then(cache => {
						cache.put(request.url, clonedResponse);
					});
					return response;
				})
				.catch(handleError);
		})
	);
});

/*
	// This sample illustrates an aggressive approach to caching, in which every valid response is
	// cached and every request is first checked against the cache.
	// This may not be an appropriate approach if your web application makes requests for
	// arbitrary URLs as part of its normal operation (e.g. a RSS client or a news aggregator),
	// as the cache could end up containing large responses that might not end up ever being accessed.
	// Other approaches, like selectively caching based on response headers or only caching
	// responses served from a specific domain, might be more appropriate for those use cases.
	self.addEventListener('fetch', function(event) {
		console.log('Handling fetch event for', event.request.url);

		event.respondWith(
			caches.open(CURRENT_CACHES['prefetch']).then(function(cache) {
				return cache.match(event.request).then(function(response) {
					if (response) {
						// If there is an entry in the cache for event.request, then response will be defined
						// and we can just return it.
						console.log(' Found response in cache:', response);

						return response;
					}

					// Otherwise, if there is no entry in the cache for event.request, response will be
					// undefined, and we need to fetch() the resource.
					console.log(' No response for %s found in cache. ' +
						'About to fetch from network...', event.request.url);

					// We call .clone() on the request since we might use it in the call to cache.put() later on.
					// Both fetch() and cache.put() "consume" the request, so we need to make a copy.
					// (see https://fetch.spec.whatwg.org/#dom-request-clone)
					return fetch(event.request.clone()).then(function(response) {
						console.log('  Response for %s from network is: %O',
							event.request.url, response);

						// Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
						// responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type
						if (response.status < 400) {
							// This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
							// One limitation is that, for non-CORS requests, we get back a filtered opaque response
							// (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
							// .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
							// blindly caching those opaque responses, we run the risk of caching a transient error response.
							//
							// We need to call .clone() on the response object to save a copy of it to the cache.
							// (https://fetch.spec.whatwg.org/#dom-request-clone)
							cache.put(event.request, response.clone());
						}

						// Return the original response object, which will be used to fulfill the resource request.
						return response;
					});
				}).catch(function(error) {
					// This catch() will handle exceptions that arise from the match() or fetch() operations.
					// Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
					// It will return a normal response object that has the appropriate error code set.
					console.error('  prefetch caching failed:', error);

					throw error;
				});
			})
		);
	});
	*/

self.addEventListener('push', event => {
	console.log('Received a push message', event);

	const title = 'Yay a message.';
	const body = 'We have received a push message.';
	const icon = '/images/icon-192x192.png';
	const tag = 'simple-push-demo-notification-tag';

	event.waitUntil(
		self.registration.showNotification(title, {
			body,
			icon,
			tag
		})
	);
});

self.addEventListener('notificationclick', event => {
	console.log('On notification click: ', event.notification.tag);
	// Android doesn’t close the notification when you click on it
	// See: http://crbug.com/463146
	event.notification.close();

	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: 'window'
			})
			.then(clientList => {
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i];
					if (client.url === '/' && 'focus' in client) {
						return client.focus();
					}
				}
				if (clients.openWindow) {
					return clients.openWindow('/');
				}
			})
	);
});

self.addEventListener('message', ({ data, ports }) => {
	console.log(`Received a message from main thread: ${data}`);
	checkVersion();
	console.log(ports);
	Array.isArray(ports) && ports[0] && ports[0].postMessage(`Roger that! - "${data}"`);
});

self.addEventListener('sync', event => console.log(event));
