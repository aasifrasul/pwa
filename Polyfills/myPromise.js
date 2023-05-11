const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';
const isObject = (obj) => dataType(obj) === 'object';

const safelyExecuteFunction = (func, context, ...params) => {
	if (!isFunction(func)) {
		return null;
	}

	if (isObject(context) && isFunction(context[func.name])) {
		return func.apply(context, params);
	}

	return func(...params);
};

/**
 * 
	class Promise {
	  constructor(executor: (resolve: Function, reject: Function) => void): Promise;
	  then(onFulfilled: Function, onRejected: Function): Promise;
	  catch(onRejected: Function): Promise;
	  finally(onFinally: Function): Promise;
	  static resolve(x: any): Promise;
	  static reject(r: any): Promise;
	  static all(iterable: Iterable): Promise;
	  static allSettled(iterable: Iterable): Promise;
	  static any(promises: Iterable): Promise<any>;
	  static race(iterable: Iterable): Promise;
	}
*/

class myPromise {
	constructor(callback) {
		if (!isFunction(callback)) {
			throw new Error('constructor parameter needs to be a function callback');
		}

		this.data = null;
		this.error = null;
		this.status = 'pending'; // pending/fulfilled/rejected

		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);
		safelyExecuteFunction(callback, null, this.resolve, this.reject);
	}

	resolve(data) {
		if (this.status === 'pending') {
			this.status = 'fulfilled';
			this.data = data;
			safelyExecuteFunction(this.onFulfilled, this, this.data);
		}
	}

	reject(err) {
		if (this.status === 'pending') {
			this.status = 'rejected';
			this.error = err;
			safelyExecuteFunction(this.onRejected, this, this.error);
		}
	}

	then(onFulfilled, onRejected) {
		if (!isFunction(onFulfilled)) {
			throw new Error('First Param is required and should be a function');
		}

		if (onRejected && !isFunction(onRejected)) {
			throw new Error('If Second Param is supplied it needs to be a function');
		}

		this.onFulfilled = onFulfilled;
		this.onRejected = onRejected;

		if (this.data) {
			safelyExecuteFunction(onFulfilled, this, this.data);
		}

		if (this.error) {
			safelyExecuteFunction(onRejected, this, new Error(this.error));
		}

		return this;
	}

	catch(onRejected) {
		if (!isFunction(onRejected)) {
			throw new Error('Param supplied should be of type Function');
		}

		this.status === 'rejected' && safelyExecuteFunction(onRejected, null, this.data);
		return this;
	}

	finally(callback) {
		if (!isFunction(callback)) {
			throw new Error('Param supplied should be of of type fuction');
		}
		['fulfilled', 'rejected'].includes(this.status) && safelyExecuteFunction(callback);
		return this;
	}
}

myPromise.resolve = function (data) {
	return new myPromise(function (resolve) {
		resolve(data);
	});
};

myPromise.reject = function (error) {
	return new myPromise(function (undefined, reject) {
		reject(error);
	});
};

myPromise.all = function (promises) {
	if (!isArray(promises)) {
		throw new Error('Parameter expected of type array');
	}

	return new myPromise((resolve, reject) => {
		const result = {};
		let countOfResolvedPromises = 0;

		for (let i = 0; i < promises.length; i++) {
			const promise = promises[i];
			if (!isFunction(promise.then)) {
				reject();
				throw new Error('expected Parameter is array of promises');
			}
			result[i] = promise;
			promise.then(
				(data) => {
					countOfResolvedPromises++;
					result[i] = data;
					if (promises.length == countOfResolvedPromises) {
						resolve(Object.values(result));
					}
				},
				(err) => {
					reject(err);
					throw new Error(err);
				},
			);
		}
	});
};

myPromise.allSettled = function (promises) {
	if (!isArray(promises)) {
		throw new Error('Parameter expected of type array');
	}

	return new myPromise((resolve, reject) => {
		const result = {};
		let countOfResolvedPromises = 0;

		promises.forEach((promise, index) => {
			if (!isFunction(promise.then)) {
				reject();
				throw new Error('expected Parameter is array of promises');
			}
			result[index] = promise;
			promise.then(
				(data) => {
					countOfResolvedPromises++;
					result[index] = data;
					if (promises.length == countOfResolvedPromises) {
						resolve(Object.values(result));
					}
				},
				(err) => {
					countOfResolvedPromises++;
					result[index] = err;
					if (promises.length == countOfResolvedPromises) {
						reject(Object.values(result));
					}
				},
			);
		});
	});
};

myPromise.race = function (promises) {
	if (!isArray(promises)) {
		throw new Error('Parameter expected of type array');
	}

	return new myPromise((resolve, reject) => {
		for (let promise of promises) {
			promise.then(
				(data) => {
					resolve(data);
					return;
				},
				(err) => {
					reject(new Error());
					return;
				},
			);
		}
	});
};

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
