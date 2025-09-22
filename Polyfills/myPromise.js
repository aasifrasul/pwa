/**
 * 
	class Promise {
		status // pending/fulfilled/rejected
		data
		constructor(executor: (resolve: Function, reject: Function) => void): Promise;
		then(onFulfilled: Function, onRejected: Function): Promise;
		catch(onRejected: Function): Promise;
		finally(onFinally: Function): Promise;
		static resolve(x: any): Promise;
		static reject(r: any): Promise;

		static all(iterable: Iterable): Promise;
		// takes an iterable (such as an array or a Map) of promises as input and returns a new promise. 
		// This returned promise fulfills with an array of all the resolved values of the input promises in 
		// the same order as the input. However, if any of the input promises reject, the returned promise 
		// will immediately reject with the reason of the first rejecting promise encountered. In other words, 
		// if any one promise fails, the entire Promise.all operation fails.

		static allSettled(iterable: Iterable): Promise;
		// takes an iterable of promises as input and returns a new promise that fulfills with an array of objects. 
		// Each object represents the outcome of each input promise, whether it was fulfilled or rejected. 
		// The objects contain two properties: status and value or reason. 
		// The status property can be either "fulfilled" for resolved promises or "rejected" for rejected promises. 
		// The value property holds the resolved value if the promise was fulfilled, 
		// and the reason property holds the rejection reason if the promise was rejected.

		static any(promises: Iterable): Promise<any>; 
		// takes an iterable of promises as input and returns a new promise that fulfills with the value of the 
		// first promise that fulfills successfully. If all the input promises reject, the returned promise is 
		// rejected with an AggregateError, which is a specialized error object containing an array of rejection 
		// reasons.

		static race(iterable: Iterable): Promise;
		// takes an iterable of promises as input and returns a new promise that is settled with the outcome 
		// of the first promise that settles, whether it's fulfilled or rejected. It doesn't matter if the other 
		// promises fulfill or reject later.
	}
*/

class myPromise {
	static resolve(data) {
		return new myPromise(function (resolve) {
			resolve(data);
		});
	}

	static reject(error) {
		return new myPromise(function (resolve, reject) {
			reject(error);
		});
	}
	// "All must succeed" - fails fast
	static all(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}
		if (promises.length === 0) {
			return myPromise.resolve([]);
		}

