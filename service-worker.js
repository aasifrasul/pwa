'use strict';

const SWVERSION = 10;
const CURRENT_CACHES = {
	prefetch: 'prefetch-cache-v' + SWVERSION,
};

// URLs to prefetch during installation
const urlsToPrefetch = [
	'/',
	'/static/images/Dubai-Al-Arab.webp',
	'/static/images/mario.png',
	'/js/app.js',
	'/js/states.json',
	'/manifest.json',
	'https://api.github.com/users/aasifrasul',
	'/web-Worker.js',
];

// Application routes for streaming HTML responses
const routes = [
	{
		url: '/',
		template: '/src/templates/home.html',
		script: '/src/templates/home.js.html',
	},
];

// If you need external scripts, ensure they're available
// importScripts('./getApi.js');

/**
 * Helper to handle errors consistently
 * @param {Error} err - Error object
 */
const handleError = (err) => {
	console.error('Service worker error:', err);
	throw err;
};

/**
 * Get the cache for storing service worker version
 * @returns {Promise<Cache>} - Cache object
 */
const fetchSWVersionFromCache = () => caches.open('SWVERSION');

/**
 * Save current service worker version in cache
 * @param {Request} req - Request object
 * @param {Response} resp - Response object
 * @returns {Promise} - Promise that resolves when version is saved
 */
const saveCurrentVersionInCache = (req, resp) =>
	fetchSWVersionFromCache().then((cache) => cache.put(req.url, resp).catch(handleError));

/**
 * Fetch cached service worker version
 * @param {Request} req - Request object
 * @returns {Promise<number|null>} - Promise that resolves with cached version or null
 */
const fetchCachedVersion = (req) =>
	fetchSWVersionFromCache()
		.then((cache) => {
			return cache
				.match(req)
				.then((response) => {
					if (response) {
						return response
							.json()
							.then((cacheversion) => cacheversion)
							.catch(handleError);
					} else {
						return Promise.resolve(null);
					}
				})
				.catch(handleError);
		})
		.catch(handleError);

/**
 * Notify all clients with a message
 * @param {Object} message - Message to send to clients
 * @returns {Promise} - Promise that resolves when all clients are notified
 */
const notifyClients = (message) =>
	self.clients
		.matchAll()
		.then((clients) => {
			if (clients.length === 0) return Promise.resolve();

			const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
			const promises = clients.map((client) => client.postMessage(messageStr));
			return Promise.all(promises);
		})
		.catch(handleError);

/**
 * Check service worker version and notify clients of changes
 * @returns {Promise} - Promise that resolves when version check is complete
 */
const checkVersion = () => {
	const req = new Request('https://foo.bar/swversion');
	return fetchCachedVersion(req.clone())
		.then((cacheversion) => {
			const versionInfo = {
				newVersion: SWVERSION,
				oldVersion: cacheversion || null,
			};

			if (cacheversion !== SWVERSION) {
				const resp = new Response(JSON.stringify(SWVERSION));
				saveCurrentVersionInCache(req, resp).catch(handleError);
			}

			return notifyClients({
				type: 'VERSION_TRACKING',
				data: versionInfo,
			});
		})
		.catch(handleError);
};

/**
 * Create a cache-busted request
 * @param {string} url - URL to create a cache-busted request for
 * @returns {Request} - Cache-busted request
 */
const createCacheBustedRequest = (url) => {
	const request = new Request(url, { cache: 'reload' });
	if ('cache' in request) {
		return request;
	}

	const bustedUrl = new URL(url, self.location.href);
	bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
	return new Request(bustedUrl);
};

// ==== EVENT LISTENERS ====

/**
 * Handle install event - precache resources
 */
self.addEventListener('install', (e) => {
	console.log('Service Worker installing');

	// Skip waiting to activate immediately
	e.waitUntil(self.skipWaiting());

	// Pre-cache specified URLs
	e.waitUntil(
		caches
			.open(CURRENT_CACHES.prefetch)
			.then((cache) => {
				console.log('Opened cache for prefetching');
				const cachePromises = urlsToPrefetch.map((urlToPrefetch) => {
					const url = new URL(urlToPrefetch, self.location.href);
					url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

					const request = new Request(url, {
						mode: 'no-cors',
						cache: 'no-cache',
					});

					return fetch(request)
						.then((response) => {
							const { status, statusText } = response || {};
							if (status >= 400) {
								throw new Error(`Request for ${urlToPrefetch} failed with status ${statusText}`);
							}

							return cache.put(urlToPrefetch, response);
						})
						.catch((error) => {
							console.error(`Not caching ${urlToPrefetch} due to ${error}`);
						});
				});

				return Promise.all(cachePromises).then(() => console.log('Pre-fetching complete.'));
			})
			.catch((error) => console.error('Pre-fetching failed:', error)),
	);
});

