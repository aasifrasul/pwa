// Via https://github.com/coonsta/cache-polyfill/blob/master/dist/serviceworker-cache-polyfill.js
// Adds in some functionality missing in Chrome 40.

if (!Cache.prototype.add) {
    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}

if (!Cache.prototype.addAll) {
    Cache.prototype.addAll = function addAll(requests) {
        const cache = this;

        // Since DOMExceptions are not constructable:
        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }
        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve()
            .then(() => {
                if (arguments.length < 1) throw new TypeError();

                // Simulate sequence<(Request or USVString)> binding:
                const sequence = [];

                requests = requests.map(request => (request instanceof Request ? request : String(request)));

                return Promise.all(
                    requests.map(request => {
                        if (typeof request === 'string') {
                            request = new Request(request);
                        }

                        const scheme = new URL(request.url).protocol;

                        if (scheme !== 'http:' && scheme !== 'https:') {
                            throw new NetworkError('Invalid scheme');
                        }

                        return fetch(request.clone());
                    })
                );
            })
            .then(responses => {
                // TODO: check that requests don't overwrite one another
                // (don't think this is possible to polyfill due to opaque responses)
                return Promise.all(responses.map((response, i) => cache.put(requests[i], response)));
            })
            .then(() => undefined);
    };
}

if (!CacheStorage.prototype.match) {
    // This is probably vulnerable to race conditions (removing caches etc)
    CacheStorage.prototype.match = function match(request, opts) {
        const caches = this;

        return this.keys().then(cacheNames => {
            let match;

            return cacheNames.reduce((chain, cacheName) => {
                return chain.then(() => {
                    return (
                        match ||
                        caches
                            .open(cacheName)
                            .then(cache => {
                                return cache.match(request, opts);
                            })
                            .then(response => {
                                match = response;
                                return match;
                            })
                    );
                });
            }, Promise.resolve());
        });
    };
}
