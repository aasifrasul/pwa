import helpers from 'sw-toolbox/lib/helpers';
import { simpleHash } from 'utils/hashingUtils';
import { connektApiKey, connektStageApiKey } from 'constants/AppConstants';
import { URLConstants } from 'constants/URLConstants';

export default {
	cacheFirst,
	cachePost,
	webpushCallBack,
	uncache,
};

function cacheFirst(request, values, options) {
	// remove dynamic params like ssid, sqid which fuck up caching :/
	const sanitizedRequestUrl = request.url.replace(/sqid=([^&]*)/, '').replace(/ssid=([^&]*)/, '');
	return helpers
		.openCache(options)
		.then((cache) => {
			return cacheRequest(sanitizedRequestUrl, cache, options, 'get', request);
		})
		.catch((e) => {
			throw new Error(e);
		});
}

function cachePost(request, values, options) {
	return getUrlFromPost(request.clone())
		.then((url) => {
			return helpers.openCache(options).then((cache) => {
				return cacheRequest(url, cache, options, 'post', request);
			});
		})
		.catch((e) => {
			throw new Error(e);
		});
}

function postToGet(request) {
	return getUrlFromPost(request.clone()).then(function (getUrl) {
		return fetch(request).then(function (response) {
			return {
				url: getUrl,
				response: response.clone(),
			};
		});
	});
}

function getUrlFromPost(request) {
	return request.json().then(function (payload) {
		const stringResponse = JSON.stringify(payload);
		// removing dynamic params that fuck up caching, thanks @debugpai for the regex
		const sanitizedUrl = stringResponse.replace(/"(ssid|sqid)":".*?"/g, '');
		const hash = simpleHash(request.url + sanitizedUrl);
		return `${request.url}?payload=${hash}`;
	});
}

function cacheRequest(request, cache, options, type = 'get', actualRequest) {
	const ttl = options.cache.maxAgeSeconds * 1000;
	const timeStampHeader = 'created-time';
	const timeStampRequest = new Request(`${request + (request.indexOf('?') > -1 ? '&' : '?')}$cached$timestamp$`);
	return Promise.all([cache.match(request), cache.match(timeStampRequest)]).then((responses) => {
		const cachedResponse = responses[0];
		const timeStampResponse = responses[1];
		if (
			cachedResponse &&
			timeStampResponse &&
			Date.now() < parseInt(timeStampResponse.headers.get(timeStampHeader), 10) + ttl
		) {
			return cachedResponse;
		}
		// no cache available, call server
		if (type === 'get') {
			return fetch(actualRequest).then((response) => {
				if (response.status === 200) {
					cache.put(request, response.clone());
					cache.put(timeStampRequest, new Response(null, { headers: { [timeStampHeader]: Date.now() } }));
				}
				return response;
			});
		}
		// post call
		return postToGet(actualRequest).then((reqAndResponse) => {
			if (reqAndResponse.response.ok) {
				cache.put(timeStampRequest, new Response(null, { headers: { [timeStampHeader]: Date.now() } }));
				cache.put(request, reqAndResponse.response.clone());
			}
			return reqAndResponse.response;
		});
	});
}

function uncache(cacheName, options) {
	return function () {
		helpers.uncache(cacheName, options);
	};
}

function webpushCallBack(eventType, message, cargo) {
	const payload = {
		type: 'PN',
		eventType: eventType,
		timestamp: new Date().getTime(),
		messageId: message.messageId,
		contextId: message.contextId,
		cargo: cargo,
	};

	const fetchOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': __DEBUG_ENV__ ? connektStageApiKey : connektApiKey,
		},
		body: JSON.stringify(payload),
	};

	const url = __DEBUG_ENV__
		? `${URLConstants.CONNEKT_STAGE_PATHNAME_PREFIX}/v1/push/callback/openweb/fkwebsite/${message.deviceId}`
		: `https://${URLConstants.CONNEKT_BASE_URL}/v1/push/callback/openweb/fkwebsite/${message.deviceId}`;

	return fetch(url, fetchOptions);
}