/**
 * Handle activate event - clean up old caches and claim clients
 */
self.addEventListener('activate', (e) => {
	console.log('Service Worker activating');

	// Notify clients of activation
	notifyClients('Service Worker Activated');

	// Clean up old caches
	const expectedCacheNames = Object.values(CURRENT_CACHES);
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			const deletePromises = cacheNames.map((cacheName) => {
				if (expectedCacheNames.indexOf(cacheName) === -1 && cacheName !== 'SWVERSION') {
					console.log('Deleting out of date cache:', cacheName);
					return caches.delete(cacheName);
				} else {
					return Promise.resolve();
				}
			});
			return Promise.all(deletePromises);
		}),
	);

	// Claim any clients and check version
	e.waitUntil(self.clients.claim().then(() => checkVersion()));
});

/**
 * Generate a streamed HTML response for route-based templating
 * @param {string} url - URL of the request
 * @param {Object} routeMatch - Route configuration
 * @returns {Response} - Streamed HTML response
 */
const getStreamedHtmlResponse = (url, routeMatch) => {
	const stream = new ReadableStream({
		async start(controller) {
			const pushToStream = (stream) => {
				const reader = stream.getReader();

				return reader.read().then(function process(result) {
					if (result.done) {
						return;
					}
					controller.enqueue(result.value);
					return reader.read().then(process);
				});
			};

			try {
				const [header, footer, content, script] = await Promise.all([
					caches.match('/src/templates/header.html'),
					caches.match('/src/templates/footer.html'),
					caches.match(routeMatch.template),
					caches.match(routeMatch.script),
				]);

				if (header) await pushToStream(header.body);
				if (content) await pushToStream(content.body);
				if (footer) await pushToStream(footer.body);
				if (script) await pushToStream(script.body);
			} catch (error) {
				console.error('Error streaming HTML:', error);
			}

			controller.close();
		},
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
};

/**
 * Handle fetch event with caching strategy
 */
self.addEventListener('fetch', (e) => {
	const { request } = e;
	const { method, url } = request || {};
	const urlObj = new URL(url);

	// Skip cross-origin requests for non-GET methods
	if (!urlObj.origin.startsWith(self.location.origin) && method !== 'GET') {
		return;
	}

	// Check if this is a route that needs HTML streaming
	const routeMatch = routes.find((route) => route.url === urlObj.pathname);
	if (routeMatch) {
		e.respondWith(getStreamedHtmlResponse(url, routeMatch));
		return;
	}

	// Standard cache-first strategy
	e.respondWith(
		caches.match(request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return fetch(request)
				.then((response) => {
					// Don't cache bad responses
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					// Clone the response before caching
					const responseToCache = response.clone();
					caches.open(CURRENT_CACHES.prefetch).then((cache) => {
						cache.put(request, responseToCache);
					});

					return response;
				})
				.catch((error) => {
					console.error('Fetch failed:', error);
					// Could return a custom offline page here
				});
		}),
	);
});

/**
 * Handle push notifications
 */
self.addEventListener('push', (e) => {
	console.log('Received a push message', e);

	const title = 'App Notification';
	const body = 'We have received a push message.';
	const icon = '/images/icon-192x192.png';
	const tag = 'app-notification-tag';

	e.waitUntil(
		self.registration.showNotification(title, {
			body,
			icon,
			tag,
		}),
	);
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (e) => {
	console.log('On notification click: ', e.notification.tag);
	e.notification.close();

	// Focus existing window or open new one
	e.waitUntil(
		clients
			.matchAll({
				type: 'window',
			})
			.then((clientList) => {
				// Try to focus an existing window
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i];
					if (client.url === '/' && 'focus' in client) {
						return client.focus();
					}
				}

				// Open a new window if needed
				if (clients.openWindow) {
					const url = e.notification.data && e.notification.data.url ? e.notification.data.url : '/';
					return clients.openWindow(url);
				}
			}),
	);
});

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
	const { data, ports } = event;
	console.log(`Received a message from client: ${data}`);

	// Check version and notify clients of any updates
	checkVersion();

	// Respond through the message port if available
	if (Array.isArray(ports) && ports[0]) {
		ports[0].postMessage(`Service worker received: "${data}"`);
	}
});

/**
 * Handle background sync
 */
self.addEventListener('sync', (e) => {
	console.log('Background sync event:', e.tag);
	// Implement sync logic here
});
