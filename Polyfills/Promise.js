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
	this.data = null;
	this.error = null;

	callback.call(this, this.resolve.bind(this), this.reject.bind(this));
	console.log('In Constructor, callback => ', callback);
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
	console.log('In prototype then');
	this.state === 'fulfilled' && isFunction(onFulfilled) && onFulfilled(this.data);
	this.state === 'rejected' && isFunction(onRejected) && onRejected(this.error);
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
	this.data = data;
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

myPromise.all = function (promises) {
	debugger;
	if (!isArray(promises)) {
		throw new Error('Parameter expected of type array');
	}

	return new myPromise((resolve, reject) => {
		const result = [];

		promises.forEach((promise) => {
			if (!isFunction(promise.then)) {
				reject();
				throw new Error('expected Parameter is array of promises');
			}
			promise.then(
				(data) => {
					result.push(data);
					if (promises.length == result.length) {
						resolve(result);
					}
				},
				(err) => {
					reject(err);
					throw new Error(err);
				}
			);
		});
	});
};

/*
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
*/

myPromise
	.all([
		fetch('https://api.github.com/users/aasifrasul/followers'),
		fetch('https://api.github.com/users/aasifrasul/repos'),
	])
	.then((data) => console.log(data));
