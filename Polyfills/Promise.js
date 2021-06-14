const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';

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

	callback(this.resolve.bind(this), this.reject.bind(this));
	console.log('In Constructor, callback => ', callback);
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
	console.log('In prototype then');
	if (!isFunction(onFulfilled) || (onRejected && !isFunction(onRejected))) {
		throw new Error('callback param can only be of type function');
	}
	this.state === 'fulfilled' && onFulfilled(this.result);
	this.state === 'rejected' && onRejected(this.error);
	return this;
};

myPromise.prototype.catch = function (errCallback) {
	console.log('errCallback', errCallback);
	this.error && isFunction(errCallback) && errCallback(this.error);
	return this;
};

myPromise.prototype.resolve = function (data) {
	console.log('In prototype resolve');
	this.state = 'fulfilled';
	this.result = data;
};

myPromise.prototype.reject = function (err) {
	console.log('In prototype reject');
	this.state = 'rejected';
	this.error = err;
};

myPromise.resolve = function (data) {
	console.log('In direct resolve', this);
	const promise = new this((resolve) => {
		resolve(data);
	});
	console.log('promise', promise);
	return promise;
};

myPromise.reject = function (data) {
	console.log('In direct resolve', this);
	const promise = new this((reject) => {
		reject(data);
	});
	console.log('promise', promise);
	return promise;
};

myPromise.all = function (arr) {
	let results = [];
	return new Promise((resolve, reject) => {
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

			console.log('After Resolve');
		},
		(e) => {
			reject(e);
		}
	);
});

promise
	.then((data) => {
		console.log('In then data', data);
	})
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
promises.push(promiseFactory({ id: 1, delay: 100 }));
promises.push(promiseFactory({ id: 2, delay: 50 }));
promises.push(promiseFactory({ id: 3, delay: 25 }));
promises.push(promiseFactory({ id: 5, delay: 200, isReject: true }));
promises.push(promiseFactory({ id: 4, delay: 200 }));

myPromise
	.all(promises)
	.then(
		(data) => console.log('In then', data),
		(e) => console.log('In Error', e)
	)
	.catch((e) => {
		console.log('In catch', e);
	});

myPromise
	.all([
		fetch('https://api.github.com/users/aasifrasul/followers'),
		fetch('https://api.github.com/users/aasifrasul/repos'),
	])
	.then((data) => console.log(data));
