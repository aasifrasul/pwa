'use strict';

const SWVERSION = 10;
const analyticsEndPoints = ['analytics', 'collect', 'track', 'pixel', 'stats', 'metrics'];
const CURRENT_CACHES = {
	prefetch: 'prefetch-cache-v' + SWVERSION,
};

// Retry configuration
const RETRY_CONFIG = {
	maxRetries: 3, // Maximum number of retry attempts
	initialBackoff: 1000, // Initial backoff delay in milliseconds (1 second)
	maxBackoff: 30000, // Maximum backoff delay in milliseconds (30 seconds)
	backoffFactor: 2, // Exponential backoff factor
	retryStatusCodes: [408, 429, 500, 502, 503, 504], // Status codes to retry
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
const fetchSWVersionFromCache = async () => await caches.open('SWVERSION');

/**
 * Save current service worker version in cache
 * @param {Request} req - Request object
 * @param {Response} resp - Response object
 * @returns {Promise} - Promise that resolves when version is saved
 */
const saveCurrentVersionInCache = async (req, resp) => {
	try {
		const cache = await fetchSWVersionFromCache();
		await cache.put(req.url, resp);
	} catch (err) {
		handleError(err);
	}
};

/**
 * Fetch cached service worker version
 * @param {Request} req - Request object
 * @returns {Promise<number|null>} - Promise that resolves with cached version or null
 */
const fetchCachedVersion = async (req) => {
	try {
		const cache = await fetchSWVersionFromCache();
		const response = await cache.match(req);

		if (!response) return null;

		return await response.json();
	} catch (err) {
		handleError(err);
		return null;
	}
};

/**
 * Notify all clients with a message
 * @param {Object} message - Message to send to clients
 * @returns {Promise} - Promise that resolves when all clients are notified
 */
const notifyClients = async (message) => {
	try {
		const clients = await self.clients.matchAll();
		if (clients.length === 0) return;

		const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
		await Promise.all(clients.map((client) => client.postMessage(messageStr)));
	} catch (err) {
		handleError(err);
	}
};

/**
 * Check service worker version and notify clients of changes
 * @returns {Promise} - Promise that resolves when version check is complete
 */
const checkVersion = async () => {
	try {
		const req = new Request('https://foo.bar/swversion');
		const cacheversion = await fetchCachedVersion(req.clone());

		const versionInfo = {
			newVersion: SWVERSION,
			oldVersion: cacheversion || null,
		};

		if (cacheversion !== SWVERSION) {
			const resp = new Response(JSON.stringify(SWVERSION));
			await saveCurrentVersionInCache(req, resp);
		}

		await notifyClients({
			type: 'VERSION_TRACKING',
			data: versionInfo,
		});
	} catch (err) {
		handleError(err);
	}
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

/**
 * Implements retry logic with exponential backoff
 * @param {Request} request - The request to fetch
 * @param {Object} options - Retry options
 * @returns {Promise<Response>} - Promise that resolves with response
 */
const fetchWithRetry = async (request, options = RETRY_CONFIG) => {
	const { maxRetries, initialBackoff, maxBackoff, backoffFactor, retryStatusCodes } = options;

	let retries = 0;
	let lastError = null;
	let backoff = initialBackoff;

	while (retries <= maxRetries) {
		try {
			const response = await fetch(request.clone());

			// If response is ok or not in retry status codes, return it
			if (response.ok || !retryStatusCodes.includes(response.status)) return response;

			// Log the retry attempt for status codes we want to retry
			console.log(
				`Request failed with status ${response.status}. Retry ${retries + 1}/${maxRetries} in ${backoff}ms`,
			);

			lastError = new Error(`Request failed with status ${response.status}`);
		} catch (error) {
			// Network error or other fetch failures
			console.log(`Fetch error: ${error.message}. Retry ${retries + 1}/${maxRetries} in ${backoff}ms`);
			lastError = error;
		}

		// If this was the last retry, throw the error
		if (retries >= maxRetries) break;

		// Wait for backoff period
		await new Promise((resolve) => setTimeout(resolve, backoff));

		// Increase backoff for next attempt (with max limit)
		backoff = Math.min(backoff * backoffFactor, maxBackoff);
		retries++;

		// Notify clients about retry
		notifyClients({
			type: 'FETCH_RETRY',
			data: {
				url: request.url,
				attempt: retries,
				maxRetries,
				backoff,
			},
		});
	}

	// If we got here, all retries failed
	throw lastError || new Error(`Request failed after ${maxRetries} retries`);
};

// ==== EVENT LISTENERS ====

/**
 * Handle install event - precache resources
 */
self.addEventListener('install', (e) => {
	console.log('Service Worker installing');

	// Using async function inside waitUntil
	e.waitUntil(
		(async () => {
			// Skip waiting to activate immediately
			await self.skipWaiting();

			try {
				// Pre-cache specified URLs
				const cache = await caches.open(CURRENT_CACHES.prefetch);
				console.log('Opened cache for prefetching');

				const cachePromises = urlsToPrefetch.map(async (urlToPrefetch) => {
					const url = new URL(urlToPrefetch, self.location.href);
					url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

					const request = new Request(url, {
						mode: 'no-cors',
						cache: 'no-cache',
					});

					try {
						const response = await fetchWithRetry(request);
						const { status, statusText } = response || {};

						if (status >= 400) {
							throw new Error(`Request for ${urlToPrefetch} failed with status ${statusText}`);
						}

						await cache.put(urlToPrefetch, response);
					} catch (error) {
						console.error(`Not caching ${urlToPrefetch} due to ${error}`);
					}
				});

				await Promise.all(cachePromises);
				console.log('Pre-fetching complete.');
			} catch (error) {
				console.error('Pre-fetching failed:', error);
			}
		})(),
	);
});

/**
 * Handle activate event - clean up old caches and claim clients
 */
self.addEventListener('activate', (e) => {
	console.log('Service Worker activating');

	e.waitUntil(
		(async () => {
			// Notify clients of activation
			await notifyClients('Service Worker Activated');

			// Clean up old caches
			try {
				const expectedCacheNames = Object.values(CURRENT_CACHES);
				const cacheNames = await caches.keys();

				const deletePromises = cacheNames.map(async (cacheName) => {
					if (expectedCacheNames.indexOf(cacheName) === -1 && cacheName !== 'SWVERSION') {
						console.log('Deleting out of date cache:', cacheName);
						await caches.delete(cacheName);
					}
				});

				await Promise.all(deletePromises);
			} catch (error) {
				console.error('Cache cleanup failed:', error);
			}

			// Claim any clients and check version
			await self.clients.claim();
			await checkVersion();
		})(),
	);
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
			const pushToStream = async (stream) => {
				const reader = stream.getReader();

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						controller.enqueue(value);
					}
				} catch (error) {
					console.error('Error reading stream:', error);
				}
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
 * Check if a URL is for analytics or tracking
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is for analytics
 */
const isAnalyticsRequest = (url) => {
	const urlObj = new URL(url);
	// Common analytics endpoints patterns
	return (
		analyticsEndPoints.some((item) => urlObj.pathname.includes(`/${item}`)) ||
		urlObj.search.includes('analytics') ||
		urlObj.hostname.includes('analytics')
	);
};

/**
 * Handle fetch event with appropriate caching strategy
 */
self.addEventListener('fetch', (e) => {
	const { request } = e;
	const { method, url } = request || {};
	const { origin, pathname } = new URL(url);

	// Skip cross-origin requests for non-GET methods
	if (!origin.startsWith(self.location.origin) && method !== 'GET') return;

	// Check if this is a route that needs HTML streaming
	const routeMatch = routes.find((route) => route.url === pathname);
	if (routeMatch) {
		e.respondWith(getStreamedHtmlResponse(url, routeMatch));
		return;
	}

	// Check if this is an analytics request
	if (isAnalyticsRequest(url)) {
		// Network-only strategy with retry for analytics
		e.respondWith(
			(async () => {
				try {
					return await fetchWithRetry(request);
				} catch (error) {
					console.error('Analytics request failed after retries:', error);

					// For analytics, we might want to queue the failed request for later
					notifyClients({
						type: 'ANALYTICS_FAILED',
						data: {
							url: request.url,
							error: error.message,
						},
					});

					// Return a "success" response to the client so the app continues normally
					return new Response(
						JSON.stringify({
							success: false,
							message: 'Analytics request queued for retry',
						}),
						{
							status: 200,
							headers: {
								'Content-Type': 'application/json',
							},
						},
					);
				}
			})(),
		);
		return;
	}

	// Standard cache-first strategy with retry mechanism for normal requests
	e.respondWith(
		(async () => {
			try {
				const cachedResponse = await caches.match(request);
				if (cachedResponse) return cachedResponse;

				// No cached response, try network with retry
				const response = await fetchWithRetry(request);

				// Don't cache bad responses
				if (!response || response.status !== 200 || response.type !== 'basic') return response;

				// Clone the response before caching
				const responseToCache = response.clone();
				const cache = await caches.open(CURRENT_CACHES.prefetch);
				await cache.put(request, responseToCache);

				return response;
			} catch (error) {
				console.error('Fetch failed after retries:', error);

				// Notify clients about the complete failure
				notifyClients({
					type: 'FETCH_FAILED',
					data: {
						url: request.url,
						error: error.message,
					},
				});

				// Return custom offline page or fallback
				return new Response('Network request failed after multiple retries', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: {
						'Content-Type': 'text/plain',
					},
				});
			}
		})(),
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
		(async () => {
			const clientList = await clients.matchAll({
				type: 'window',
			});

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
		})(),
	);
});

/**
 * Handle messages from clients
 */
self.addEventListener('message', async (event) => {
	const { data, ports } = event;
	console.log(`Received a message from client: ${data}`);

	// Check version and notify clients of any updates
	await checkVersion();

	// Handle retry configuration updates from clients
	if (data && typeof data === 'object' && data.type === 'UPDATE_RETRY_CONFIG') {
		const newConfig = data.config || {};

		// Update retry configuration with valid values
		if (typeof newConfig.maxRetries === 'number' && newConfig.maxRetries > 0) {
			RETRY_CONFIG.maxRetries = newConfig.maxRetries;
		}
		if (typeof newConfig.initialBackoff === 'number' && newConfig.initialBackoff > 0) {
			RETRY_CONFIG.initialBackoff = newConfig.initialBackoff;
		}
		if (typeof newConfig.maxBackoff === 'number' && newConfig.maxBackoff > 0) {
			RETRY_CONFIG.maxBackoff = newConfig.maxBackoff;
		}
		if (typeof newConfig.backoffFactor === 'number' && newConfig.backoffFactor > 1) {
			RETRY_CONFIG.backoffFactor = newConfig.backoffFactor;
		}
		if (Array.isArray(newConfig.retryStatusCodes)) {
			RETRY_CONFIG.retryStatusCodes = newConfig.retryStatusCodes;
		}

		console.log('Updated retry configuration:', RETRY_CONFIG);
	}

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
