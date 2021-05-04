const makeCancelable = (promise) => {
	let isCancelled = false;

	const wrappedPromise = new Promise((resolve, reject) => {
		promise.then(
			(val) => (isCancelled ? reject({ isCancelled: true }) : resolve(val)),
			(error) => (isCancelled ? reject({ isCancelled: true }) : reject(error))
		);
	});

	return {
		promise: wrappedPromise,
		cancel() {
			isCancelled = true;
		},
	};
};
