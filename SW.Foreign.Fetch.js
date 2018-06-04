self.addEventListener('install', event => {
    event.registerForeignFetch({
        scopes: ['/random'], // or self.registration.scope to handle everything
        origins: ['*'] // or ['https://example.com'] to limit the remote origins
    });
});

self.addEventListener('foreignFetch', event => {
    event.respondWith(
        fetch(event.request) // Try to make a network request
            .catch(() => new Response('34')) // Offline? Your random number is 34!
            .then(response => {
                console.log('response', response);
                return {
                    response,
                    origin: event.origin // Make this a CORS response
                };
            })
    );
});