		return new myPromise((resolve, reject) => {
			const results = new Array(promises.length);
			let resolvedCount = 0;

			promises.forEach((promise, index) => {
				myPromise.resolve(promise) // Handle non-promises
					.then((value) => {
						results[index] = value;
						resolvedCount++;
						if (resolvedCount === promises.length) {
							resolve(results);
						}
					})
					.catch((error) => {
						reject(error); // Fail fast - reject immediately
					});
			});
		});
	}

	// "Wait for everything" - never fails
	static allSettled(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		if (promises.length === 0) {
			return myPromise.resolve([]);
		}

		return new myPromise((resolve) => {
			const results = new Array(promises.length);
			let settledCount = 0;

			function checkForCompletion() {
				settledCount++;
				if (settledCount === promises.length) {
					resolve(results);
				}
			}

			promises.forEach((promise, index) => {
				myPromise.resolve(promise) // Handle non-promises
					.then(
						(value) => {
							results[index] = { status: 'fulfilled', value };
							checkForCompletion();
						},
						(reason) => {
							results[index] = { status: 'rejected', reason };
							checkForCompletion();
						},
					);
			});
		});
	}

	// "First success wins" - ignores failures until all fail
	static any(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		if (promises.length === 0) {
			return Promise.reject(new AggregateError([], 'No promises provided'));
		}

		return new Promise((resolve, reject) => {
			let rejectedCount = 0;
			const errors = [];

			promises.forEach((promise, index) => {
				myPromise.resolve(promise) // Handle non-promise values
					.then((value) => {
						resolve(value); // Resolve immediately on first success
					})
					.catch((error) => {
						errors[index] = error;
						rejectedCount++;

						// Only reject when ALL promises have failed
						if (rejectedCount === promises.length) {
							reject(new AggregateError(errors, 'All promises rejected'));
						}
					});
			});
		});
	}

	// "First to finish wins" - could be success or failure
	static race(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		return new myPromise((resolve, reject) => {
			let settled = false; // Prevent multiple settlements

			promises.forEach((promise) => {
				myPromise.resolve(promise)
					.then((value) => {
						if (!settled) {
							settled = true;
							resolve(value);
						}
					})
					.catch((error) => {
						if (!settled) {
							settled = true;
							reject(error);
						}
					});
			});
		});
	}

	constructor(callback) {
		this.status = 'pending';
		this.data = null;
		this.error = null;
		this.successHandlers = [];
		this.errorHandlers = [];

		try {
			callback(this.resolve.bind(this), this.reject.bind(this));
		} catch (error) {
			this.reject(error);
		}
	}

	resolve(data) {
		if (this.status !== 'pending') return;
		this.status = 'resolved';
		this.data = data;

		// Execute asynchronously
		queueMicrotask(() => this.executeHandlers(), 0);
	}

	reject(error) {
		if (this.status !== 'pending') return;
		this.status = 'rejected';
		this.error = error;

		queueMicrotask(this.executeHandlers.bind(this));
	}

	executeHandlers() {
		if (this.status === 'resolved') {
			this.successHandlers.forEach((cb) => cb(this.data));
			this.successHandlers = []; // Clear after execution
		} else if (this.status === 'rejected') {
			this.errorHandlers.forEach((cb) => cb(this.error));
			this.errorHandlers = []; // Clear after execution
		}
	}

	then(successCallback, errorCallback) {
		if (successCallback) {
			this.successHandlers.push(successCallback);
		}

		if (errorCallback) {
			this.errorHandlers.push(errorCallback);
		}

		// Only execute if already settled
		if (this.status !== 'pending') {
			queueMicrotask(() => this.executeHandlers(), 0);
		}

		return this;
	}

	catch(errorCallback) {
		if (errorCallback) {
			this.errorHandlers.push(errorCallback);
		}

		// Only execute if already settled
		if (this.status !== 'pending') {
			queueMicrotask(() => this.executeHandlers(), 0);
		}

		return this;
	}

	finally(callback) {
		callback && callback();
	}
}

const promise = new myPromise(function (resolve, reject) {
	console.log('Inside myPromise Instance');
	resolve('Hellooo');
	setTimeout(() => resolve('Hellooo'), 0);
});

setTimeout(() => {
	promise
		.then(function (data) {
			console.log('Inside then', data);
		})
		.catch((err) => {
			console.log('Inside Catch');
		})
		.finally(() => {
			console.log('In Finally');
		});
}, 5000);

myPromise
	.all([
		new myPromise((resolve) => setTimeout(() => resolve(5)), 5000),
		new myPromise((resolve) => setTimeout(() => resolve(1)), 1000),
		new myPromise((resolve) => setTimeout(() => resolve(4)), 4000),
		new myPromise((resolve) => setTimeout(() => resolve(6)), 6000),
		new myPromise((resolve) => setTimeout(() => resolve(2)), 2000),
		new myPromise((resolve) => setTimeout(() => resolve(3)), 3000),
	])
	.then(console.log);

myPromise
	.any([
		new myPromise((resolve, reject) => setTimeout(() => reject(1)), 1000),
		new myPromise((resolve) => setTimeout(() => resolve(4)), 4000),
		new myPromise((resolve) => setTimeout(() => resolve(6)), 6000),
		new myPromise((resolve) => setTimeout(() => resolve(2)), 2000),
		new myPromise((resolve) => setTimeout(() => resolve(3)), 3000),
	])
	.then(console.log);
