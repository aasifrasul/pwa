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

	static all(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		if (promises.length === 0) {
			return myPromise.resolve([]);
		}

		return new myPromise((resolve, reject) => {
			const result = {};
			let countOfResolvedPromises = 0;

			for (let i = 0; i < promises.length; i++) {
				const promise = promises[i];

				try {
					promise.then((data) => {
						countOfResolvedPromises++;
						result[i] = data;
						if (promises.length === countOfResolvedPromises) {
							resolve(result);
							return;
						}
					});
				} catch (err) {
					throw new Error(err);
				}
			}
		});
	}

	static allSettled(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		return new myPromise((resolve, reject) => {
			const result = [];
			let countOfResolvedPromises = 0;

			for (let i = 0; i < promises.length; i++) {
				const promise = promises[i];

				promise.then(
					(value) => {
						countOfResolvedPromises++;
						result[i] = { status: 'fulfilled', value };
						if (promises.length === countOfResolvedPromises) {
							resolve(result);
						}
					},
					(reason) => {
						countOfResolvedPromises++;
						result[i] = { status: 'rejected', reason };
						if (promises.length === countOfResolvedPromises) {
							resolve(result);
						}
					},
				);
			}
		});
	}

	static any(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		if (promises.length === 0) {
			return myPromise.resolve([]);
		}

		return new Promise((resolve, reject) => {
			let resultData;
			let countOfCompletedPromises = 0;

			for (let promise of promises) {
				promise
					.then((data) => {
						if (!resultData) {
							resultData = data;
						}
					})
					.finally(() => {
						++countOfCompletedPromises;

						if (countOfCompletedPromises === promises.length) {
							if (resultData) {
								resolve(resultData);
							} else {
								reject(new Error('AggregateError'));
							}
						}
					});
			}
		});
	}

	static race(promises) {
		if (!Array.isArray(promises)) {
			throw new Error('Parameter expected of type array');
		}

		return new myPromise((resolve, reject) => {
			for (let promise of promises) {
				promise
					.then((data) => resolve(data))
					.catch((err) => {
						reject(err);
						throw new Error(err);
					});
			}
		});
	}

	constructor(callback) {
		this.validateFunction(callback);
		this.state = 'pending'; //pending/fulfilled/rejected
		this.data = null;
		this.error = null;

		this.finallyCallback = () => {};
		this.successCallback = () => {};
		this.errorCallback = () => {};

		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);

		callback(this.resolve, this.reject);
	}

	resolve(data) {
		if (this.state === 'pending') {
			this.state = 'fulfilled';
			this.data = data;

			this.successCallback(data);
			this.finallyCallback();
		}
	}

	reject(error) {
		if (this.state === 'pending') {
			this.state = 'rejected';
			this.error = error;

			this.errorCallback(error);
			this.finallyCallback();
		}
	}

	then(successCallback, errorCallback) {
		this.validateFunction(successCallback, 'successCallback');
		errorCallback && this.validateFunction(errorCallback, 'errorCallback');

		this.data && this.successCallback(this.data);
		this.error && errorCallback && this.errorCallback(this.error);
		this.finallyCallback();

		return this;
	}

	catch(errorCallback) {
		this.validateFunction(errorCallback, 'errorCallback');
		this.error && this.errorCallback(this.error);
		this.finallyCallback();

		return this;
	}

	finally(finallyCallback) {
		this.validateFunction(finallyCallback, 'finallyCallback');
	}

	validateFunction(func, funcName) {
		if (typeof func !== 'function') {
			throw new Error('Invalid function', funcName);
		}

		if (typeof funcName === 'string' && funcName.length > 0) {
			this[funcName] = func;
		}
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
