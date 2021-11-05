const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';

const log = (msg) => console.log(msg);

function spy (func) {
	return function (...args) {
		log('function:', func.name);
		log('args:', ...args);
		return func.apply(this, args);
	};
};

/**
 * Constructor accepts a callback which in turn accpets two functions resolve/reject
 */
function myPromise(callback) {
	if (!new.target) {
		throw new Error('Improper invocation, possible miss of new');
	}

	if (!isFunction(callback)) {
		throw new Error('callback param can only be of type function');
	}

	this.state = 'pending';
	this.result = null;
	this.error = null;

	// This is imp, as the function gets called asynchronously.
	this.resolve = this.resolve.bind(this);
	this.reject = this.reject.bind(this);

	/**
	 * This is imp as resolve/reject should be invoked at a later stage (async)
	 * */
	queueMicrotask(() => callback(this.resolve, this.reject));
}

myPromise.prototype.resolve = spy(function resolve(data) {
	this.state = 'fulfilled';
	this.result = data;

	/**
	 * We have to invoke onFulfilled which was passed as a first param to "promise.then"
	 * */
	if (isFunction(this.onFulfilled)) {
		this.onFulfilled(data);
	} else {
		log('onFulfilled is not defined');
	}
});

myPromise.prototype.reject = spy(function reject(err) {
	this.state = 'rejected';
	this.error = err;

	/**
	 * We have to invoke onRejected which was passed as a second param to "promise.then"
	 * */
	if (isFunction(this.onRejected)) {
		this.onRejected(new Error(err));
	} else {
		log('onRejected is not defined');
	}
});

/**
 * Accepts two optinal params, which are functions.
 * we have to assign both these to instance vars as these will be used afterwards
 * when the Promise resolves or rejects
 * */
myPromise.prototype.then = spy(function then(onFulfilled, onRejected) {
	if (!isFunction(onFulfilled) || (onRejected && !isFunction(onRejected))) {
		throw new Error('callback param can only be of type function');
	}
	this.onFulfilled = onFulfilled;
	this.onRejected = onRejected;
	return this;
});

myPromise.prototype.catch = spy(function protoCatch(errCallback) {
	log('errCallback', errCallback);
	this.error && isFunction(errCallback) && errCallback(this.error);
	return this;
});

myPromise.prototype.finally = spy(function protoFinally(callback) {
	if (!isFunction(callback)) {
		throw new Error('callback param supplied should be of type function');
	}

	['fulfilled', 'rejected'].includes(this.state) && callback();
	return this;
});

myPromise.resolve = spy(function resolve(data) {
	return new myPromise((resolve) => resolve(data));
});

myPromise.reject = spy(function reject(data) {
	return new myPromise((resolve, reject) => reject(data));
});

const promise = new myPromise(function (resolve, reject) {
	log('Inside myPromise Instance');
	reject('Hellooo');
	setTimeout(() => reject('Hellooo'), 0);
});

promise
	.then(function (data) {
		log('Inside then', data);
	})
	.catch((err) => {
		log('Inside Catch');
	});
/*
myPromise.all = function all(arr) {
	let results = [];
	return new myPromise((resolve, reject) => {
		for (var i = arr.length - 1; i >= 0; i--) {
			(function (idx) {
				arr[idx].then(
					(data) => {
						results[idx] = data;
						results = [...results];
						if (results.length === arr.length) {
							resolve(results);
						}
					},
					(e) => {
						reject(e);
						// throw new Error(e);
					}
				);
			})(i);
		}
	});
};

const promise = new myPromise((resolve, reject) => {
	fetch('https://api.github.com/users/aasifrasul/followers').then(
		(data) => {
			const { status, ok, body, statusText } = data;
			if (status == 200 && ok) {
				resolve(body);
			} else {
				reject(statusText);
			}

			log('After Resolve');
		},
		(e) => {
			reject(e);
		}
	);
});

promise
	.then((data) => log('In then data', data))
	.catch((e) => {
		throw new Error(e);
	});

var promises = [];

function promiseFactory(payload) {
	return new myPromise((resolve, reject) => {
		const { delay, isReject } = payload || {};
		setTimeout(() => {
			isReject ? reject(payload) : resolve(payload);
		}, delay);
	});
}

Array.apply(null, { length: 50 })
	.map(Number.call, Number)
	.forEach((i) => {
		promises.push(promiseFactory({ id: ++i, delay: Math.random() * 200, isReject: 0 }));
	});

myPromise
	.all(promises)
	.then(
		(data) => log('In then', data),
		(e) => log('In Error', e)
	)
	.catch((e) => {
		log('In catch', e);
	});

myPromise
	.all([
		fetch('https://api.github.com/users/aasifrasul/followers'),
		fetch('https://api.github.com/users/aasifrasul/repos'),
	])
	.then((data) => log(data));
*/